package com.botmedia.analytics.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.analytics.entity.DailyStatistics;
import org.apache.ibatis.annotations.Mapper;

/**
 * Daily Statistics Mapper
 * Repository interface for DailyStatistics entity
 */
@Mapper
public interface DailyStatisticsMapper extends BaseMapper<DailyStatistics> {
}
