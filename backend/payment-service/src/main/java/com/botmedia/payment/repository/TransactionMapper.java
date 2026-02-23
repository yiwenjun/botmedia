package com.botmedia.payment.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.payment.entity.Transaction;
import org.apache.ibatis.annotations.Mapper;

/**
 * Transaction Mapper
 * Data access layer for Transaction entity
 */
@Mapper
public interface TransactionMapper extends BaseMapper<Transaction> {
}
