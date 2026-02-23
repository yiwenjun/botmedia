package com.botmedia.payment.dto;

/**
 * WeChat Pay Response DTO
 * Contains payment parameters for frontend to call WeChat payment
 */
public class WechatPayResponse {

    /**
     * Prepay ID from WeChat
     */
    private String prepayId;

    /**
     * Random string
     */
    private String nonceStr;

    /**
     * Timestamp
     */
    private String timestamp;

    /**
     * Signature
     */
    private String sign;

    /**
     * Package value for WeChat JSAPI
     */
    private String packageValue;

    public String getPrepayId() {
        return prepayId;
    }

    public void setPrepayId(String prepayId) {
        this.prepayId = prepayId;
    }

    public String getNonceStr() {
        return nonceStr;
    }

    public void setNonceStr(String nonceStr) {
        this.nonceStr = nonceStr;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public String getPackageValue() {
        return packageValue;
    }

    public void setPackageValue(String packageValue) {
        this.packageValue = packageValue;
    }
}
