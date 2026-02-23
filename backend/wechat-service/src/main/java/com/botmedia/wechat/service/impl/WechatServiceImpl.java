package com.botmedia.wechat.service.impl;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import com.botmedia.wechat.handler.WechatMpMessageHandler;
import com.botmedia.wechat.service.WechatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.bean.WxOAuth2UserInfo;
import me.chanjar.weixin.common.bean.oauth2.WxOAuth2AccessToken;
import me.chanjar.weixin.common.bean.menu.WxMenu;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.WxMpMessageRouter;
import me.chanjar.weixin.mp.api.WxMpService;
import me.chanjar.weixin.mp.bean.message.WxMpXmlMessage;
import me.chanjar.weixin.mp.bean.message.WxMpXmlOutMessage;
import me.chanjar.weixin.mp.bean.template.WxMpTemplateData;
import me.chanjar.weixin.mp.bean.template.WxMpTemplateMessage;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * WeChat Service Implementation
 */
@Service
public class WechatServiceImpl implements WechatService {

    private static final Logger log = LoggerFactory.getLogger(WechatServiceImpl.class);

    private final WxMpService wxMpService;
    private final WxMaService wxMaService;
    private final WechatMpMessageHandler messageHandler;
    
    private WxMpMessageRouter messageRouter;

    public WechatServiceImpl(WxMpService wxMpService, WxMaService wxMaService, WechatMpMessageHandler messageHandler) {
        this.wxMpService = wxMpService;
        this.wxMaService = wxMaService;
        this.messageHandler = messageHandler;
    }

    @PostConstruct
    public void init() {
        // Initialize message router
        messageRouter = new WxMpMessageRouter(wxMpService);
        
        // Route all messages to our handler
        messageRouter.rule()
                .async(false)
                .handler(messageHandler)
                .end();
    }

    @Override
    public String handleMpMessage(String signature, String timestamp, String nonce, String body) {
        try {
            // Verify signature
            if (!wxMpService.checkSignature(timestamp, nonce, signature)) {
                log.error("Invalid WeChat signature");
                return "Invalid signature";
            }

            // Parse incoming XML message
            WxMpXmlMessage inMessage = WxMpXmlMessage.fromXml(body);
            log.info("Received WeChat message: {}", inMessage);

            // Route message to handler
            WxMpXmlOutMessage outMessage = messageRouter.route(inMessage);

            // Convert response to XML
            if (outMessage != null) {
                return outMessage.toXml();
            }

            return "success";
        } catch (Exception e) {
            log.error("Error handling WeChat message", e);
            return "error";
        }
    }

    @Override
    public String getMpOAuthUrl(String redirectUri, String state) {
        try {
            String url = wxMpService.getOAuth2Service()
                    .buildAuthorizationUrl(redirectUri, WxConsts.OAuth2Scope.SNSAPI_USERINFO, state);
            log.info("Generated OAuth URL: {}", url);
            return url;
        } catch (Exception e) {
            log.error("Error generating OAuth URL", e);
            throw new RuntimeException("Failed to generate OAuth URL", e);
        }
    }

    @Override
    public Map<String, Object> getMpOAuthAccessToken(String code) {
        try {
            WxOAuth2AccessToken accessToken = wxMpService.getOAuth2Service().getAccessToken(code);
            
            Map<String, Object> result = new HashMap<>();
            result.put("openid", accessToken.getOpenId());
            result.put("access_token", accessToken.getAccessToken());
            result.put("refresh_token", accessToken.getRefreshToken());
            result.put("expires_in", accessToken.getExpiresIn());
            result.put("scope", accessToken.getScope());
            
            log.info("Got OAuth access token for openid: {}", accessToken.getOpenId());
            return result;
        } catch (WxErrorException e) {
            log.error("Error getting OAuth access token", e);
            throw new RuntimeException("Failed to get access token: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> getMpUserInfo(String openid, String accessToken) {
        try {
            WxOAuth2AccessToken token = new WxOAuth2AccessToken();
            token.setOpenId(openid);
            token.setAccessToken(accessToken);
            
            WxOAuth2UserInfo userInfo = wxMpService.getOAuth2Service()
                    .getUserInfo(token, null);
            
            Map<String, Object> result = new HashMap<>();
            result.put("openid", userInfo.getOpenid());
            result.put("nickname", userInfo.getNickname());
            result.put("sex", userInfo.getSex());
            result.put("province", userInfo.getProvince());
            result.put("city", userInfo.getCity());
            result.put("country", userInfo.getCountry());
            result.put("headimgurl", userInfo.getHeadImgUrl());
            result.put("unionid", userInfo.getUnionId());
            
            log.info("Got user info for openid: {}", openid);
            return result;
        } catch (WxErrorException e) {
            log.error("Error getting user info", e);
            throw new RuntimeException("Failed to get user info: " + e.getMessage(), e);
        }
    }

    @Override
    public void setMpMenu(String menuJson) {
        try {
            WxMenu menu = WxMenu.fromJson(menuJson);
            wxMpService.getMenuService().menuCreate(menu);
            log.info("Successfully created custom menu");
        } catch (WxErrorException e) {
            log.error("Error creating custom menu", e);
            throw new RuntimeException("Failed to create menu: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendTemplateMessage(String openid, String templateId, String url, Map<String, String> data) {
        try {
            // Build template message
            WxMpTemplateMessage templateMessage = WxMpTemplateMessage.builder()
                    .toUser(openid)
                    .templateId(templateId)
                    .url(url)
                    .build();

            // Add template data
            if (data != null && !data.isEmpty()) {
                List<WxMpTemplateData> templateDataList = data.entrySet().stream()
                        .map(entry -> new WxMpTemplateData(entry.getKey(), entry.getValue()))
                        .collect(Collectors.toList());
                templateMessage.setData(templateDataList);
            }

            // Send message
            String msgId = wxMpService.getTemplateMsgService().sendTemplateMsg(templateMessage);
            log.info("Successfully sent template message, msgId: {}", msgId);
        } catch (WxErrorException e) {
            log.error("Error sending template message", e);
            throw new RuntimeException("Failed to send template message: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> miniappLogin(String code) {
        try {
            WxMaJscode2SessionResult session = wxMaService.getUserService().getSessionInfo(code);
            
            Map<String, Object> result = new HashMap<>();
            result.put("openid", session.getOpenid());
            result.put("session_key", session.getSessionKey());
            result.put("unionid", session.getUnionid());
            
            log.info("Mini program login successful for openid: {}", session.getOpenid());
            return result;
        } catch (WxErrorException e) {
            log.error("Error in mini program login", e);
            throw new RuntimeException("Mini program login failed: " + e.getMessage(), e);
        }
    }
}
