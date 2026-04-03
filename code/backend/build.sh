#!/bin/bash

echo "=== 学管系统后端打包脚本 ==="

# 检查 Maven 是否安装
if ! command -v mvn &> /dev/null; then
    echo "错误：Maven 未安装，请先安装 Maven"
    exit 1
fi

# 检查 Java 版本
JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "当前 Java 版本：$JAVA_VERSION"

if [[ ! "$JAVA_VERSION" =~ ^17 ]]; then
    echo "警告：建议使用 Java 17"
fi

# 进入后端目录
cd "$(dirname "$0")"

echo "开始清理旧的构建文件..."
mvn clean

echo "开始编译和打包..."
mvn package -DskipTests

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 打包成功！"
    echo "JAR 文件位置：target/sms-backend-1.0.0.jar"
    echo ""
    echo "启动命令："
    echo "  java -jar target/sms-backend-1.0.0.jar"
    echo ""
    echo "生产环境启动命令："
    echo "  java -jar target/sms-backend-1.0.0.jar --spring.profiles.active=prod"
else
    echo ""
    echo "❌ 打包失败，请检查错误信息"
    exit 1
fi
