package com.botmedia.payment.dto;

import javax.validation.constraints.NotBlank;

/**
 * WeChat Pay Request DTO
 * Used to initiate WeChat payment
 */
public class WechatPayRequest {

    /**
     * Order number (required)
     */
    @NotBlank(message = "Order number cannot be blank")
    private String orderNo;

    /**
     * User's WeChat OpenID (required for payment)
     */
    @NotBlank(message = "OpenID cannot be blank")
    private String openid;

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }
}
