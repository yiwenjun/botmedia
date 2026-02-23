package com.botmedia.analytics.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.botmedia.analytics.dto.ArticleStatsVO;
import com.botmedia.analytics.dto.DashboardStatsVO;
import com.botmedia.analytics.dto.ViewTrackRequest;
import com.botmedia.analytics.entity.ArticleView;
import com.botmedia.analytics.entity.DailyStatistics;
import com.botmedia.analytics.repository.ArticleViewMapper;
import com.botmedia.analytics.repository.DailyStatisticsMapper;
import com.botmedia.analytics.service.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Analytics Service Implementation
 */
@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsServiceImpl.class);

    @Autowired
    private ArticleViewMapper articleViewMapper;

    @Autowired
    private DailyStatisticsMapper dailyStatisticsMapper;

    @Override
    public void trackView(ViewTrackRequest request) {
        ArticleView view = new ArticleView();
        view.setArticleId(request.getArticleId());
        view.setUserId(request.getUserId());
        view.setIpAddress(request.getIpAddress());
        view.setUserAgent(request.getUserAgent());
        view.setViewedAt(LocalDateTime.now());

        articleViewMapper.insert(view);
        log.info("Tracked view for article: {}", request.getArticleId());
    }

    @Override
    public List<ArticleStatsVO> getTopArticles(int limit) {
        // Get all views
        List<ArticleView> allViews = articleViewMapper.selectList(null);

        // Group by article ID and count
        Map<Long, Long> viewCounts = new HashMap<>();
        for (ArticleView view : allViews) {
            viewCounts.put(view.getArticleId(),
                    viewCounts.getOrDefault(view.getArticleId(), 0L) + 1);
        }

        // Convert to ArticleStatsVO and sort by view count
        return viewCounts.entrySet().stream()
                .map(entry -> {
                    ArticleStatsVO stats = new ArticleStatsVO();
                    stats.setArticleId(entry.getKey());
                    stats.setViewCount(entry.getValue());
                    return stats;
                })
                .sorted((a, b) -> Long.compare(b.getViewCount(), a.getViewCount()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public DashboardStatsVO getDashboardStats() {
        DashboardStatsVO stats = new DashboardStatsVO();

        // Get today's views
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime todayEnd = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        LambdaQueryWrapper<ArticleView> todayWrapper = new LambdaQueryWrapper<>();
        todayWrapper.between(ArticleView::getViewedAt, todayStart, todayEnd);
        Long todayViews = articleViewMapper.selectCount(todayWrapper);
        stats.setTodayViews(todayViews);

        // Get total views
        Long totalViews = articleViewMapper.selectCount(null);
        stats.setTotalViews(totalViews);

        // For total articles and users, we would need to call other services
        // For now, setting to 0 as placeholder
        stats.setTotalArticles(0L);
        stats.setTotalUsers(0L);

        // Get recent views (last 10)
        LambdaQueryWrapper<ArticleView> recentWrapper = new LambdaQueryWrapper<>();
        recentWrapper.orderByDesc(ArticleView::getViewedAt).last("LIMIT 10");
        List<ArticleView> recentViews = articleViewMapper.selectList(recentWrapper);
        stats.setRecentViews(recentViews);

        return stats;
    }

    @Override
    public List<DailyStatistics> getDailyStats(LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<DailyStatistics> wrapper = new LambdaQueryWrapper<>();
        wrapper.between(DailyStatistics::getStatDate, startDate, endDate);
        wrapper.orderByAsc(DailyStatistics::getStatDate);

        return dailyStatisticsMapper.selectList(wrapper);
    }
}
