package com.botmedia.content.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.botmedia.common.exception.BusinessException;
import com.botmedia.content.dto.CategoryRequest;
import com.botmedia.content.dto.CategoryVO;
import com.botmedia.content.entity.Category;
import com.botmedia.content.repository.CategoryMapper;
import com.botmedia.content.service.CategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    @Transactional
    public CategoryVO createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setParentId(request.getParentId());
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        category.setDescription(request.getDescription());

        categoryMapper.insert(category);

        CategoryVO vo = new CategoryVO();
        BeanUtils.copyProperties(category, vo);
        return vo;
    }

    @Override
    @Transactional
    public CategoryVO updateCategory(Long id, CategoryRequest request) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException("Category not found");
        }

        if (request.getName() != null) {
            category.setName(request.getName());
        }
        if (request.getSlug() != null) {
            category.setSlug(request.getSlug());
        }
        if (request.getParentId() != null) {
            category.setParentId(request.getParentId());
        }
        if (request.getSortOrder() != null) {
            category.setSortOrder(request.getSortOrder());
        }
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }

        categoryMapper.updateById(category);

        CategoryVO vo = new CategoryVO();
        BeanUtils.copyProperties(category, vo);
        return vo;
    }

    @Override
    public List<CategoryVO> listCategories() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSortOrder);
        
        List<Category> allCategories = categoryMapper.selectList(wrapper);
        
        // Convert to VO
        List<CategoryVO> allCategoryVOs = allCategories.stream()
                .map(cat -> {
                    CategoryVO vo = new CategoryVO();
                    BeanUtils.copyProperties(cat, vo);
                    return vo;
                })
                .collect(Collectors.toList());

        // Build tree structure
        return buildTree(allCategoryVOs, null);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException("Category not found");
        }

        // Check if there are child categories
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getParentId, id);
        Long childCount = categoryMapper.selectCount(wrapper);
        
        if (childCount > 0) {
            throw new BusinessException("Cannot delete category with children");
        }

        categoryMapper.deleteById(id);
    }

    private List<CategoryVO> buildTree(List<CategoryVO> categories, Long parentId) {
        List<CategoryVO> result = new ArrayList<>();
        
        for (CategoryVO category : categories) {
            if ((parentId == null && category.getParentId() == null) 
                    || (parentId != null && parentId.equals(category.getParentId()))) {
                
                List<CategoryVO> children = buildTree(categories, category.getId());
                category.setChildren(children);
                result.add(category);
            }
        }
        
        return result;
    }
}
