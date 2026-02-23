package com.botmedia.content.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.content.entity.Article;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ArticleMapper extends BaseMapper<Article> {
}
