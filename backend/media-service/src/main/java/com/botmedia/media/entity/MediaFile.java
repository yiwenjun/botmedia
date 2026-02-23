package com.botmedia.media.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * Media File Entity
 * Represents uploaded media files in the system
 */
@TableName("media_file")
public class MediaFile {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * File name stored in OSS
     */
    private String fileName;

    /**
     * Original file name from upload
     */
    private String originalName;

    /**
     * File path in OSS
     */
    private String filePath;

    /**
     * File size in bytes
     */
    private Long fileSize;

    /**
     * MIME type of the file
     */
    private String mimeType;

    /**
     * CDN URL for accessing the file
     */
    private String cdnUrl;

    /**
     * User ID who uploaded the file
     */
    private Long uploaderId;

    /**
     * Timestamp when file was created
     */
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getCdnUrl() {
        return cdnUrl;
    }

    public void setCdnUrl(String cdnUrl) {
        this.cdnUrl = cdnUrl;
    }

    public Long getUploaderId() {
        return uploaderId;
    }

    public void setUploaderId(Long uploaderId) {
        this.uploaderId = uploaderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
