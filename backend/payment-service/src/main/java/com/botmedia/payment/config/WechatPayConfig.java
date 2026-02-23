package com.botmedia.payment.config;

import com.github.binarywang.wxpay.config.WxPayConfig;
import com.github.binarywang.wxpay.service.WxPayService;
import com.github.binarywang.wxpay.service.impl.WxPayServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * WeChat Pay Configuration
 * Configures WeChat Pay SDK
 */
@Configuration
public class WechatPayConfig {

    @Value("${wechat.pay.mch-id}")
    private String mchId;

    @Value("${wechat.pay.api-key}")
    private String apiKey;

    @Value("${wechat.pay.cert-path}")
    private String certPath;

    @Value("${wechat.pay.notify-url}")
    private String notifyUrl;

    /**
     * Create WxPayService bean
     *
     * @return configured WxPayService instance
     */
    @Bean
    public WxPayService wxPayService() {
        WxPayConfig payConfig = new WxPayConfig();
        payConfig.setMchId(mchId);
        payConfig.setMchKey(apiKey);
        payConfig.setKeyPath(certPath);
        payConfig.setNotifyUrl(notifyUrl);

        WxPayService wxPayService = new WxPayServiceImpl();
        wxPayService.setConfig(payConfig);

        return wxPayService;
    }
}
