package com.botmedia.wechat.service;

import java.util.Map;

/**
 * WeChat Service Interface
 * Handles WeChat Official Account and Mini Program operations
 */
public interface WechatService {

    /**
     * Handle WeChat Official Account message
     *
     * @param signature WeChat signature
     * @param timestamp Timestamp
     * @param nonce     Random nonce
     * @param body      XML message body
     * @return Response XML message
     */
    String handleMpMessage(String signature, String timestamp, String nonce, String body);

    /**
     * Get WeChat Official Account OAuth authorization URL
     *
     * @param redirectUri Redirect URI after authorization
     * @param state       Custom state parameter
     * @return OAuth authorization URL
     */
    String getMpOAuthUrl(String redirectUri, String state);

    /**
     * Get OAuth access token using authorization code
     *
     * @param code Authorization code
     * @return Access token information (openid, access_token, refresh_token, etc.)
     */
    Map<String, Object> getMpOAuthAccessToken(String code);

    /**
     * Get WeChat user information
     *
     * @param openid      User's OpenID
     * @param accessToken OAuth access token
     * @return User information map
     */
    Map<String, Object> getMpUserInfo(String openid, String accessToken);

    /**
     * Set custom menu for Official Account
     *
     * @param menuJson Menu JSON configuration
     */
    void setMpMenu(String menuJson);

    /**
     * Send template message to user
     *
     * @param openid     Target user's OpenID
     * @param templateId Template ID
     * @param url        URL to redirect after clicking
     * @param data       Template data (key-value pairs)
     */
    void sendTemplateMessage(String openid, String templateId, String url, Map<String, String> data);

    /**
     * Mini Program login
     *
     * @param code Login code from mini program
     * @return Session information (session_key, openid, unionid)
     */
    Map<String, Object> miniappLogin(String code);
}
