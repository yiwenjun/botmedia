package com.botmedia.analytics.dto;

/**
 * Article Statistics VO
 * Statistics for a specific article
 */
public class ArticleStatsVO {

    /**
     * Article ID
     */
    private Long articleId;

    /**
     * Total view count for the article
     */
    private Long viewCount;

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public Long getViewCount() {
        return viewCount;
    }

    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }
}
