package com.botmedia.content.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.content.dto.ArticleCreateRequest;
import com.botmedia.content.dto.ArticleUpdateRequest;
import com.botmedia.content.dto.ArticleVO;

public interface ArticleService {

    /**
     * Create a new article
     */
    ArticleVO createArticle(Long authorId, ArticleCreateRequest request);

    /**
     * Update an existing article
     */
    ArticleVO updateArticle(Long id, ArticleUpdateRequest request);

    /**
     * Get article by ID (increments view count)
     */
    ArticleVO getArticle(Long id);

    /**
     * List articles with pagination and filters
     */
    IPage<ArticleVO> listArticles(long current, long size, Integer status, Long categoryId);

    /**
     * Publish an article
     */
    ArticleVO publishArticle(Long id);

    /**
     * Delete an article (soft delete)
     */
    void deleteArticle(Long id);
}
