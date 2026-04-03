# 学管系统 - JAR 包快速部署指南

## ✅ 已完成配置

项目已经配置好可以打包成 JAR 包部署到服务器，所有必要的配置文件都已创建完成。

---

## 📦 一、本地打包（Windows）

### 方法 1: 双击运行批处理文件（最简单）

1. 打开文件资源管理器
2. 进入 `code\backend` 目录
3. 双击运行 `build.bat`
4. 等待打包完成，会生成 `target\sms-backend-1.0.0.jar`

### 方法 2: 使用命令行

```cmd
cd code\backend
mvn clean package -DskipTests
```

打包成功后，在 `target` 目录生成 JAR 包：
- **sms-backend-1.0.0.jar** (约 50-60MB)

---

## 🚀 二、上传到 Linux 服务器

### 方式 1: SCP 命令（推荐）

在 Windows PowerShell 或 CMD 中执行：

```cmd
# 创建远程目录
ssh root@你的服务器 IP "mkdir -p /opt/sms"

# 上传 JAR 包
scp code\backend\target\sms-backend-1.0.0.jar root@你的服务器 IP:/opt/sms/

# 上传配置文件
scp code\backend\application-prod.yml root@你的服务器 IP:/opt/sms/

# 上传 systemd 服务文件
scp code\backend\sms-backend.service root@你的服务器 IP:/etc/systemd/system/
```

### 方式 2: 使用 FileZilla

1. 下载安装 FileZilla Client
2. 连接到服务器（主机：服务器 IP，用户名：root，密码：xxx）
3. 将本地 `code\backend\target\sms-backend-1.0.0.jar` 拖拽到服务器 `/opt/sms/` 目录

---

## ⚙️ 三、服务器配置（SSH 连接后执行）

### 1. 安装 Java 17

```bash
# Ubuntu/Debian
apt update && apt install openjdk-17-jdk -y

# CentOS/RHEL
yum install java-17-openjdk-devel -y

# 验证
java -version
```

### 2. 安装 MySQL

```bash
# Ubuntu/Debian
apt install mysql-server -y
systemctl start mysql
systemctl enable mysql

# CentOS/RHEL
yum install mysql-server -y
systemctl start mysqld
systemctl enable mysqld

# 初始化数据库
mysql_secure_installation
```

### 3. 创建数据库

```bash
mysql -u root -p
```

执行 SQL：
```sql
CREATE DATABASE student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 可选：创建专用用户
-- CREATE USER 'sms'@'localhost' IDENTIFIED BY 'StrongPassword123!';
-- GRANT ALL PRIVILEGES ON student_management.* TO 'sms'@'localhost';
-- FLUSH PRIVILEGES;
EXIT;
```

### 4. 配置应用

```bash
cd /opt/sms

# 编辑生产环境配置
vi application-prod.yml
```

修改数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/student_management?...
    username: root          # 或 sms
    password: 你的密码       # 改为实际密码
```

### 5. 启动服务

#### 方法 A: Systemd 服务（推荐，开机自启）

```bash
# 设置服务文件权限
chmod 644 /etc/systemd/system/sms-backend.service

# 重载 systemd
systemctl daemon-reload

# 启动服务
systemctl start sms-backend

# 设置开机自启
systemctl enable sms-backend

# 查看状态
systemctl status sms-backend
```

#### 方法 B: 直接启动（临时测试）

```bash
cd /opt/sms
nohup java -jar sms-backend-1.0.0.jar --spring.profiles.active=prod > backend.log 2>&1 &

# 查看日志
tail -f backend.log

# 查看进程
ps aux | grep java
```

---

## 🔧 四、配置 Nginx 反向代理（8091 端口）

### 1. 安装 Nginx

```bash
# Ubuntu/Debian
apt install nginx -y

# CentOS/RHEL
yum install nginx -y
```

### 2. 配置 Nginx

```bash
vi /etc/nginx/conf.d/sms.conf
```

粘贴以下内容：

```nginx
server {
    listen 8091;
    server_name localhost;

    # 前端静态文件（如果有）
    location / {
        root /opt/sms/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. 启动 Nginx

```bash
# 测试配置
nginx -t

# 启动
systemctl start nginx
systemctl enable nginx

# 重载配置
systemctl reload nginx
```

---

## ✅ 五、验证部署

### 1. 检查服务

```bash
# 查看后端服务
systemctl status sms-backend

# 查看 Nginx
systemctl status nginx

# 查看端口
netstat -tlnp | grep 8080
netstat -tlnp | grep 8091
```

### 2. 测试接口

```bash
# 直接访问后端
curl http://localhost:8080

# 通过 Nginx 访问
curl http://localhost:8091/api/health
```

### 3. 浏览器访问

```
http://你的服务器 IP:8091
```

---

## 📝 六、常用运维命令

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
# 1. 停止服务
systemctl stop sms-backend

# 2. 备份旧版本
cd /opt/sms
cp sms-backend-1.0.0.jar sms-backend-1.0.0.jar.bak

# 3. 上传新版本并覆盖
# (使用 SCP 或 FileZilla 上传新的 JAR 包)

# 4. 启动新版本
systemctl start sms-backend

# 5. 查看状态
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

## 🔒 七、防火墙配置

```bash
# CentOS/RHEL
firewall-cmd --permanent --add-port=8091/tcp
firewall-cmd --reload

# Ubuntu/Debian
ufw allow 8091/tcp
ufw enable

# 或者关闭防火墙（仅开发/测试环境）
systemctl stop firewalld
systemctl disable firewalld
```

---

## ⚠️ 八、常见问题

### 1. 服务启动失败

```bash
# 查看详细错误
journalctl -u sms-backend -n 50 --no-pager

# 常见原因：
# - 端口被占用：netstat -tlnp | grep 8080
# - 数据库未启动：systemctl status mysqld
# - 配置文件错误：检查 application-prod.yml
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 状态
systemctl status mysqld

# 测试连接
mysql -u root -p -e "SHOW DATABASES;"

# 检查数据库是否存在
mysql -u root -p -e "USE student_management;"
```

### 3. 端口冲突

```bash
# 查看端口占用
netstat -tlnp | grep 8080
netstat -tlnp | grep 8091

# 杀死占用端口的进程
kill -9 <PID>

# 或修改配置文件中的端口号
```

---

## 📊 九、性能优化建议

### JVM 参数调优

编辑 `/etc/systemd/system/sms-backend.service`：

```ini
[Service]
Environment="JAVA_OPTS=-Xms1g -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200"
```

根据服务器内存调整：
- 2GB 内存：`-Xms512m -Xmx1g`
- 4GB 内存：`-Xms1g -Xmx2g`
- 8GB 内存：`-Xms2g -Xmx4g`

### MySQL 优化

编辑 `/etc/my.cnf` 或 `/etc/mysql/mysql.conf.d/mysqld.cnf`：

```ini
[mysqld]
max_connections=200
innodb_buffer_pool_size=1G
query_cache_size=64M
```

---

## 🎯 十、一键部署脚本

创建 `/opt/sms/deploy.sh`：

```bash
#!/bin/bash

echo "=== 学管系统一键部署 ==="

# 1. 检查 Java
if ! command -v java &> /dev/null; then
    echo "❌ Java 未安装，请先安装 Java 17"
    exit 1
fi

# 2. 检查 MySQL
if ! systemctl is-active --quiet mysqld; then
    echo "❌ MySQL 未运行"
    exit 1
fi

# 3. 启动应用
echo "正在启动学管系统后端..."
systemctl start sms-backend

# 4. 检查状态
sleep 5
if systemctl is-active --quiet sms-backend; then
    echo "✅ 启动成功！"
    echo "访问地址：http://$(hostname -I | awk '{print $1}'):8091"
else
    echo "❌ 启动失败，请查看日志："
    journalctl -u sms-backend -n 20
fi
```

赋予执行权限：
```bash
chmod +x /opt/sms/deploy.sh
```

---

## 📚 相关文档

- **详细部署指南**: [后端 JAR 包部署指南.md](后端 JAR 包部署指南.md)
- **Docker 部署**: [部署指南.md](部署指南.md)
- **配置文件说明**: [code/backend/application.yml](code/backend/application.yml)

---

## 💡 需要帮助？

如遇到问题，请提供以下信息：
1. 错误日志：`journalctl -u sms-backend -n 100`
2. 系统信息：`cat /etc/os-release`
3. Java 版本：`java -version`
4. 数据库状态：`systemctl status mysqld`
