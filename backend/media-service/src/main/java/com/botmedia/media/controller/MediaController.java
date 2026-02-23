package com.botmedia.media.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.common.response.ApiResponse;
import com.botmedia.media.dto.MediaFileVO;
import com.botmedia.media.dto.UploadResponse;
import com.botmedia.media.service.MediaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Media Controller
 * REST API for media file operations
 */
@RestController
@RequestMapping("/api/v1/media")
public class MediaController {

    private static final Logger log = LoggerFactory.getLogger(MediaController.class);

    @Autowired
    private MediaService mediaService;

    /**
     * Upload a file
     * @param file the file to upload
     * @param userId the user ID from header
     * @return upload response
     */
    @PostMapping("/upload")
    public ApiResponse<UploadResponse> upload(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        log.info("Uploading file: {}, user: {}", file.getOriginalFilename(), userId);
        UploadResponse response = mediaService.upload(file, userId);
        return ApiResponse.success(response);
    }

    /**
     * Get file information by ID
     * @param id file ID
     * @return file details
     */
    @GetMapping("/{id}")
    public ApiResponse<MediaFileVO> getFile(@PathVariable Long id) {
        log.info("Getting file: {}", id);
        MediaFileVO file = mediaService.getFile(id);
        return ApiResponse.success(file);
    }

    /**
     * Delete a file
     * @param id file ID
     * @return success message
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteFile(@PathVariable Long id) {
        log.info("Deleting file: {}", id);
        mediaService.deleteFile(id);
        return ApiResponse.success(null);
    }

    /**
     * List files with pagination
     * @param uploaderId optional user ID filter
     * @param current page number (default 1)
     * @param size page size (default 10)
     * @return paginated file list
     */
    @GetMapping
    public ApiResponse<IPage<MediaFileVO>> listFiles(
            @RequestParam(required = false) Long uploaderId,
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size) {
        
        log.info("Listing files: uploaderId={}, page={}, size={}", uploaderId, current, size);
        IPage<MediaFileVO> files = mediaService.listFiles(uploaderId, current, size);
        return ApiResponse.success(files);
    }
}
