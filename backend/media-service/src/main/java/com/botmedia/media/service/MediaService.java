package com.botmedia.media.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.media.dto.MediaFileVO;
import com.botmedia.media.dto.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

/**
 * Media Service Interface
 * Handles media file operations
 */
public interface MediaService {

    /**
     * Upload a file to OSS and save metadata
     * @param file the file to upload
     * @param uploaderId the user ID who uploads the file
     * @return upload response with file info
     */
    UploadResponse upload(MultipartFile file, Long uploaderId);

    /**
     * Get file information by ID
     * @param id file ID
     * @return file details
     */
    MediaFileVO getFile(Long id);

    /**
     * Delete a file
     * @param id file ID
     */
    void deleteFile(Long id);

    /**
     * List files uploaded by a user with pagination
     * @param uploaderId user ID
     * @param current current page number
     * @param size page size
     * @return paginated file list
     */
    IPage<MediaFileVO> listFiles(Long uploaderId, long current, long size);
}
