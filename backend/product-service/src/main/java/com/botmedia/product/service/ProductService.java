package com.botmedia.product.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.product.dto.ProductCreateRequest;
import com.botmedia.product.dto.ProductUpdateRequest;
import com.botmedia.product.dto.ProductVO;

public interface ProductService {

    /**
     * Create a new product
     */
    ProductVO createProduct(ProductCreateRequest request);

    /**
     * Update an existing product
     */
    ProductVO updateProduct(Long id, ProductUpdateRequest request);

    /**
     * Get product by ID and increment view count
     */
    ProductVO getProduct(Long id);

    /**
     * List products with pagination and filters
     */
    IPage<ProductVO> listProducts(long current, long size, Long categoryId, Integer status);

    /**
     * Delete a product
     */
    void deleteProduct(Long id);
}
