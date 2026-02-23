package com.botmedia.content.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.content.entity.ArticleTag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArticleTagMapper extends BaseMapper<ArticleTag> {

    /**
     * Delete all tags for an article
     */
    int deleteByArticleId(@Param("articleId") Long articleId);

    /**
     * Find all tag IDs for an article
     */
    List<Long> findTagIdsByArticleId(@Param("articleId") Long articleId);
}
