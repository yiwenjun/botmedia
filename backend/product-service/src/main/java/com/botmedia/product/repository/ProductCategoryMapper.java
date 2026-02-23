package com.botmedia.product.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.product.entity.ProductCategory;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProductCategoryMapper extends BaseMapper<ProductCategory> {
}
