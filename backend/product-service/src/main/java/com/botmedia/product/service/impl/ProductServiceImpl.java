package com.botmedia.product.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.botmedia.product.dto.ProductCreateRequest;
import com.botmedia.product.dto.ProductUpdateRequest;
import com.botmedia.product.dto.ProductVO;
import com.botmedia.product.entity.Product;
import com.botmedia.product.entity.ProductCategory;
import com.botmedia.product.repository.ProductCategoryMapper;
import com.botmedia.product.repository.ProductMapper;
import com.botmedia.product.service.ProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductCategoryMapper productCategoryMapper;
    private final ObjectMapper objectMapper;

    public ProductServiceImpl(ProductMapper productMapper, ProductCategoryMapper productCategoryMapper, ObjectMapper objectMapper) {
        this.productMapper = productMapper;
        this.productCategoryMapper = productCategoryMapper;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductVO createProduct(ProductCreateRequest request) {
        Product product = new Product();
        BeanUtils.copyProperties(request, product);
        
        // Convert images list to JSON string
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            try {
                product.setImages(objectMapper.writeValueAsString(request.getImages()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize images", e);
            }
        }
        
        // Set defaults
        if (product.getStatus() == null) {
            product.setStatus(1); // Active by default
        }
        if (product.getViewCount() == null) {
            product.setViewCount(0L);
        }
        if (product.getSortOrder() == null) {
            product.setSortOrder(0);
        }
        
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        
        productMapper.insert(product);
        
        return convertToVO(product);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductVO updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        
        // Update fields
        if (StringUtils.hasText(request.getName())) {
            product.setName(request.getName());
        }
        if (StringUtils.hasText(request.getModel())) {
            product.setModel(request.getModel());
        }
        if (StringUtils.hasText(request.getBrand())) {
            product.setBrand(request.getBrand());
        }
        if (StringUtils.hasText(request.getDescription())) {
            product.setDescription(request.getDescription());
        }
        if (StringUtils.hasText(request.getSpecifications())) {
            product.setSpecifications(request.getSpecifications());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getImages() != null) {
            try {
                product.setImages(objectMapper.writeValueAsString(request.getImages()));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize images", e);
            }
        }
        if (request.getCategoryId() != null) {
            product.setCategoryId(request.getCategoryId());
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        if (request.getSortOrder() != null) {
            product.setSortOrder(request.getSortOrder());
        }
        
        product.setUpdatedAt(LocalDateTime.now());
        productMapper.updateById(product);
        
        return convertToVO(product);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductVO getProduct(Long id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        
        // Increment view count
        product.setViewCount(product.getViewCount() + 1);
        productMapper.updateById(product);
        
        return convertToVO(product);
    }

    @Override
    public IPage<ProductVO> listProducts(long current, long size, Long categoryId, Integer status) {
        Page<Product> page = new Page<>(current, size);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        if (status != null) {
            wrapper.eq(Product::getStatus, status);
        }
        
        wrapper.orderByDesc(Product::getSortOrder)
               .orderByDesc(Product::getCreatedAt);
        
        IPage<Product> productPage = productMapper.selectPage(page, wrapper);
        
        // Convert to VO
        Page<ProductVO> voPage = new Page<>(productPage.getCurrent(), productPage.getSize(), productPage.getTotal());
        List<ProductVO> voList = new ArrayList<>();
        for (Product product : productPage.getRecords()) {
            voList.add(convertToVO(product));
        }
        voPage.setRecords(voList);
        
        return voPage;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productMapper.deleteById(id);
    }

    private ProductVO convertToVO(Product product) {
        ProductVO vo = new ProductVO();
        BeanUtils.copyProperties(product, vo);
        
        // Parse images JSON string to list
        if (StringUtils.hasText(product.getImages())) {
            try {
                List<String> imageList = objectMapper.readValue(
                    product.getImages(), 
                    new TypeReference<List<String>>() {}
                );
                vo.setImages(imageList);
            } catch (JsonProcessingException e) {
                vo.setImages(new ArrayList<>());
            }
        } else {
            vo.setImages(new ArrayList<>());
        }
        
        // Get category name
        if (product.getCategoryId() != null) {
            ProductCategory category = productCategoryMapper.selectById(product.getCategoryId());
            if (category != null) {
                vo.setCategoryName(category.getName());
            }
        }
        
        return vo;
    }
}
