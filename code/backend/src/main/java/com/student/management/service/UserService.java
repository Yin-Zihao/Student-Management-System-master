package com.student.management.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.student.management.entity.User;

import java.util.Map;

public interface UserService extends IService<User> {
    Map<String, Object> login(String username, String password);
    User getUserInfo(Long userId);
}
