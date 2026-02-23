package com.botmedia.content.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.common.response.ApiResponse;
import com.botmedia.content.dto.ArticleCreateRequest;
import com.botmedia.content.dto.ArticleUpdateRequest;
import com.botmedia.content.dto.ArticleVO;
import com.botmedia.content.service.ArticleService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public ApiResponse<IPage<ArticleVO>> listArticles(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long categoryId) {
        
        IPage<ArticleVO> articles = articleService.listArticles(current, size, status, categoryId);
        return ApiResponse.success(articles);
    }

    @GetMapping("/{id}")
    public ApiResponse<ArticleVO> getArticle(@PathVariable Long id) {
        ArticleVO article = articleService.getArticle(id);
        return ApiResponse.success(article);
    }

    @PostMapping
    public ApiResponse<ArticleVO> createArticle(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody ArticleCreateRequest request) {
        
        ArticleVO article = articleService.createArticle(userId, request);
        return ApiResponse.success(article);
    }

    @PutMapping("/{id}")
    public ApiResponse<ArticleVO> updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody ArticleUpdateRequest request) {
        
        ArticleVO article = articleService.updateArticle(id, request);
        return ApiResponse.success(article);
    }

    @PostMapping("/{id}/publish")
    public ApiResponse<ArticleVO> publishArticle(@PathVariable Long id) {
        ArticleVO article = articleService.publishArticle(id);
        return ApiResponse.success(article);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ApiResponse.success(null);
    }
}
