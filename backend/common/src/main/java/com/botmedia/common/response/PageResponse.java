package com.botmedia.common.response;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.io.Serializable;
import java.util.List;

public class PageResponse<T> implements Serializable {

    private List<T> records;
    private long total;
    private long size;
    private long current;
    private long pages;

    public List<T> getRecords() { return records; }
    public void setRecords(List<T> records) { this.records = records; }
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
    public long getSize() { return size; }
    public void setSize(long size) { this.size = size; }
    public long getCurrent() { return current; }
    public void setCurrent(long current) { this.current = current; }
    public long getPages() { return pages; }
    public void setPages(long pages) { this.pages = pages; }

    public static <T> PageResponse<T> of(IPage<T> page) {
        PageResponse<T> response = new PageResponse<>();
        response.setRecords(page.getRecords());
        response.setTotal(page.getTotal());
        response.setSize(page.getSize());
        response.setCurrent(page.getCurrent());
        response.setPages(page.getPages());
        return response;
    }

    public static <T> PageResponse<T> of(List<T> records, long total, long size, long current) {
        PageResponse<T> response = new PageResponse<>();
        response.setRecords(records);
        response.setTotal(total);
        response.setSize(size);
        response.setCurrent(current);
        response.setPages((total + size - 1) / size);
        return response;
    }
}
