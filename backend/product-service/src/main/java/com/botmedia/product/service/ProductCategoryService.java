package com.botmedia.product.service;

import com.botmedia.product.dto.ProductCategoryRequest;
import com.botmedia.product.dto.ProductCategoryVO;
import java.util.List;

public interface ProductCategoryService {

    /**
     * Create a new category
     */
    ProductCategoryVO createCategory(ProductCategoryRequest request);

    /**
     * Update an existing category
     */
    ProductCategoryVO updateCategory(Long id, ProductCategoryRequest request);

    /**
     * List all categories in tree structure
     */
    List<ProductCategoryVO> listCategories();

    /**
     * Delete a category
     */
    void deleteCategory(Long id);
}
