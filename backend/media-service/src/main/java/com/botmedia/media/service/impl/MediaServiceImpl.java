package com.botmedia.media.service.impl;

import com.aliyun.oss.OSS;
import com.aliyun.oss.model.PutObjectRequest;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.botmedia.media.dto.MediaFileVO;
import com.botmedia.media.dto.UploadResponse;
import com.botmedia.media.entity.MediaFile;
import com.botmedia.media.repository.MediaFileMapper;
import com.botmedia.media.service.MediaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Media Service Implementation
 */
@Service
public class MediaServiceImpl implements MediaService {

    private static final Logger log = LoggerFactory.getLogger(MediaServiceImpl.class);

    @Autowired
    private OSS ossClient;

    @Autowired
    private MediaFileMapper mediaFileMapper;

    @Value("${aliyun.oss.bucket-name}")
    private String bucketName;

    @Value("${aliyun.oss.endpoint}")
    private String endpoint;

    @Override
    public UploadResponse upload(MultipartFile file, Long uploaderId) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";

        // Generate unique file name
        String fileName = UUID.randomUUID().toString() + extension;
        String filePath = "uploads/" + LocalDateTime.now().getYear() + "/"
                + LocalDateTime.now().getMonthValue() + "/" + fileName;

        try {
            // Upload to OSS
            PutObjectRequest putObjectRequest = new PutObjectRequest(
                    bucketName, filePath, file.getInputStream());
            ossClient.putObject(putObjectRequest);

            // Generate CDN URL
            String cdnUrl = "https://" + bucketName + "." + endpoint + "/" + filePath;

            // Save metadata to database
            MediaFile mediaFile = new MediaFile();
            mediaFile.setFileName(fileName);
            mediaFile.setOriginalName(originalFilename);
            mediaFile.setFilePath(filePath);
            mediaFile.setFileSize(file.getSize());
            mediaFile.setMimeType(file.getContentType());
            mediaFile.setCdnUrl(cdnUrl);
            mediaFile.setUploaderId(uploaderId);
            mediaFile.setCreatedAt(LocalDateTime.now());

            mediaFileMapper.insert(mediaFile);

            // Build response
            UploadResponse response = new UploadResponse();
            response.setId(mediaFile.getId());
            response.setFileName(fileName);
            response.setCdnUrl(cdnUrl);

            log.info("File uploaded successfully: {}", fileName);
            return response;

        } catch (IOException e) {
            log.error("Failed to upload file: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    @Override
    public MediaFileVO getFile(Long id) {
        MediaFile mediaFile = mediaFileMapper.selectById(id);
        if (mediaFile == null) {
            throw new RuntimeException("File not found");
        }

        MediaFileVO vo = new MediaFileVO();
        BeanUtils.copyProperties(mediaFile, vo);
        return vo;
    }

    @Override
    public void deleteFile(Long id) {
        MediaFile mediaFile = mediaFileMapper.selectById(id);
        if (mediaFile == null) {
            throw new RuntimeException("File not found");
        }

        try {
            // Delete from OSS
            ossClient.deleteObject(bucketName, mediaFile.getFilePath());

            // Delete from database
            mediaFileMapper.deleteById(id);

            log.info("File deleted successfully: {}", mediaFile.getFileName());
        } catch (Exception e) {
            log.error("Failed to delete file: {}", e.getMessage());
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }

    @Override
    public IPage<MediaFileVO> listFiles(Long uploaderId, long current, long size) {
        Page<MediaFile> page = new Page<>(current, size);
        LambdaQueryWrapper<MediaFile> queryWrapper = new LambdaQueryWrapper<>();

        if (uploaderId != null) {
            queryWrapper.eq(MediaFile::getUploaderId, uploaderId);
        }

        queryWrapper.orderByDesc(MediaFile::getCreatedAt);

        IPage<MediaFile> mediaFilePage = mediaFileMapper.selectPage(page, queryWrapper);

        // Convert to VO
        return mediaFilePage.convert(mediaFile -> {
            MediaFileVO vo = new MediaFileVO();
            BeanUtils.copyProperties(mediaFile, vo);
            return vo;
        });
    }
}
