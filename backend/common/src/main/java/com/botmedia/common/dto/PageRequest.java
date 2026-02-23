package com.botmedia.common.dto;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

public class PageRequest {

    @Min(value = 1, message = "Page number must be >= 1")
    private long current = 1;

    @Min(value = 1, message = "Page size must be >= 1")
    @Max(value = 100, message = "Page size must be <= 100")
    private long size = 10;

    public long getCurrent() { return current; }
    public void setCurrent(long current) { this.current = current; }
    public long getSize() { return size; }
    public void setSize(long size) { this.size = size; }
}
