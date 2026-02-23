package com.botmedia.analytics.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Daily Statistics Entity
 * Stores aggregated daily statistics
 */
@TableName("daily_statistics")
public class DailyStatistics {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * Date for the statistics
     */
    private LocalDate statDate;

    /**
     * Total page views for the day
     */
    private Long totalViews;

    /**
     * Unique visitors for the day
     */
    private Long uniqueVisitors;

    /**
     * New users registered on the day
     */
    private Long newUsers;

    /**
     * Articles published on the day
     */
    private Long articlesPublished;

    /**
     * Timestamp when record was created
     */
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStatDate() {
        return statDate;
    }

    public void setStatDate(LocalDate statDate) {
        this.statDate = statDate;
    }

    public Long getTotalViews() {
        return totalViews;
    }

    public void setTotalViews(Long totalViews) {
        this.totalViews = totalViews;
    }

    public Long getUniqueVisitors() {
        return uniqueVisitors;
    }

    public void setUniqueVisitors(Long uniqueVisitors) {
        this.uniqueVisitors = uniqueVisitors;
    }

    public Long getNewUsers() {
        return newUsers;
    }

    public void setNewUsers(Long newUsers) {
        this.newUsers = newUsers;
    }

    public Long getArticlesPublished() {
        return articlesPublished;
    }

    public void setArticlesPublished(Long articlesPublished) {
        this.articlesPublished = articlesPublished;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
