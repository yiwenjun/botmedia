package com.botmedia.notification.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RabbitMQ Configuration
 * Defines exchanges, queues, and bindings for event-driven messaging
 */
@Configuration
public class RabbitMqConfig {

    // Exchange names
    public static final String ARTICLE_EXCHANGE = "article.exchange";
    public static final String USER_EXCHANGE = "user.exchange";
    public static final String PAYMENT_EXCHANGE = "payment.exchange";

    // Queue names
    public static final String ARTICLE_PUBLISHED_QUEUE = "article.published.queue";
    public static final String USER_REGISTERED_QUEUE = "user.registered.queue";
    public static final String PAYMENT_COMPLETED_QUEUE = "payment.completed.queue";

    // Routing keys
    public static final String ARTICLE_PUBLISHED_KEY = "article.published";
    public static final String USER_REGISTERED_KEY = "user.registered";
    public static final String PAYMENT_COMPLETED_KEY = "payment.completed";

    // Article Exchange and Queue
    @Bean
    public TopicExchange articleExchange() {
        return new TopicExchange(ARTICLE_EXCHANGE);
    }

    @Bean
    public Queue articlePublishedQueue() {
        return new Queue(ARTICLE_PUBLISHED_QUEUE, true);
    }

    @Bean
    public Binding articlePublishedBinding() {
        return BindingBuilder
                .bind(articlePublishedQueue())
                .to(articleExchange())
                .with(ARTICLE_PUBLISHED_KEY);
    }

    // User Exchange and Queue
    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(USER_EXCHANGE);
    }

    @Bean
    public Queue userRegisteredQueue() {
        return new Queue(USER_REGISTERED_QUEUE, true);
    }

    @Bean
    public Binding userRegisteredBinding() {
        return BindingBuilder
                .bind(userRegisteredQueue())
                .to(userExchange())
                .with(USER_REGISTERED_KEY);
    }

    // Payment Exchange and Queue
    @Bean
    public TopicExchange paymentExchange() {
        return new TopicExchange(PAYMENT_EXCHANGE);
    }

    @Bean
    public Queue paymentCompletedQueue() {
        return new Queue(PAYMENT_COMPLETED_QUEUE, true);
    }

    @Bean
    public Binding paymentCompletedBinding() {
        return BindingBuilder
                .bind(paymentCompletedQueue())
                .to(paymentExchange())
                .with(PAYMENT_COMPLETED_KEY);
    }
}
