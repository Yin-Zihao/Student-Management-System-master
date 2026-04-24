package com.student.management.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.student.management.entity.User;
import com.student.management.exception.BusinessException;
import com.student.management.mapper.UserMapper;
import com.student.management.service.UserService;
import com.student.management.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Map<String, Object> login(String username, String password) {
        // 首先检查是否是默认用户
        if (username.equals("admin") && password.equals("admin123")) {
            User user = new User();
            user.setId(1L);
            user.setUsername("admin");
            user.setRole("admin");
            user.setRealName("系统管理员");
            user.setStatus(1);
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);
            return result;
        }
        if (username.equals("teacher01") && password.equals("123456")) {
            User user = new User();
            user.setId(2L);
            user.setUsername("teacher01");
            user.setRole("teacher");
            user.setRealName("张老师");
            user.setStatus(1);
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);
            return result;
        }
        if (username.equals("student01") && password.equals("123456")) {
            User user = new User();
            user.setId(3L);
            user.setUsername("student01");
            user.setRole("student");
            user.setRealName("张三");
            user.setStatus(1);
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);
            return result;
        }
        if (username.equals("secretary01") && password.equals("123456")) {
            User user = new User();
            user.setId(4L);
            user.setUsername("secretary01");
            user.setRole("secretary");
            user.setRealName("人事秘书");
            user.setStatus(1);
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", user);
            return result;
        }
        
        // 尝试从数据库查询
        try {
            LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(User::getUsername, username);
            User user = this.getOne(wrapper);
            if (user == null) {
                throw new BusinessException(400, "用户不存在");
            }
            if (user.getStatus() == 0) {
                throw new BusinessException(400, "用户已被禁用");
            }
            if (!checkPassword(password, user.getPassword())) {
                throw new BusinessException(400, "密码错误");
            }
            String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());
            Map<String, Object> result = new HashMap<>();
            result.put("token", token);
            result.put("userInfo", getUserInfo(user.getId()));
            return result;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            // 数据库连接失败，返回用户不存在的错误
            throw new BusinessException(400, "用户不存在");
        }
    }

    private boolean checkPassword(String rawPassword, String encodedPassword) {
        // 简化实现，直接比较密码
        return rawPassword.equals(encodedPassword);
    }

    @Override
    public User getUserInfo(Long userId) {
        User user = this.getById(userId);
        if (user != null) {
            user.setPassword(null);
        }
        return user;
    }
}
