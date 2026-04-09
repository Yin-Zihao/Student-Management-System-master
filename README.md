# 学生管理系统

## 项目简介

学管系统是面向高校的综合性数据管理平台，结合教研、科研、人事等核心业务需求，旨在解决学院数据分散、统计困难、信息孤立的问题。系统通过统一的数据汇聚与标准化处理，实现竞赛获奖、科研成果、项目经费、人事档案等信息的集中管理，并提供实时可视化展示与智能分析，支持学院在教学管理、科研发展和人事决策上的数字化转型。

## 技术栈

- **前端**：Vue 3 + Element Plus + Vue Router + Axios + Vite
- **后端**：Spring Boot 2.7 + MyBatis Plus + JWT
- **数据库**：MySQL 8.0
- **开发工具**：VS Code / IntelliJ IDEA

## 项目结构

```
Student-Management-System-master/
├── docs/                      # 文档目录
│   ├── requirements/          # 需求文档
│   └── design/               # 设计文档（概要设计文档V1.2.5）
├── code/
│   ├── frontend/             # 前端代码
│   │   ├── src/
│   │   │   ├── api/          # API接口
│   │   │   ├── components/   # 公共组件
│   │   │   ├── router/       # 路由配置
│   │   │   ├── store/        # 状态管理
│   │   │   ├── utils/        # 工具函数
│   │   │   ├── views/        # 页面组件
│   │   │   ├── App.vue
│   │   │   └── main.js
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   └── backend/              # 后端代码
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/student/management/
│       │   │   │   ├── common/       # 通用类
│       │   │   │   ├── config/       # 配置类
│       │   │   │   ├── controller/   # 控制器
│       │   │   │   ├── entity/       # 实体类
│       │   │   │   ├── exception/    # 异常处理
│       │   │   │   ├── interceptor/  # 拦截器
│       │   │   │   ├── mapper/       # 数据访问层
│       │   │   │   ├── service/      # 服务层
│       │   │   │   ├── util/         # 工具类
│       │   │   │   └── StudentManagementApplication.java
│       │   │   └── resources/
│       │   │       └── application.yml
│       │   └── test/
│       └── pom.xml
├── database/                  # 数据库脚本
│   └── schema.sql
├── .gitignore
├── LICENSE
└── README.md
```

## 功能特性

### 系统管理模块
- 用户登录/注销、密码修改
- 管理员对用户（学生、教师、人事秘书）的增删改查
- 班级管理：维护学院、专业、班级的树形结构
- 课程管理：增删改查课程，关联授课教师

### 成绩管理模块
- 成绩录入：教师可为所授课程录入学生成绩
- 成绩查询：学生查看个人成绩；教师查看所授课程成绩列表；管理员查看所有成绩
- 成绩修改：教师可修改已录入的成绩

### 统计看板模块
- 首页数据展示（用户、课程、班级、成绩统计）
- 快速操作指引

## 快速开始

### 环境要求

- JDK 1.8+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+

### 1. 数据库配置

1. 创建数据库并执行脚本：
```sql
CREATE DATABASE student_management DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_management;
source database/schema.sql;
```

2. 修改后端配置文件 `code/backend/src/main/resources/application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/student_management?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

### 2. 后端启动

```bash
cd code/backend
mvn clean install
mvn spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 3. 前端启动

```bash
cd code/frontend
npm install
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

### 4. 访问系统

打开浏览器访问前端地址，使用以下账号登录：

| 角色     | 用户名      | 密码   |
| -------- | ----------- | ------ |
| 管理员   | admin       | 123456 |
| 教师     | teacher01   | 123456 |
| 学生     | student01   | 123456 |
| 人事秘书 | secretary01 | 123456 |

## 开发计划

- ✅ V1.0（基础版）：用户管理、班级管理、课程管理、成绩管理
- ⏳ V1.1（增强版）：科研管理、人事管理、党务管理、竞赛管理、数据大屏展示、统计分析、预警功能
- ⏳ V2.0（完整版）：智能推荐、跨系统数据接口、可视化配置

## 文档说明

- 需求文档：`docs/requirements/学管系统需求分析文档V0.3(1).docx`
- 概要设计文档：`docs/design/学管系统概要设计文档V1.2.5.md`

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件
