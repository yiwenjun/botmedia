package com.botmedia.media;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * Media Service Application
 * Handles media file upload, storage, and management
 */
@SpringBootApplication
@EnableEurekaClient
@MapperScan("com.botmedia.media.repository")
@ComponentScan(basePackages = {"com.botmedia.media", "com.botmedia.common"})
public class MediaServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediaServiceApplication.class, args);
    }
}
