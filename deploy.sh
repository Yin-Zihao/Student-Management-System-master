#!/bin/bash

echo "=== 学管系统部署脚本 ==="

# 检查是否在项目根目录
if [ ! -f "docker-compose.yml" ]; then
    echo "错误：请在项目根目录执行此脚本"
    exit 1
fi

# 构建前端
echo "正在构建前端..."
cd code/frontend
npm install
npm run build
cd ../..

# 复制 Nginx 配置
echo "配置 Nginx..."
mkdir -p nginx
cp nginx.conf nginx/default.conf

# 停止旧容器
echo "停止旧容器..."
docker-compose down

# 启动新容器
echo "启动服务..."
docker-compose up -d

# 等待服务启动
sleep 10

# 检查服务状态
echo "检查服务状态..."
docker-compose ps

echo ""
echo "=== 部署完成 ==="
echo "访问地址：http://localhost:8091"
echo "后端 API: http://localhost:8091/api/"
echo ""
echo "查看日志：docker-compose logs -f"
echo "停止服务：docker-compose down"
