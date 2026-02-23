package com.botmedia.content.service;

import com.botmedia.content.dto.CategoryRequest;
import com.botmedia.content.dto.CategoryVO;

import java.util.List;

public interface CategoryService {

    /**
     * Create a new category
     */
    CategoryVO createCategory(CategoryRequest request);

    /**
     * Update an existing category
     */
    CategoryVO updateCategory(Long id, CategoryRequest request);

    /**
     * List all categories as a tree structure
     */
    List<CategoryVO> listCategories();

    /**
     * Delete a category
     */
    void deleteCategory(Long id);
}
