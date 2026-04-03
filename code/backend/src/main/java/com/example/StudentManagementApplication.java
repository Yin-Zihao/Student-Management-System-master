package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 学管系统后端启动类
 */
@SpringBootApplication
@EnableScheduling
public class StudentManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
        System.out.println("====================================");
        System.out.println("学管系统后端服务启动成功！");
        System.out.println("访问地址：http://localhost:8080");
        System.out.println("API 文档：http://localhost:8080/swagger-ui.html");
        System.out.println("====================================");
    }
}
