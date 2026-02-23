package com.botmedia.user.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.botmedia.common.response.ApiResponse;
import com.botmedia.common.response.PageResponse;
import com.botmedia.user.dto.*;
import com.botmedia.user.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(userService.login(request));
    }

    @PostMapping("/register")
    public ApiResponse<UserVO> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success("Registration successful", userService.register(request));
    }

    @GetMapping("/profile")
    public ApiResponse<UserVO> getProfile(@RequestHeader("X-User-Id") Long userId) {
        return ApiResponse.success(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ApiResponse<UserVO> updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success(userService.updateProfile(userId, request));
    }

    @GetMapping
    public ApiResponse<PageResponse<UserVO>> listUsers(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size) {
        IPage<UserVO> page = userService.listUsers(current, size);
        return ApiResponse.success(PageResponse.of(page));
    }

    @GetMapping("/{id}")
    public ApiResponse<UserVO> getUserById(@PathVariable Long id) {
        return ApiResponse.success(userService.getUserById(id));
    }

    @PostMapping("/wechat/bind")
    public ApiResponse<Void> bindWechat(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam String openid,
            @RequestParam(required = false) String unionid) {
        userService.bindWechat(userId, openid, unionid);
        return ApiResponse.success();
    }
}
