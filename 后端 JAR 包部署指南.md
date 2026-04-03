# 学管系统后端部署指南（JAR 包方式）

## 一、本地打包

### Windows 系统

1. **使用批处理脚本（推荐）**
   ```cmd
   cd code\backend
   build.bat
   ```

2. **使用 Maven 命令**
   ```cmd
   cd code\backend
   mvn clean package -DskipTests
   ```

### Linux/Mac 系统

```bash
cd code/backend
chmod +x build.sh
./build.sh
```

打包成功后，会在 `target` 目录生成：
- `sms-backend-1.0.0.jar` - 可执行 JAR 包
- `sms-backend-1.0.0.jar.original` - 原始 JAR 包

---

## 二、上传到服务器

### 方法 1: SCP 命令

```bash
# 在本地电脑执行
scp code/backend/target/sms-backend-1.0.0.jar root@服务器 IP:/opt/sms/
scp code/backend/application-prod.yml root@服务器 IP:/opt/sms/
```

### 方法 2: FTP/SFTP

使用 FileZilla、WinSCP 等工具上传以下文件到服务器 `/opt/sms/` 目录：
- `sms-backend-1.0.0.jar`
- `application-prod.yml`

### 方法 3: Git 仓库

```bash
# 在服务器上执行
cd /opt
git clone <你的 Git 仓库地址> sms
cd sms/code/backend
mvn clean package -DskipTests
```

---

## 三、服务器环境准备

### 1. 安装 Java 17

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk -y

# CentOS/RHEL
sudo yum install java-17-openjdk-devel -y

# 验证安装
java -version
```

### 2. 安装 MySQL 8.0

```bash
# Ubuntu/Debian
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# CentOS/RHEL
sudo yum install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 安全配置
sudo mysql_secure_installation
```

### 3. 创建数据库

```bash
mysql -u root -p
```

```sql
-- 创建数据库
CREATE DATABASE student_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（可选）
CREATE USER 'sms_user'@'localhost' IDENTIFIED BY 'YourPassword@123';
GRANT ALL PRIVILEGES ON student_management.* TO 'sms_user'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

---

## 四、启动服务

### 方法 1: 直接启动（适合测试）

```bash
cd /opt/sms
nohup java -jar sms-backend-1.0.0.jar --spring.profiles.active=prod > backend.log 2>&1 &

# 查看进程
ps aux | grep sms-backend

# 查看日志
tail -f backend.log
```

### 方法 2: 使用 Systemd 服务（推荐，适合生产）

```bash
# 创建服务文件
sudo vi /etc/systemd/system/sms-backend.service
```

粘贴以下内容（已创建模板文件 `sms-backend.service`）：

```ini
[Unit]
Description=Student Management System Backend Service
After=network.target mysqld.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/sms
ExecStart=/usr/bin/java -jar /opt/sms/sms-backend-1.0.0.jar --spring.profiles.active=prod
Restart=always
RestartSec=10
Environment="JAVA_OPTS=-Xms512m -Xmx2g"

[Install]
WantedBy=multi-user.target
```

```bash
# 重载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start sms-backend

# 设置开机自启
sudo systemctl enable sms-backend

# 查看状态
sudo systemctl status sms-backend

# 查看日志
sudo journalctl -u sms-backend -f
```

---

## 五、配置 Nginx 反向代理

### 1. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt install nginx -y

# CentOS/RHEL
sudo yum install nginx -y
```

### 2. 配置 Nginx

```bash
sudo vi /etc/nginx/conf.d/sms.conf
```

添加以下配置：

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
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. 启动 Nginx

```bash
# 测试配置
sudo nginx -t

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 重载配置
sudo systemctl reload nginx
```

---

## 六、防火墙配置

```bash
# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=8091/tcp
sudo firewall-cmd --reload

# Ubuntu/Debian
sudo ufw allow 8091/tcp
sudo ufw enable

# 或者关闭防火墙（仅开发环境）
sudo systemctl stop firewalld
sudo systemctl disable firewalld
```

---

## 七、验证部署

### 1. 检查服务状态

```bash
# Systemd 方式
sudo systemctl status sms-backend

# 或直接查看进程
ps aux | grep java

# 查看端口监听
netstat -tlnp | grep 8080
```

### 2. 测试接口

```bash
# 测试后端服务
curl http://localhost:8080/api/health

# 通过 Nginx 代理测试
curl http://localhost:8091/api/health
```

### 3. 浏览器访问

打开浏览器访问：
```
http://服务器IP:8091
```

---

## 八、常用运维命令

### Systemd 服务管理

```bash
# 启动服务
sudo systemctl start sms-backend

# 停止服务
sudo systemctl stop sms-backend

# 重启服务
sudo systemctl restart sms-backend

# 重新加载配置
sudo systemctl daemon-reload

# 查看状态
sudo systemctl status sms-backend

# 查看实时日志
sudo journalctl -u sms-backend -f

# 禁用开机自启
sudo systemctl disable sms-backend
```

### 直接启动方式

```bash
# 启动
nohup java -jar sms-backend-1.0.0.jar --spring.profiles.active=prod > backend.log 2>&1 &

# 停止
ps aux | grep sms-backend | grep -v grep | awk '{print $2}' | xargs kill -9

# 查看日志
tail -f backend.log

# 查看进程
ps aux | grep java
```

---

## 九、JVM 优化参数

编辑 `sms-backend.service` 文件，调整 JVM 参数：

```ini
Environment="JAVA_OPTS=-Xms1g -Xmx4g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/opt/sms/logs/heapdump.hprof"
```

常用参数说明：
- `-Xms`: 初始堆大小
- `-Xmx`: 最大堆大小
- `-XX:+UseG1GC`: 使用 G1 垃圾回收器
- `-XX:MaxGCPauseMillis`: 最大 GC 暂停时间
- `-XX:+HeapDumpOnOutOfMemoryError`: OOM 时生成堆转储
- `-XX:HeapDumpPath`: 堆转储文件路径

---

## 十、日志管理

### 1. 日志文件位置

默认日志文件：`logs/sms-backend.log`

### 2. 查看日志

```bash
# Systemd 方式
sudo journalctl -u sms-backend -f

# 直接查看文件
tail -f /opt/sms/logs/sms-backend.log
```

### 3. 日志轮转

创建日志轮转配置：

```bash
sudo vi /etc/logrotate.d/sms-backend
```

```
/opt/sms/logs/*.log {
    daily
    rotate 30
    missingok
    notifempty
    compress
    delaycompress
    copytruncate
    create 0644 root root
}
```

---

## 十一、常见问题排查

### 1. 端口被占用

```bash
# 查看端口占用
netstat -tlnp | grep 8080

# 杀死占用端口的进程
kill -9 <PID>

# 或修改配置文件中的端口号
```

### 2. 数据库连接失败

```bash
# 检查 MySQL 状态
sudo systemctl status mysqld

# 测试数据库连接
mysql -u root -p -e "SHOW DATABASES;"

# 检查数据库用户权限
mysql -u root -p -e "SELECT user, host FROM mysql.user;"
```

### 3. 内存不足

```bash
# 查看内存使用
free -h

# 调整 JVM 参数，减小-Xmx 值
```

### 4. 服务无法启动

```bash
# 查看详细错误日志
sudo journalctl -u sms-backend -n 100 --no-pager

# 或查看应用日志
cat logs/sms-backend.log
```

---

## 十二、升级部署

```bash
# 1. 停止服务
sudo systemctl stop sms-backend

# 2. 备份旧版本
cd /opt/sms
cp sms-backend-1.0.0.jar sms-backend-1.0.0.jar.bak

# 3. 上传新版本
scp sms-backend-1.0.0.jar root@服务器 IP:/opt/sms/

# 4. 启动新版本
sudo systemctl start sms-backend

# 5. 查看状态
sudo systemctl status sms-backend

# 6. 如果出现问题，回滚到旧版本
sudo systemctl stop sms-backend
cp sms-backend-1.0.0.jar.bak sms-backend-1.0.0.jar
sudo systemctl start sms-backend
```

---

## 十三、安全建议

1. **修改默认密码**
   - 数据库密码使用强密码
   - 不要使用 root 用户运行应用

2. **配置防火墙**
   - 只开放必要端口（8091）
   - 限制数据库远程访问

3. **启用 HTTPS**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

4. **定期备份数据库**
   ```bash
   mysqldump -u root -p student_management > backup_$(date +%Y%m%d).sql
   ```

5. **监控系统资源**
   ```bash
   # 安装监控工具
   sudo apt install htop iotop -y
   
   # 查看资源使用
   top
   df -h
   free -h
   ```

---

## 技术支持

如遇到问题，请提供：
1. 系统日志：`sudo journalctl -u sms-backend -n 200`
2. 应用日志：`cat logs/sms-backend.log`
3. 系统信息：`uname -a && cat /etc/os-release`
4. Java 版本：`java -version`
