package com.botmedia.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.botmedia.product.dto.ProductCategoryRequest;
import com.botmedia.product.dto.ProductCategoryVO;
import com.botmedia.product.entity.ProductCategory;
import com.botmedia.product.repository.ProductCategoryMapper;
import com.botmedia.product.service.ProductCategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryMapper productCategoryMapper;

    public ProductCategoryServiceImpl(ProductCategoryMapper productCategoryMapper) {
        this.productCategoryMapper = productCategoryMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductCategoryVO createCategory(ProductCategoryRequest request) {
        ProductCategory category = new ProductCategory();
        BeanUtils.copyProperties(request, category);
        
        if (category.getSortOrder() == null) {
            category.setSortOrder(0);
        }
        
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        
        productCategoryMapper.insert(category);
        
        return convertToVO(category);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductCategoryVO updateCategory(Long id, ProductCategoryRequest request) {
        ProductCategory category = productCategoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        
        if (StringUtils.hasText(request.getName())) {
            category.setName(request.getName());
        }
        if (StringUtils.hasText(request.getSlug())) {
            category.setSlug(request.getSlug());
        }
        if (request.getParentId() != null) {
            category.setParentId(request.getParentId());
        }
        if (request.getSortOrder() != null) {
            category.setSortOrder(request.getSortOrder());
        }
        if (StringUtils.hasText(request.getDescription())) {
            category.setDescription(request.getDescription());
        }
        
        category.setUpdatedAt(LocalDateTime.now());
        productCategoryMapper.updateById(category);
        
        return convertToVO(category);
    }

    @Override
    public List<ProductCategoryVO> listCategories() {
        LambdaQueryWrapper<ProductCategory> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(ProductCategory::getSortOrder)
               .orderByAsc(ProductCategory::getCreatedAt);
        
        List<ProductCategory> allCategories = productCategoryMapper.selectList(wrapper);
        
        // Convert to VO list
        List<ProductCategoryVO> voList = allCategories.stream()
            .map(this::convertToVO)
            .collect(Collectors.toList());
        
        // Build tree structure
        return buildTree(voList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Long id) {
        ProductCategory category = productCategoryMapper.selectById(id);
        if (category == null) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        
        // Check if there are child categories
        LambdaQueryWrapper<ProductCategory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductCategory::getParentId, id);
        Long count = productCategoryMapper.selectCount(wrapper);
        
        if (count > 0) {
            throw new RuntimeException("Cannot delete category with child categories");
        }
        
        productCategoryMapper.deleteById(id);
    }

    private ProductCategoryVO convertToVO(ProductCategory category) {
        ProductCategoryVO vo = new ProductCategoryVO();
        BeanUtils.copyProperties(category, vo);
        vo.setChildren(new ArrayList<>());
        return vo;
    }

    private List<ProductCategoryVO> buildTree(List<ProductCategoryVO> allCategories) {
        // Group by parent ID
        Map<Long, List<ProductCategoryVO>> groupedByParent = allCategories.stream()
            .filter(cat -> cat.getParentId() != null)
            .collect(Collectors.groupingBy(ProductCategoryVO::getParentId));
        
        // Assign children to parents
        for (ProductCategoryVO category : allCategories) {
            List<ProductCategoryVO> children = groupedByParent.get(category.getId());
            if (children != null) {
                category.setChildren(children);
            }
        }
        
        // Return only root categories (parentId is null)
        return allCategories.stream()
            .filter(cat -> cat.getParentId() == null)
            .collect(Collectors.toList());
    }
}
