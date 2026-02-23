package com.botmedia.analytics.dto;

import javax.validation.constraints.NotNull;

/**
 * View Track Request DTO
 * Request data for tracking article views
 */
public class ViewTrackRequest {

    @NotNull(message = "Article ID is required")
    private Long articleId;

    private Long userId;

    private String ipAddress;

    private String userAgent;

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}
