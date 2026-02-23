package com.botmedia.product.controller;

import com.botmedia.common.response.ApiResponse;
import com.botmedia.product.dto.ProductCategoryRequest;
import com.botmedia.product.dto.ProductCategoryVO;
import com.botmedia.product.service.ProductCategoryService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products/categories")
@Validated
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    public ProductCategoryController(ProductCategoryService productCategoryService) {
        this.productCategoryService = productCategoryService;
    }

    /**
     * Create a new category
     */
    @PostMapping
    public ApiResponse<ProductCategoryVO> createCategory(@Valid @RequestBody ProductCategoryRequest request) {
        ProductCategoryVO category = productCategoryService.createCategory(request);
        return ApiResponse.success("Category created successfully", category);
    }

    /**
     * Update an existing category
     */
    @PutMapping("/{id}")
    public ApiResponse<ProductCategoryVO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody ProductCategoryRequest request) {
        ProductCategoryVO category = productCategoryService.updateCategory(id, request);
        return ApiResponse.success("Category updated successfully", category);
    }

    /**
     * List all categories in tree structure
     */
    @GetMapping
    public ApiResponse<List<ProductCategoryVO>> listCategories() {
        List<ProductCategoryVO> categories = productCategoryService.listCategories();
        return ApiResponse.success(categories);
    }

    /**
     * Delete a category
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        productCategoryService.deleteCategory(id);
        return ApiResponse.success("Category deleted successfully", null);
    }
}
