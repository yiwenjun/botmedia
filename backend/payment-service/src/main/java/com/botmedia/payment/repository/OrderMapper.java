package com.botmedia.payment.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.payment.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * Order Mapper
 * Data access layer for Order entity
 */
@Mapper
public interface OrderMapper extends BaseMapper<Order> {

    /**
     * Find order by order number
     *
     * @param orderNo the order number
     * @return the order or null if not found
     */
    Order findByOrderNo(@Param("orderNo") String orderNo);
}
