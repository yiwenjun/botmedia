package com.botmedia.analytics.service;

import com.botmedia.analytics.dto.ArticleStatsVO;
import com.botmedia.analytics.dto.DashboardStatsVO;
import com.botmedia.analytics.dto.ViewTrackRequest;
import com.botmedia.analytics.entity.DailyStatistics;

import java.time.LocalDate;
import java.util.List;

/**
 * Analytics Service Interface
 * Handles analytics tracking and statistics
 */
public interface AnalyticsService {

    /**
     * Track an article view
     * @param request view tracking request
     */
    void trackView(ViewTrackRequest request);

    /**
     * Get top articles by view count
     * @param limit number of top articles to return
     * @return list of article statistics
     */
    List<ArticleStatsVO> getTopArticles(int limit);

    /**
     * Get dashboard statistics
     * @return dashboard statistics
     */
    DashboardStatsVO getDashboardStats();

    /**
     * Get daily statistics for a date range
     * @param startDate start date
     * @param endDate end date
     * @return list of daily statistics
     */
    List<DailyStatistics> getDailyStats(LocalDate startDate, LocalDate endDate);
}
