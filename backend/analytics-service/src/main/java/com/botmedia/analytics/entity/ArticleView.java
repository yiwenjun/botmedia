package com.botmedia.analytics.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * Article View Entity
 * Tracks individual article views
 */
@TableName("article_view")
public class ArticleView {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * Article ID that was viewed
     */
    private Long articleId;

    /**
     * User ID who viewed (nullable for anonymous)
     */
    private Long userId;

    /**
     * IP address of the viewer
     */
    private String ipAddress;

    /**
     * User agent string
     */
    private String userAgent;

    /**
     * Timestamp when the view occurred
     */
    private LocalDateTime viewedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(LocalDateTime viewedAt) {
        this.viewedAt = viewedAt;
    }
}
