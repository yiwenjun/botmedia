package com.botmedia.notification.service;

import java.util.Map;

/**
 * Notification Service Interface
 * Handles sending notifications via various channels
 */
public interface NotificationService {

    /**
     * Send an email notification
     * @param to recipient email address
     * @param subject email subject
     * @param content email content
     */
    void sendEmail(String to, String subject, String content);

    /**
     * Send an SMS notification
     * @param phone recipient phone number
     * @param templateCode SMS template code
     * @param params template parameters
     */
    void sendSms(String phone, String templateCode, Map<String, String> params);
}
