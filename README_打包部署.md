# 学管系统 - JAR 包打包部署完整指南

## ✅ 项目已完成 JAR 包打包配置

你现在可以将后端项目打包成可执行的 JAR 包，并部署到 Linux 服务器的 8091 端口。

---

## 📦 快速开始（3 分钟上手）

### 1️⃣ 本地打包（Windows）

**最简单的方法：**
```cmd
# 打开命令提示符或 PowerShell
cd d:\project\Student-Management-System-master\code\backend

# 运行打包脚本
build.bat
```

或者直接双击 `build.bat` 文件！

打包完成后，在 `target` 目录生成：
- **sms-backend-1.0.0.jar** （约 50-60MB）

### 2️⃣ 上传到服务器

```powershell
# 在 PowerShell 中执行（替换为你的服务器 IP）
scp code\backend\target\sms-backend-1.0.0.jar root@服务器 IP:/opt/sms/
scp code\backend\application-prod.yml root@服务器 IP:/opt/sms/
scp code\backend\sms-backend.service root@服务器 IP:/etc/systemd/system/
```

或使用 **FileZilla** 等 FTP 工具图形化上传。

### 3️⃣ 服务器上启动服务

```bash
# SSH 连接到服务器后执行
ssh root@服务器 IP

# 进入项目目录
cd /opt/sms

# 启动服务（Systemd 方式）
systemctl daemon-reload
systemctl start sms-backend
systemctl enable sms-backend

# 查看状态
systemctl status sms-backend
```

### 4️⃣ 访问系统

打开浏览器访问：
```
http://服务器IP:8091
```

---

## 📋 详细步骤说明

### 一、本地环境要求

- **Java 17+** （[下载链接](https://adoptium.net/)）
- **Maven 3.6+** （[下载链接](https://maven.apache.org/download.cgi)）

检查版本：
```cmd
java -version
mvn -version
```

### 二、打包方法

#### Windows 用户

**方法 A：批处理脚本（推荐）**
```cmd
cd code\backend
build.bat
```

**方法 B：手动 Maven 命令**
```cmd
cd code\backend
mvn clean package -DskipTests
```

#### Linux/Mac 用户

```bash
cd code/backend
chmod +x build.sh
./build.sh
```

### 三、上传文件清单

需要上传到服务器的文件：

| 文件 | 目标路径 | 说明 |
|------|---------|------|
| `sms-backend-1.0.0.jar` | `/opt/sms/` | 主程序 |
| `application-prod.yml` | `/opt/sms/` | 生产环境配置 |
| `sms-backend.service` | `/etc/systemd/system/` | Systemd 服务配置 |

### 四、服务器环境配置

#### 1. 安装 Java 17

**Ubuntu/Debian:**
```bash
apt update
apt install openjdk-17-jdk -y
```

**CentOS/RHEL:**
```bash
yum install java-17-openjdk-devel -y
```

#### 2. 安装 MySQL 8.0

**Ubuntu/Debian:**
```bash
apt install mysql-server -y
systemctl start mysql
systemctl enable mysql
mysql_secure_installation
```

**CentOS/RHEL:**
```bash
yum install mysql-server -y
systemctl start mysqld
systemctl enable mysqld
mysql_secure_installation
```

#### 3. 创建数据库

```bash
mysql -u root -p
```

```sql
CREATE DATABASE student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 可选：创建专用用户
-- CREATE USER 'sms'@'localhost' IDENTIFIED BY 'YourPassword123!';
-- GRANT ALL PRIVILEGES ON student_management.* TO 'sms'@'localhost';
-- FLUSH PRIVILEGES;
EXIT;
```

#### 4. 配置应用

编辑 `/opt/sms/application-prod.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/student_management?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root          # 改为你的数据库用户名
    password: YourPassword  # 改为你的数据库密码
```

### 五、启动方式

#### 推荐：Systemd 服务

```bash
# 设置服务
chmod 644 /etc/systemd/system/sms-backend.service
systemctl daemon-reload

# 启动
systemctl start sms-backend
systemctl enable sms-backend

# 查看状态
systemctl status sms-backend
```

#### 备选：直接启动

```bash
cd /opt/sms
nohup java -jar sms-backend-1.0.0.jar --spring.profiles.active=prod > backend.log 2>&1 &

# 查看日志
tail -f backend.log
```

### 六、配置 Nginx 反向代理（8091 端口）

```bash
# 安装 Nginx
apt install nginx -y  # Ubuntu/Debian
yum install nginx -y  # CentOS/RHEL

# 创建配置文件
vi /etc/nginx/conf.d/sms.conf
```

粘贴以下内容：

```nginx
server {
    listen 8091;
    server_name localhost;

    location / {
        root /opt/sms/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# 启动 Nginx
systemctl start nginx
systemctl enable nginx
```

---

## 🔧 常用运维命令

### 服务管理

```bash
# 启动
systemctl start sms-backend

# 停止
systemctl stop sms-backend

# 重启
systemctl restart sms-backend

# 查看状态
systemctl status sms-backend

# 查看日志
journalctl -u sms-backend -f
```

### 升级应用

```bash
# 1. 停止旧服务
systemctl stop sms-backend

# 2. 备份
cd /opt/sms
cp sms-backend-1.0.0.jar sms-backend-1.0.0.jar.bak

# 3. 上传新 JAR 包（使用 SCP 或 FileZilla）

# 4. 启动新版本
systemctl start sms-backend

# 5. 验证
systemctl status sms-backend
```

### 查看日志

```bash
# Systemd 日志
journalctl -u sms-backend -n 100

# 应用日志
tail -f /opt/sms/logs/sms-backend.log

# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## ⚠️ 常见问题排查

### 问题 1：服务启动失败

```bash
# 查看详细错误
journalctl -u sms-backend -n 50 --no-pager

# 常见原因：
# 1. 端口被占用
netstat -tlnp | grep 8080

# 2. 数据库未启动
systemctl status mysqld

# 3. 配置文件错误
vi /opt/sms/application-prod.yml
```

### 问题 2：无法访问 8091 端口

```bash
# 检查防火墙
firewall-cmd --list-all  # CentOS
ufw status               # Ubuntu

# 开放端口
firewall-cmd --permanent --add-port=8091/tcp && firewall-cmd --reload
ufw allow 8091/tcp && ufw enable

# 检查 Nginx 状态
systemctl status nginx
```

### 问题 3：数据库连接失败

```bash
# 检查 MySQL
systemctl status mysqld

# 测试连接
mysql -u root -p -e "SHOW DATABASES;"

# 检查数据库是否存在
mysql -u root -p -e "USE student_management;"
```

---

## 📊 性能优化建议

### JVM 参数调优

编辑 `/etc/systemd/system/sms-backend.service`：

```ini
[Service]
Environment="JAVA_OPTS=-Xms1g -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

根据服务器内存调整：
- **2GB 内存**: `-Xms512m -Xmx1g`
- **4GB 内存**: `-Xms1g -Xmx2g`
- **8GB 内存**: `-Xms2g -Xmx4g`

### MySQL 优化

编辑 `/etc/my.cnf`：

```ini
[mysqld]
max_connections=200
innodb_buffer_pool_size=1G
query_cache_size=64M
```

---

## 📁 项目文件结构

```
Student-Management-System-master/
├── code/
│   ├── backend/
│   │   ├── pom.xml                          # Maven 配置（新增）
│   │   ├── src/main/java/com/example/
│   │   │   └── StudentManagementApplication.java  # 启动类（新增）
│   │   ├── src/main/resources/
│   │   │   ├── application.yml              # 开发环境配置
│   │   │   ├── application-dev.yml          # 开发环境配置
│   │   │   └── application-prod.yml         # 生产环境配置
│   │   ├── build.bat                        # Windows 打包脚本（新增）
│   │   ├── build.sh                         # Linux 打包脚本（新增）
│   │   ├── sms-backend.service              # Systemd 服务配置（新增）
│   │   └── target/
│   │       └── sms-backend-1.0.0.jar        # 打包生成的 JAR 包
│   └── frontend/
│       └── ...
├── nginx.conf                                # Nginx 配置
├── docker-compose.yml                        # Docker 配置
├── 部署指南.md                               # Docker 部署指南
├── 后端 JAR 包部署指南.md                     # JAR 详细部署指南
└── JAR 包快速部署说明.md                     # 本文档
```

---

## 🎯 下一步

1. **本地打包测试**
   ```cmd
   cd code\backend
   build.bat
   ```

2. **准备服务器**
   - 购买云服务器（阿里云/腾讯云/AWS 等）
   - 获取服务器 IP 和 root 密码

3. **上传并部署**
   - 按照上述步骤上传文件
   - 配置数据库和 Nginx
   - 启动服务

4. **验证访问**
   - 浏览器访问 `http://服务器IP:8091`

---

## 📚 更多文档

- **快速部署指南**: [JAR 包快速部署说明.md](JAR 包快速部署说明.md)
- **详细部署指南**: [后端 JAR 包部署指南.md](后端 JAR 包部署指南.md)
- **Docker 部署**: [部署指南.md](部署指南.md)

---

## 💡 技术支持

如遇到问题，请提供以下信息以便快速定位：

1. **系统日志**: `journalctl -u sms-backend -n 100`
2. **应用日志**: `cat /opt/sms/logs/sms-backend.log`
3. **系统信息**: `uname -a && cat /etc/os-release`
4. **Java 版本**: `java -version`
5. **数据库状态**: `systemctl status mysqld`

---

**祝你部署顺利！** 🎉

如有任何问题，随时提问。
