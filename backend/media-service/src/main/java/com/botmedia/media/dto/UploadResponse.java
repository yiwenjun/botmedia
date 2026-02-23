package com.botmedia.media.dto;

/**
 * Upload Response DTO
 * Response data after successful file upload
 */
public class UploadResponse {

    private Long id;
    private String fileName;
    private String cdnUrl;

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

    public String getCdnUrl() {
        return cdnUrl;
    }

    public void setCdnUrl(String cdnUrl) {
        this.cdnUrl = cdnUrl;
    }
}
