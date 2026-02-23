package com.botmedia.wechat.controller;

import com.botmedia.common.response.ApiResponse;
import com.botmedia.wechat.service.WechatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import java.util.Map;

/**
 * WeChat Controller
 * Handles WeChat Official Account and Mini Program API endpoints
 */
@RestController
@RequestMapping("/api/v1/wechat")
public class WechatController {

    private static final Logger log = LoggerFactory.getLogger(WechatController.class);

    private final WechatService wechatService;

    public WechatController(WechatService wechatService) {
        this.wechatService = wechatService;
    }

    /**
     * WeChat server verification endpoint (GET)
     * Used by WeChat to verify server URL configuration
     *
     * @param signature WeChat signature
     * @param timestamp Timestamp
     * @param nonce     Random nonce
     * @param echostr   Echo string to return
     * @return Echo string for verification
     */
    @GetMapping("/message")
    public String verifyServer(@RequestParam(required = false) String signature,
                               @RequestParam(required = false) String timestamp,
                               @RequestParam(required = false) String nonce,
                               @RequestParam(required = false) String echostr) {
        log.info("WeChat server verification - signature: {}, timestamp: {}, nonce: {}, echostr: {}", 
                 signature, timestamp, nonce, echostr);
        
        // For server verification, WeChat expects us to return the echostr
        if (echostr != null) {
            return echostr;
        }
        
        return "error";
    }

    /**
     * Receive and handle WeChat messages (POST)
     *
     * @param signature WeChat signature
     * @param timestamp Timestamp
     * @param nonce     Random nonce
     * @param body      XML message body
     * @return Response XML message
     */
    @PostMapping(value = "/message", produces = "application/xml; charset=UTF-8")
    public String handleMessage(@RequestParam(required = false) String signature,
                                @RequestParam(required = false) String timestamp,
                                @RequestParam(required = false) String nonce,
                                @RequestBody String body) {
        log.info("Received WeChat message");
        return wechatService.handleMpMessage(signature, timestamp, nonce, body);
    }

    /**
     * Get OAuth authorization URL
     * Redirect user to this URL for WeChat authorization
     *
     * @param redirectUri Redirect URI after authorization
     * @param state       Custom state parameter (optional)
     * @return OAuth authorization URL
     */
    @GetMapping("/oauth/authorize")
    public ApiResponse<String> getOAuthUrl(@RequestParam @NotBlank String redirectUri,
                                            @RequestParam(required = false) String state) {
        log.info("Generating OAuth URL for redirect: {}, state: {}", redirectUri, state);
        String url = wechatService.getMpOAuthUrl(redirectUri, state);
        return ApiResponse.success(url);
    }

    /**
     * OAuth callback handler
     * Exchange authorization code for access token and user info
     *
     * @param code Authorization code from WeChat
     * @return User information
     */
    @GetMapping("/oauth/callback")
    public ApiResponse<Map<String, Object>> handleOAuthCallback(@RequestParam @NotBlank String code) {
        log.info("Handling OAuth callback with code: {}", code);
        
        // Get access token
        Map<String, Object> tokenInfo = wechatService.getMpOAuthAccessToken(code);
        String openid = (String) tokenInfo.get("openid");
        String accessToken = (String) tokenInfo.get("access_token");
        
        // Get user info
        Map<String, Object> userInfo = wechatService.getMpUserInfo(openid, accessToken);
        
        return ApiResponse.success("OAuth authorization successful", userInfo);
    }

    /**
     * Set custom menu (Admin only)
     *
     * @param menuJson Menu JSON configuration
     * @return Success response
     */
    @PostMapping("/menu")
    public ApiResponse<String> setMenu(@RequestBody @NotBlank String menuJson) {
        log.info("Setting custom menu");
        wechatService.setMpMenu(menuJson);
        return ApiResponse.success("Menu created successfully", "success");
    }

    /**
     * Send template message to user
     *
     * @param request Template message request containing openid, templateId, url, and data
     * @return Success response
     */
    @PostMapping("/template/send")
    public ApiResponse<String> sendTemplateMessage(@RequestBody TemplateMessageRequest request) {
        log.info("Sending template message to: {}", request.getOpenid());
        
        wechatService.sendTemplateMessage(
                request.getOpenid(),
                request.getTemplateId(),
                request.getUrl(),
                request.getData()
        );
        
        return ApiResponse.success("Template message sent successfully", "success");
    }

    /**
     * Mini program login
     *
     * @param request Login request containing code from mini program
     * @return Session information (session_key, openid, unionid)
     */
    @PostMapping("/miniapp/login")
    public ApiResponse<Map<String, Object>> miniappLogin(@RequestBody MiniappLoginRequest request) {
        log.info("Mini program login with code: {}", request.getCode());
        
        Map<String, Object> sessionInfo = wechatService.miniappLogin(request.getCode());
        
        return ApiResponse.success("Login successful", sessionInfo);
    }

    /**
     * Template Message Request DTO
     */
    public static class TemplateMessageRequest {
        @NotBlank
        private String openid;
        
        @NotBlank
        private String templateId;
        
        private String url;
        
        private Map<String, String> data;

        public String getOpenid() {
            return openid;
        }

        public void setOpenid(String openid) {
            this.openid = openid;
        }

        public String getTemplateId() {
            return templateId;
        }

        public void setTemplateId(String templateId) {
            this.templateId = templateId;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public Map<String, String> getData() {
            return data;
        }

        public void setData(Map<String, String> data) {
            this.data = data;
        }
    }

    /**
     * Mini App Login Request DTO
     */
    public static class MiniappLoginRequest {
        @NotBlank
        private String code;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }
}
