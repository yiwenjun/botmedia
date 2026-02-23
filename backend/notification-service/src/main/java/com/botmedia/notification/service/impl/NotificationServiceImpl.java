package com.botmedia.notification.service.impl;

import com.botmedia.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Notification Service Implementation
 * Currently logs notifications, to be implemented with actual email/SMS providers
 */
@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    @Override
    public void sendEmail(String to, String subject, String content) {
        // TODO: Implement actual email sending logic
        // - Integrate with email service provider (e.g., SendGrid, AWS SES)
        // - Add email templating
        // - Handle email queue and retry logic
        
        log.info("Sending email to: {}", to);
        log.info("Subject: {}", subject);
        log.info("Content: {}", content);
        log.info("Email sent successfully (simulated)");
    }

    @Override
    public void sendSms(String phone, String templateCode, Map<String, String> params) {
        // TODO: Implement actual SMS sending logic
        // - Integrate with SMS service provider (e.g., Twilio, Aliyun SMS)
        // - Add template management
        // - Handle SMS queue and retry logic
        
        log.info("Sending SMS to: {}", phone);
        log.info("Template code: {}", templateCode);
        log.info("Parameters: {}", params);
        log.info("SMS sent successfully (simulated)");
    }
}
