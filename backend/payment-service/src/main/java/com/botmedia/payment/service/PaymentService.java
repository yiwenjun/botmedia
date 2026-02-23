package com.botmedia.payment.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.payment.dto.CreateOrderRequest;
import com.botmedia.payment.dto.OrderVO;
import com.botmedia.payment.dto.WechatPayResponse;

/**
 * Payment Service Interface
 * Handles payment processing and transaction management
 */
public interface PaymentService {

    /**
     * Create a new order
     *
     * @param userId the user ID
     * @param request the order creation request
     * @return the created order
     */
    OrderVO createOrder(Long userId, CreateOrderRequest request);

    /**
     * Get order by order number
     *
     * @param orderNo the order number
     * @return the order with transactions
     */
    OrderVO getOrder(String orderNo);

    /**
     * Initiate WeChat payment for an order
     *
     * @param orderNo the order number
     * @param openid the user's WeChat OpenID
     * @return WeChat payment parameters for frontend
     */
    WechatPayResponse initiateWechatPay(String orderNo, String openid);

    /**
     * Handle WeChat payment callback
     *
     * @param xmlData the callback XML data from WeChat
     * @return success or fail XML response
     */
    String handleWechatPayCallback(String xmlData);

    /**
     * Refund an order
     *
     * @param orderNo the order number
     * @return the updated order
     */
    OrderVO refundOrder(String orderNo);

    /**
     * List orders for a user with pagination
     *
     * @param userId the user ID
     * @param current current page number
     * @param size page size
     * @return paginated orders
     */
    IPage<OrderVO> listOrders(Long userId, long current, long size);
}
