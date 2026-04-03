@echo off
chcp 65001 >nul
echo ================================
echo   学管系统后端打包脚本
echo ================================
echo.

:: 检查 Maven 是否安装
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误：Maven 未安装，请先安装 Maven
    pause
    exit /b 1
)

:: 检查 Java 版本
echo 检查 Java 版本...
java -version
echo.

:: 进入当前目录
cd /d "%~dp0"

echo 开始清理旧的构建文件...
call mvn clean

echo 开始编译和打包...
call mvn package -DskipTests

if %errorlevel% equ 0 (
    echo.
    echo ✅ 打包成功！
    echo JAR 文件位置：target\sms-backend-1.0.0.jar
    echo.
    echo 启动命令：
    echo   java -jar target\sms-backend-1.0.0.jar
    echo.
    echo 生产环境启动命令：
    echo   java -jar target\sms-backend-1.0.0.jar --spring.profiles.active=prod
) else (
    echo.
    echo ❌ 打包失败，请检查错误信息
)

pause
