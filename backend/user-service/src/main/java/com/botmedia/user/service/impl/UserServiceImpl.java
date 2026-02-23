package com.botmedia.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.botmedia.common.exception.BusinessException;
import com.botmedia.common.util.JwtUtil;
import com.botmedia.user.dto.*;
import com.botmedia.user.entity.Role;
import com.botmedia.user.entity.User;
import com.botmedia.user.repository.RoleMapper;
import com.botmedia.user.repository.UserMapper;
import com.botmedia.user.repository.UserRoleMapper;
import com.botmedia.user.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final RoleMapper roleMapper;
    private final UserRoleMapper userRoleMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    private JwtUtil jwtUtil;

    public UserServiceImpl(UserMapper userMapper, RoleMapper roleMapper, UserRoleMapper userRoleMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.roleMapper = roleMapper;
        this.userRoleMapper = userRoleMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        this.jwtUtil = new JwtUtil(jwtSecret, jwtExpiration);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userMapper.findByUsername(request.getUsername());
        if (user == null) {
            throw BusinessException.badRequest("Invalid username or password");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw BusinessException.badRequest("Invalid username or password");
        }
        if (user.getStatus() != 1) {
            throw BusinessException.forbidden("Account is disabled");
        }

        List<Role> roles = roleMapper.findByUserId(user.getId());
        String primaryRole = roles.isEmpty() ? "USER" : roles.get(0).getName();

        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("role", primaryRole);
        claims.put("roles", roles.stream().map(Role::getName).collect(Collectors.toList()));

        String token = jwtUtil.generateToken(String.valueOf(user.getId()), claims);

        UserVO userVO = toUserVO(user, roles);
        return new LoginResponse(token, userVO);
    }

    @Override
    @Transactional
    public UserVO register(RegisterRequest request) {
        if (userMapper.findByUsername(request.getUsername()) != null) {
            throw BusinessException.badRequest("Username already exists");
        }
        if (request.getEmail() != null && userMapper.findByEmail(request.getEmail()) != null) {
            throw BusinessException.badRequest("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());
        user.setStatus(1);
        userMapper.insert(user);

        // Assign USER role by default
        Role userRole = roleMapper.selectOne(new LambdaQueryWrapper<Role>().eq(Role::getName, "USER"));
        if (userRole != null) {
            userRoleMapper.insertUserRole(user.getId(), userRole.getId());
        }

        List<Role> roles = roleMapper.findByUserId(user.getId());
        return toUserVO(user, roles);
    }

    @Override
    public UserVO getProfile(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw BusinessException.notFound("User not found");
        }
        List<Role> roles = roleMapper.findByUserId(user.getId());
        return toUserVO(user, roles);
    }

    @Override
    public UserVO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw BusinessException.notFound("User not found");
        }

        if (request.getNickname() != null) {
            user.setNickname(request.getNickname());
        }
        if (request.getEmail() != null) {
            User existingEmail = userMapper.findByEmail(request.getEmail());
            if (existingEmail != null && !existingEmail.getId().equals(userId)) {
                throw BusinessException.badRequest("Email already in use");
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        userMapper.updateById(user);
        List<Role> roles = roleMapper.findByUserId(user.getId());
        return toUserVO(user, roles);
    }

    @Override
    public IPage<UserVO> listUsers(long current, long size) {
        Page<User> page = new Page<>(current, size);
        IPage<User> userPage = userMapper.selectPage(page, new LambdaQueryWrapper<User>().orderByDesc(User::getCreatedAt));

        return userPage.convert(user -> {
            List<Role> roles = roleMapper.findByUserId(user.getId());
            return toUserVO(user, roles);
        });
    }

    @Override
    public UserVO getUserById(Long userId) {
        return getProfile(userId);
    }

    @Override
    @Transactional
    public void bindWechat(Long userId, String openid, String unionid) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw BusinessException.notFound("User not found");
        }
        user.setWechatOpenid(openid);
        user.setWechatUnionid(unionid);
        userMapper.updateById(user);
    }

    private UserVO toUserVO(User user, List<Role> roles) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setEmail(user.getEmail());
        vo.setPhone(user.getPhone());
        vo.setNickname(user.getNickname());
        vo.setAvatarUrl(user.getAvatarUrl());
        vo.setStatus(user.getStatus());
        vo.setRoles(roles.stream().map(Role::getName).collect(Collectors.toList()));
        vo.setCreatedAt(user.getCreatedAt());
        return vo;
    }
}
