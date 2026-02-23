package com.botmedia.user.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.botmedia.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT * FROM users WHERE username = #{username}")
    User findByUsername(@Param("username") String username);

    @Select("SELECT * FROM users WHERE email = #{email}")
    User findByEmail(@Param("email") String email);

    @Select("SELECT * FROM users WHERE wechat_openid = #{openid}")
    User findByWechatOpenid(@Param("openid") String openid);
}
