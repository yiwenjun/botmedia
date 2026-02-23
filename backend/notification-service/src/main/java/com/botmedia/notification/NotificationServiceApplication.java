package com.botmedia.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * Notification Service Application
 * Handles notifications and event-driven messaging
 */
@SpringBootApplication
@EnableEurekaClient
@ComponentScan(basePackages = {"com.botmedia.notification", "com.botmedia.common"})
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
