package com.botmedia.payment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.botmedia.payment.dto.CreateOrderRequest;
import com.botmedia.payment.dto.OrderVO;
import com.botmedia.payment.dto.TransactionVO;
import com.botmedia.payment.dto.WechatPayResponse;
import com.botmedia.payment.entity.Order;
import com.botmedia.payment.entity.Transaction;
import com.botmedia.payment.repository.OrderMapper;
import com.botmedia.payment.repository.TransactionMapper;
import com.botmedia.payment.service.PaymentService;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.bean.result.WxPayUnifiedOrderResult;
import com.github.binarywang.wxpay.service.WxPayService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Payment Service Implementation
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    private final OrderMapper orderMapper;
    private final TransactionMapper transactionMapper;
    private final WxPayService wxPayService;

    public PaymentServiceImpl(OrderMapper orderMapper, TransactionMapper transactionMapper, WxPayService wxPayService) {
        this.orderMapper = orderMapper;
        this.transactionMapper = transactionMapper;
        this.wxPayService = wxPayService;
    }

    @Override
    @Transactional
    public OrderVO createOrder(Long userId, CreateOrderRequest request) {
        // Generate unique order number: timestamp + random UUID
        String orderNo = System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);

        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setProductId(request.getProductId());
        order.setProductName(request.getProductName());
        order.setAmount(request.getAmount());
        order.setStatus(0); // Pending
        order.setRemark(request.getRemark());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        orderMapper.insert(order);

        return convertToOrderVO(order, null);
    }

    @Override
    public OrderVO getOrder(String orderNo) {
        Order order = orderMapper.findByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("Order not found: " + orderNo);
        }

        // Fetch associated transactions
        LambdaQueryWrapper<Transaction> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Transaction::getOrderId, order.getId());
        List<Transaction> transactions = transactionMapper.selectList(queryWrapper);

        List<TransactionVO> transactionVOs = transactions.stream()
                .map(this::convertToTransactionVO)
                .collect(Collectors.toList());

        return convertToOrderVO(order, transactionVOs);
    }

    @Override
    public WechatPayResponse initiateWechatPay(String orderNo, String openid) {
        Order order = orderMapper.findByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("Order not found: " + orderNo);
        }

        if (order.getStatus() != 0) {
            throw new RuntimeException("Order is not in pending status");
        }

        try {
            // Create unified order request
            WxPayUnifiedOrderRequest orderRequest = new WxPayUnifiedOrderRequest();
            orderRequest.setOutTradeNo(orderNo);
            orderRequest.setBody(order.getProductName());
            orderRequest.setTotalFee(order.getAmount().multiply(new BigDecimal("100")).intValue()); // Convert to cents
            orderRequest.setOpenid(openid);
            orderRequest.setTradeType("JSAPI");

            // Call WeChat Pay API
            WxPayUnifiedOrderResult result = wxPayService.unifiedOrder(orderRequest);

            // Update order payment method
            order.setPaymentMethod("wechat");
            order.setUpdatedAt(LocalDateTime.now());
            orderMapper.updateById(order);

            // Create response
            WechatPayResponse response = new WechatPayResponse();
            response.setPrepayId(result.getPrepayId());
            response.setNonceStr(result.getNonceStr());
            response.setTimestamp(String.valueOf(System.currentTimeMillis() / 1000));
            response.setPackageValue("prepay_id=" + result.getPrepayId());
            // Sign would be calculated here in production
            response.setSign(result.getSign());

            return response;
        } catch (Exception e) {
            log.error("Failed to initiate WeChat payment for order: {}", orderNo, e);
            throw new RuntimeException("Failed to initiate WeChat payment: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public String handleWechatPayCallback(String xmlData) {
        try {
            // Parse and verify callback data
            com.github.binarywang.wxpay.bean.notify.WxPayOrderNotifyResult notifyResult =
                    wxPayService.parseOrderNotifyResult(xmlData);

            String orderNo = notifyResult.getOutTradeNo();
            String transactionId = notifyResult.getTransactionId();

            Order order = orderMapper.findByOrderNo(orderNo);
            if (order == null) {
                log.error("Order not found in callback: {}", orderNo);
                return createFailXml("Order not found");
            }

            // Update order status to PAID
            order.setStatus(1);
            order.setTransactionId(transactionId);
            order.setUpdatedAt(LocalDateTime.now());
            orderMapper.updateById(order);

            // Create transaction record
            Transaction transaction = new Transaction();
            transaction.setOrderId(order.getId());
            transaction.setTransactionNo(transactionId);
            transaction.setAmount(order.getAmount());
            transaction.setType(1); // Payment
            transaction.setStatus(1); // Success
            transaction.setPaymentTime(LocalDateTime.now());
            transaction.setCallbackData(xmlData);
            transaction.setCreatedAt(LocalDateTime.now());
            transactionMapper.insert(transaction);

            log.info("Payment callback processed successfully for order: {}", orderNo);
            return createSuccessXml();
        } catch (Exception e) {
            log.error("Failed to process payment callback", e);
            return createFailXml("Failed to process callback");
        }
    }

    @Override
    @Transactional
    public OrderVO refundOrder(String orderNo) {
        Order order = orderMapper.findByOrderNo(orderNo);
        if (order == null) {
            throw new RuntimeException("Order not found: " + orderNo);
        }

        if (order.getStatus() != 1) {
            throw new RuntimeException("Order is not in paid status");
        }

        try {
            // Create refund request
            com.github.binarywang.wxpay.bean.request.WxPayRefundRequest refundRequest =
                    new com.github.binarywang.wxpay.bean.request.WxPayRefundRequest();
            refundRequest.setOutTradeNo(orderNo);
            refundRequest.setOutRefundNo(orderNo + "-REFUND-" + System.currentTimeMillis());
            refundRequest.setTotalFee(order.getAmount().multiply(new BigDecimal("100")).intValue());
            refundRequest.setRefundFee(order.getAmount().multiply(new BigDecimal("100")).intValue());

            // Call WeChat refund API
            com.github.binarywang.wxpay.bean.result.WxPayRefundResult refundResult =
                    wxPayService.refund(refundRequest);

            // Update order status to REFUNDED
            order.setStatus(3);
            order.setUpdatedAt(LocalDateTime.now());
            orderMapper.updateById(order);

            // Create refund transaction record
            Transaction transaction = new Transaction();
            transaction.setOrderId(order.getId());
            transaction.setTransactionNo(refundResult.getRefundId());
            transaction.setAmount(order.getAmount());
            transaction.setType(2); // Refund
            transaction.setStatus(1); // Success
            transaction.setPaymentTime(LocalDateTime.now());
            transaction.setCreatedAt(LocalDateTime.now());
            transactionMapper.insert(transaction);

            return getOrder(orderNo);
        } catch (Exception e) {
            log.error("Failed to refund order: {}", orderNo, e);
            throw new RuntimeException("Failed to refund order: " + e.getMessage());
        }
    }

    @Override
    public IPage<OrderVO> listOrders(Long userId, long current, long size) {
        Page<Order> page = new Page<>(current, size);
        LambdaQueryWrapper<Order> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Order::getUserId, userId)
                .orderByDesc(Order::getCreatedAt);

        IPage<Order> orderPage = orderMapper.selectPage(page, queryWrapper);

        // Convert to OrderVO
        IPage<OrderVO> orderVOPage = new Page<>(current, size);
        orderVOPage.setTotal(orderPage.getTotal());
        orderVOPage.setRecords(
                orderPage.getRecords().stream()
                        .map(order -> convertToOrderVO(order, null))
                        .collect(Collectors.toList())
        );

        return orderVOPage;
    }

    /**
     * Convert Order entity to OrderVO
     */
    private OrderVO convertToOrderVO(Order order, List<TransactionVO> transactions) {
        OrderVO orderVO = new OrderVO();
        BeanUtils.copyProperties(order, orderVO);
        orderVO.setTransactions(transactions);
        return orderVO;
    }

    /**
     * Convert Transaction entity to TransactionVO
     */
    private TransactionVO convertToTransactionVO(Transaction transaction) {
        TransactionVO transactionVO = new TransactionVO();
        BeanUtils.copyProperties(transaction, transactionVO);
        return transactionVO;
    }

    /**
     * Create success XML response for WeChat callback
     */
    private String createSuccessXml() {
        return "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
    }

    /**
     * Create fail XML response for WeChat callback
     */
    private String createFailXml(String message) {
        return "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[" + message + "]]></return_msg></xml>";
    }
}
