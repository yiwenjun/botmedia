package com.botmedia.payment;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.context.annotation.ComponentScan;

/**
 * Payment Service Application
 * Handles payment processing and transaction management with WeChat Pay integration
 */
@SpringBootApplication
@EnableEurekaClient
@MapperScan("com.botmedia.payment.repository")
@ComponentScan(basePackages = {"com.botmedia.payment", "com.botmedia.common"})
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
