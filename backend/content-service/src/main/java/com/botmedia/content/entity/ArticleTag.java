package com.botmedia.content.entity;

import com.baomidou.mybatisplus.annotation.TableName;

@TableName("article_tags")
public class ArticleTag {

    private Long articleId;
    private Long tagId;

    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }

    public Long getTagId() {
        return tagId;
    }

    public void setTagId(Long tagId) {
        this.tagId = tagId;
    }
}
