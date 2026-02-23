package com.botmedia.analytics.dto;

import com.botmedia.analytics.entity.ArticleView;

import java.util.List;

/**
 * Dashboard Statistics VO
 * Statistics data for dashboard display
 */
public class DashboardStatsVO {

    /**
     * Today's total views
     */
    private Long todayViews;

    /**
     * Total views (all time)
     */
    private Long totalViews;

    /**
     * Total articles
     */
    private Long totalArticles;

    /**
     * Total users
     */
    private Long totalUsers;

    /**
     * Recent views list
     */
    private List<ArticleView> recentViews;

    public Long getTodayViews() {
        return todayViews;
    }

    public void setTodayViews(Long todayViews) {
        this.todayViews = todayViews;
    }

    public Long getTotalViews() {
        return totalViews;
    }

    public void setTotalViews(Long totalViews) {
        this.totalViews = totalViews;
    }

    public Long getTotalArticles() {
        return totalArticles;
    }

    public void setTotalArticles(Long totalArticles) {
        this.totalArticles = totalArticles;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public List<ArticleView> getRecentViews() {
        return recentViews;
    }

    public void setRecentViews(List<ArticleView> recentViews) {
        this.recentViews = recentViews;
    }
}
