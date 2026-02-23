package com.botmedia.media.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.media.entity.MediaFile;
import org.apache.ibatis.annotations.Mapper;

/**
 * Media File Mapper
 * Repository interface for MediaFile entity
 */
@Mapper
public interface MediaFileMapper extends BaseMapper<MediaFile> {
}
