package com.botmedia.analytics;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * Analytics Service Application
 * Handles analytics tracking, statistics, and reporting
 */
@SpringBootApplication
@EnableEurekaClient
@MapperScan("com.botmedia.analytics.repository")
@ComponentScan(basePackages = {"com.botmedia.analytics", "com.botmedia.common"})
public class AnalyticsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsServiceApplication.class, args);
    }
}
