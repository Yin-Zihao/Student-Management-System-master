# 前端静态原型（说明）

位置：`code/frontend`

如何本地查看：

1. 在文件管理器中打开 `code/frontend/index.html`（会跳转到登录页）。
2. 推荐使用本地静态服务器（避免模块/CORS 问题）：

```powershell
cd "d:\mydownload\工程设计\Student-Management-System-master\code\frontend"
# Python (若已安装)
py -3 -m http.server 5173
# 或者使用 npx
npx serve -p 5173 .
# 浏览器打开 http://localhost:5173
```

后端 API 约定（前端使用的示例接口）：

- POST /api/login  -> body: {username,password} 返回 {ok:true, token, user}
- GET  /api/students -> 返回学生数组 [{id,name,gender,class,phone,email}, ...]

如果后端不可用，前端脚本会使用本地模拟数据（见 `assets/app.js`）。

数据库设计建议（最小）：

- students 表：
  - id (int, PK)
  - name (varchar)
  - gender (varchar)
  - class (varchar)
  - phone (varchar)
  - email (varchar)

下一步建议：
- 如果需要我可以：
  - 根据后端真实 API 修改前端请求地址并加入真实认证（Bearer token）。
  - 把 `code/frontend` 部署到 GitHub Pages（我已经添加了 Action，可检查 Actions 日志）。
  - 增加学生新增/编辑页面并实现与后端交互。
