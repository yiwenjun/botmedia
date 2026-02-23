package com.botmedia.analytics.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.analytics.entity.ArticleView;
import org.apache.ibatis.annotations.Mapper;

/**
 * Article View Mapper
 * Repository interface for ArticleView entity
 */
@Mapper
public interface ArticleViewMapper extends BaseMapper<ArticleView> {
}
