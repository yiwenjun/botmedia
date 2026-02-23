package com.botmedia.notification.listener;

import com.botmedia.notification.config.RabbitMqConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Event Listener
 * Listens to RabbitMQ events and processes them
 */
@Component
public class EventListener {

    private static final Logger log = LoggerFactory.getLogger(EventListener.class);

    /**
     * Listen to article published events
     * @param message the event message
     */
    @RabbitListener(queues = RabbitMqConfig.ARTICLE_PUBLISHED_QUEUE)
    public void onArticlePublished(String message) {
        log.info("Received article.published event: {}", message);
        // TODO: Process article published event
        // - Send notification to subscribers
        // - Update statistics
        // - Trigger other business logic
    }

    /**
     * Listen to user registered events
     * @param message the event message
     */
    @RabbitListener(queues = RabbitMqConfig.USER_REGISTERED_QUEUE)
    public void onUserRegistered(String message) {
        log.info("Received user.registered event: {}", message);
        // TODO: Process user registered event
        // - Send welcome email
        // - Create user profile
        // - Grant default permissions
    }

    /**
     * Listen to payment completed events
     * @param message the event message
     */
    @RabbitListener(queues = RabbitMqConfig.PAYMENT_COMPLETED_QUEUE)
    public void onPaymentCompleted(String message) {
        log.info("Received payment.completed event: {}", message);
        // TODO: Process payment completed event
        // - Send payment confirmation email
        // - Update order status
        // - Trigger fulfillment process
    }
}
