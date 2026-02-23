package com.botmedia.content.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.botmedia.common.exception.BusinessException;
import com.botmedia.content.dto.ArticleCreateRequest;
import com.botmedia.content.dto.ArticleUpdateRequest;
import com.botmedia.content.dto.ArticleVO;
import com.botmedia.content.dto.TagVO;
import com.botmedia.content.entity.Article;
import com.botmedia.content.entity.ArticleTag;
import com.botmedia.content.entity.Category;
import com.botmedia.content.entity.Tag;
import com.botmedia.content.repository.ArticleMapper;
import com.botmedia.content.repository.ArticleTagMapper;
import com.botmedia.content.repository.CategoryMapper;
import com.botmedia.content.repository.TagMapper;
import com.botmedia.content.service.ArticleService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleServiceImpl implements ArticleService {

    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final ArticleTagMapper articleTagMapper;

    public ArticleServiceImpl(ArticleMapper articleMapper, CategoryMapper categoryMapper, 
                             TagMapper tagMapper, ArticleTagMapper articleTagMapper) {
        this.articleMapper = articleMapper;
        this.categoryMapper = categoryMapper;
        this.tagMapper = tagMapper;
        this.articleTagMapper = articleTagMapper;
    }

    @Override
    @Transactional
    public ArticleVO createArticle(Long authorId, ArticleCreateRequest request) {
        Article article = new Article();
        article.setTitle(request.getTitle());
        article.setSummary(request.getSummary());
        article.setContent(request.getContent());
        article.setCoverImage(request.getCoverImage());
        article.setAuthorId(authorId);
        article.setCategoryId(request.getCategoryId());
        article.setStatus(request.getStatus() != null ? request.getStatus() : 0);
        article.setIsFeatured(false);
        article.setViewCount(0L);

        articleMapper.insert(article);

        if (!CollectionUtils.isEmpty(request.getTagIds())) {
            saveTags(article.getId(), request.getTagIds());
        }

        return getArticle(article.getId());
    }

    @Override
    @Transactional
    public ArticleVO updateArticle(Long id, ArticleUpdateRequest request) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException("Article not found");
        }

        if (request.getTitle() != null) {
            article.setTitle(request.getTitle());
        }
        if (request.getSummary() != null) {
            article.setSummary(request.getSummary());
        }
        if (request.getContent() != null) {
            article.setContent(request.getContent());
        }
        if (request.getCoverImage() != null) {
            article.setCoverImage(request.getCoverImage());
        }
        if (request.getCategoryId() != null) {
            article.setCategoryId(request.getCategoryId());
        }
        if (request.getStatus() != null) {
            article.setStatus(request.getStatus());
        }

        articleMapper.updateById(article);

        if (request.getTagIds() != null) {
            articleTagMapper.deleteByArticleId(id);
            if (!request.getTagIds().isEmpty()) {
                saveTags(id, request.getTagIds());
            }
        }

        return getArticle(id);
    }

    @Override
    @Transactional
    public ArticleVO getArticle(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException("Article not found");
        }

        article.setViewCount(article.getViewCount() + 1);
        articleMapper.updateById(article);

        return convertToVO(article);
    }

    @Override
    public IPage<ArticleVO> listArticles(long current, long size, Integer status, Long categoryId) {
        Page<Article> page = new Page<>(current, size);
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        
        if (status != null) {
            wrapper.eq(Article::getStatus, status);
        }
        if (categoryId != null) {
            wrapper.eq(Article::getCategoryId, categoryId);
        }
        
        wrapper.orderByDesc(Article::getCreatedAt);

        IPage<Article> articlePage = articleMapper.selectPage(page, wrapper);
        
        IPage<ArticleVO> voPage = new Page<>(articlePage.getCurrent(), articlePage.getSize(), articlePage.getTotal());
        List<ArticleVO> voList = articlePage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
        voPage.setRecords(voList);

        return voPage;
    }

    @Override
    @Transactional
    public ArticleVO publishArticle(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException("Article not found");
        }

        article.setStatus(2);
        article.setPublishedAt(LocalDateTime.now());
        articleMapper.updateById(article);

        return convertToVO(article);
    }

    @Override
    @Transactional
    public void deleteArticle(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BusinessException("Article not found");
        }

        articleMapper.deleteById(id);
        articleTagMapper.deleteByArticleId(id);
    }

    private void saveTags(Long articleId, List<Long> tagIds) {
        for (Long tagId : tagIds) {
            ArticleTag articleTag = new ArticleTag();
            articleTag.setArticleId(articleId);
            articleTag.setTagId(tagId);
            articleTagMapper.insert(articleTag);
        }
    }

    private ArticleVO convertToVO(Article article) {
        ArticleVO vo = new ArticleVO();
        BeanUtils.copyProperties(article, vo);

        if (article.getCategoryId() != null) {
            Category category = categoryMapper.selectById(article.getCategoryId());
            if (category != null) {
                vo.setCategoryName(category.getName());
            }
        }

        List<Long> tagIds = articleTagMapper.findTagIdsByArticleId(article.getId());
        if (!CollectionUtils.isEmpty(tagIds)) {
            List<TagVO> tags = new ArrayList<>();
            for (Long tagId : tagIds) {
                Tag tag = tagMapper.selectById(tagId);
                if (tag != null) {
                    TagVO tagVO = new TagVO();
                    BeanUtils.copyProperties(tag, tagVO);
                    tags.add(tagVO);
                }
            }
            vo.setTags(tags);
        }

        vo.setAuthorName("Author-" + article.getAuthorId());

        return vo;
    }
}
