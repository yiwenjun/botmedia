package com.botmedia.user.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.user.dto.*;

public interface UserService {

    LoginResponse login(LoginRequest request);

    UserVO register(RegisterRequest request);

    UserVO getProfile(Long userId);

    UserVO updateProfile(Long userId, UpdateProfileRequest request);

    IPage<UserVO> listUsers(long current, long size);

    UserVO getUserById(Long userId);

    void bindWechat(Long userId, String openid, String unionid);
}
