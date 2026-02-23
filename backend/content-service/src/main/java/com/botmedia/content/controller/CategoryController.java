package com.botmedia.content.controller;

import com.botmedia.common.response.ApiResponse;
import com.botmedia.content.dto.CategoryRequest;
import com.botmedia.content.dto.CategoryVO;
import com.botmedia.content.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<List<CategoryVO>> listCategories() {
        List<CategoryVO> categories = categoryService.listCategories();
        return ApiResponse.success(categories);
    }

    @PostMapping
    public ApiResponse<CategoryVO> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryVO category = categoryService.createCategory(request);
        return ApiResponse.success(category);
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryVO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        
        CategoryVO category = categoryService.updateCategory(id, request);
        return ApiResponse.success(category);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success(null);
    }
}
