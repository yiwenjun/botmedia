package com.botmedia.payment.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.common.response.ApiResponse;
import com.botmedia.payment.dto.CreateOrderRequest;
import com.botmedia.payment.dto.OrderVO;
import com.botmedia.payment.dto.WechatPayRequest;
import com.botmedia.payment.dto.WechatPayResponse;
import com.botmedia.payment.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Payment Controller
 * REST API for payment operations
 */
@RestController
@RequestMapping("/api/v1/payments")
@Validated
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Create a new order
     *
     * @param userId user ID from header
     * @param request order creation request
     * @return created order
     */
    @PostMapping("/orders")
    public ApiResponse<OrderVO> createOrder(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateOrderRequest request) {
        try {
            OrderVO order = paymentService.createOrder(userId, request);
            return ApiResponse.success("Order created successfully", order);
        } catch (Exception e) {
            log.error("Failed to create order", e);
            return ApiResponse.error("Failed to create order: " + e.getMessage());
        }
    }

    /**
     * Get order by order number
     *
     * @param orderNo order number
     * @return order details
     */
    @GetMapping("/orders/{orderNo}")
    public ApiResponse<OrderVO> getOrder(@PathVariable String orderNo) {
        try {
            OrderVO order = paymentService.getOrder(orderNo);
            return ApiResponse.success(order);
        } catch (Exception e) {
            log.error("Failed to get order: {}", orderNo, e);
            return ApiResponse.notFound("Order not found: " + orderNo);
        }
    }

    /**
     * Initiate WeChat payment
     *
     * @param request WeChat pay request containing orderNo and openid
     * @return WeChat payment parameters for frontend
     */
    @PostMapping("/wechat/pay")
    public ApiResponse<WechatPayResponse> initiateWechatPay(@Valid @RequestBody WechatPayRequest request) {
        try {
            WechatPayResponse response = paymentService.initiateWechatPay(
                    request.getOrderNo(),
                    request.getOpenid()
            );
            return ApiResponse.success("Payment initiated successfully", response);
        } catch (Exception e) {
            log.error("Failed to initiate WeChat payment", e);
            return ApiResponse.error("Failed to initiate payment: " + e.getMessage());
        }
    }

    /**
     * WeChat payment callback endpoint
     * This endpoint receives raw XML from WeChat and returns XML response
     *
     * @param xmlData raw XML callback data from WeChat
     * @return XML response (success or fail)
     */
    @PostMapping(value = "/wechat/callback",
            consumes = MediaType.APPLICATION_XML_VALUE,
            produces = MediaType.APPLICATION_XML_VALUE)
    public String handleWechatPayCallback(@RequestBody String xmlData) {
        log.info("Received WeChat payment callback");
        return paymentService.handleWechatPayCallback(xmlData);
    }

    /**
     * Refund an order
     *
     * @param orderNo order number
     * @return updated order after refund
     */
    @PostMapping("/orders/{orderNo}/refund")
    public ApiResponse<OrderVO> refundOrder(@PathVariable String orderNo) {
        try {
            OrderVO order = paymentService.refundOrder(orderNo);
            return ApiResponse.success("Order refunded successfully", order);
        } catch (Exception e) {
            log.error("Failed to refund order: {}", orderNo, e);
            return ApiResponse.error("Failed to refund order: " + e.getMessage());
        }
    }

    /**
     * List orders for a user with pagination
     *
     * @param userId user ID from header
     * @param current current page number (default: 1)
     * @param size page size (default: 10)
     * @return paginated orders
     */
    @GetMapping("/orders")
    public ApiResponse<IPage<OrderVO>> listOrders(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size) {
        try {
            IPage<OrderVO> orders = paymentService.listOrders(userId, current, size);
            return ApiResponse.success(orders);
        } catch (Exception e) {
            log.error("Failed to list orders for user: {}", userId, e);
            return ApiResponse.error("Failed to list orders: " + e.getMessage());
        }
    }
}
