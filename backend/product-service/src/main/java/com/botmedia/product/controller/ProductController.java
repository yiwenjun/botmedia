package com.botmedia.product.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.common.response.ApiResponse;
import com.botmedia.common.response.PageResponse;
import com.botmedia.product.dto.ProductCreateRequest;
import com.botmedia.product.dto.ProductUpdateRequest;
import com.botmedia.product.dto.ProductVO;
import com.botmedia.product.service.ProductService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/products")
@Validated
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Create a new product
     */
    @PostMapping
    public ApiResponse<ProductVO> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductVO product = productService.createProduct(request);
        return ApiResponse.success("Product created successfully", product);
    }

    /**
     * Update an existing product
     */
    @PutMapping("/{id}")
    public ApiResponse<ProductVO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductVO product = productService.updateProduct(id, request);
        return ApiResponse.success("Product updated successfully", product);
    }

    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ApiResponse<ProductVO> getProduct(@PathVariable Long id) {
        ProductVO product = productService.getProduct(id);
        return ApiResponse.success(product);
    }

    /**
     * List products with pagination and filters
     */
    @GetMapping
    public ApiResponse<PageResponse<ProductVO>> listProducts(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer status) {
        IPage<ProductVO> page = productService.listProducts(current, size, categoryId, status);
        PageResponse<ProductVO> response = PageResponse.of(page);
        return ApiResponse.success(response);
    }

    /**
     * Delete a product
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success("Product deleted successfully", null);
    }
}
