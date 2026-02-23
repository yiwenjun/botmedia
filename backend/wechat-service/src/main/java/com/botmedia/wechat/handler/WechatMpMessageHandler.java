package com.botmedia.wechat.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.mp.api.WxMpMessageHandler;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * WeChat Official Account Message Handler
 * Handles text messages, subscribe events, and scan events
 */
@Component
public class WechatMpMessageHandler implements WxMpMessageHandler {

    private static final Logger log = LoggerFactory.getLogger(WechatMpMessageHandler.class);

    @Override
    public WxMpXmlOutMessage handle(WxMpXmlMessage wxMessage, Map<String, Object> context,
                                     WxMpService wxMpService, WxSessionManager sessionManager) {
        
        String msgType = wxMessage.getMsgType();
        String event = wxMessage.getEvent();
        
        log.info("Received WeChat message - Type: {}, Event: {}, FromUser: {}", 
                 msgType, event, wxMessage.getFromUser());

        // Handle subscribe event
        if (WxConsts.XmlMsgType.EVENT.equals(msgType) && WxConsts.EventType.SUBSCRIBE.equals(event)) {
            return handleSubscribe(wxMessage, wxMpService);
        }

        // Handle scan event
        if (WxConsts.XmlMsgType.EVENT.equals(msgType) && WxConsts.EventType.SCAN.equals(event)) {
            return handleScan(wxMessage, wxMpService);
        }

        // Handle text messages
        if (WxConsts.XmlMsgType.TEXT.equals(msgType)) {
            return handleTextMessage(wxMessage, wxMpService);
        }

        // Default response
        return null;
    }

    /**
     * Handle subscribe event
     */
    private WxMpXmlOutMessage handleSubscribe(WxMpXmlMessage wxMessage, WxMpService wxMpService) {
        log.info("New subscriber: {}", wxMessage.getFromUser());
        
        return WxMpXmlOutMessage.TEXT()
                .content("Welcome to BotMedia! 🎉\n\n" +
                        "Thank you for following our official account.\n" +
                        "We provide professional self-media content and knowledge services.\n\n" +
                        "Reply with any message to start your journey!")
                .fromUser(wxMessage.getToUser())
                .toUser(wxMessage.getFromUser())
                .build();
    }

    /**
     * Handle scan event
     */
    private WxMpXmlOutMessage handleScan(WxMpXmlMessage wxMessage, WxMpService wxMpService) {
        String eventKey = wxMessage.getEventKey();
        log.info("User {} scanned QR code with key: {}", wxMessage.getFromUser(), eventKey);
        
        return WxMpXmlOutMessage.TEXT()
                .content("QR code scanned successfully! Event Key: " + eventKey)
                .fromUser(wxMessage.getToUser())
                .toUser(wxMessage.getFromUser())
                .build();
    }

    /**
     * Handle text messages
     */
    private WxMpXmlOutMessage handleTextMessage(WxMpXmlMessage wxMessage, WxMpService wxMpService) {
        String content = wxMessage.getContent();
        log.info("Received text message from {}: {}", wxMessage.getFromUser(), content);
        
        // Default auto-reply
        String replyContent = "Thank you for your message!\n\n" +
                "Your input: " + content + "\n\n" +
                "Our team will respond to you shortly.";
        
        return WxMpXmlOutMessage.TEXT()
                .content(replyContent)
                .fromUser(wxMessage.getToUser())
                .toUser(wxMessage.getFromUser())
                .build();
    }
}
