package com.botmedia.content.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.content.entity.Category;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}
