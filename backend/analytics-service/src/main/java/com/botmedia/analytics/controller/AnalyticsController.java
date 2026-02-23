package com.botmedia.analytics.controller;

import com.botmedia.analytics.dto.ArticleStatsVO;
import com.botmedia.analytics.dto.DashboardStatsVO;
import com.botmedia.analytics.dto.ViewTrackRequest;
import com.botmedia.analytics.entity.DailyStatistics;
import com.botmedia.analytics.service.AnalyticsService;
import com.botmedia.common.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;

/**
 * Analytics Controller
 * REST API for analytics tracking and statistics
 */
@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsController.class);

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * Track an article view
     * @param request view tracking request
     * @return success response
     */
    @PostMapping("/views")
    public ApiResponse<Void> trackView(@Valid @RequestBody ViewTrackRequest request) {
        log.info("Tracking view for article: {}", request.getArticleId());
        analyticsService.trackView(request);
        return ApiResponse.success(null);
    }

    /**
     * Get top articles by view count
     * @param limit number of top articles to return (default 10)
     * @return list of top articles
     */
    @GetMapping("/articles/top")
    public ApiResponse<List<ArticleStatsVO>> getTopArticles(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Getting top {} articles", limit);
        List<ArticleStatsVO> topArticles = analyticsService.getTopArticles(limit);
        return ApiResponse.success(topArticles);
    }

    /**
     * Get dashboard statistics
     * @return dashboard statistics
     */
    @GetMapping("/dashboard")
    public ApiResponse<DashboardStatsVO> getDashboardStats() {
        log.info("Getting dashboard statistics");
        DashboardStatsVO stats = analyticsService.getDashboardStats();
        return ApiResponse.success(stats);
    }

    /**
     * Get daily statistics for a date range
     * @param startDate start date (format: yyyy-MM-dd)
     * @param endDate end date (format: yyyy-MM-dd)
     * @return list of daily statistics
     */
    @GetMapping("/reports/daily")
    public ApiResponse<List<DailyStatistics>> getDailyReports(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Getting daily reports from {} to {}", startDate, endDate);
        List<DailyStatistics> stats = analyticsService.getDailyStats(startDate, endDate);
        return ApiResponse.success(stats);
    }
}
