package com.botmedia.payment.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Create Order Request DTO
 */
public class CreateOrderRequest {

    /**
     * Product ID (required)
     */
    @NotNull(message = "Product ID cannot be null")
    private Long productId;

    /**
     * Product name
     */
    private String productName;

    /**
     * Order amount (required)
     */
    @NotNull(message = "Amount cannot be null")
    private BigDecimal amount;

    /**
     * Order remark/note
     */
    private String remark;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
