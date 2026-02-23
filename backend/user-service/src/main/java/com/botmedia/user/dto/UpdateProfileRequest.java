package com.botmedia.user.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

public class UpdateProfileRequest {

    @Size(max = 50, message = "Nickname must be <= 50 characters")
    private String nickname;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String avatarUrl;

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
