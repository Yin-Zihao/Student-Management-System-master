本 README 说明如何在本地启动由 Vite + Vue3 + Element Plus 构建的前端骨架。

1. 进入目录

```powershell
cd code/frontend
```

2. 安装依赖

```powershell
npm install
```

3. 启动开发服务器

```powershell
npm run dev
```

说明：
- 已创建基础路由 `/login`、`/admin`、`/teacher/courses`、`/student/dashboard`。
- `src/api/index.js` 提供 axios 实例并携带 JWT 的拦截器骨架。
- 下一步将补充完整的管理员 20 个页面骨架与权限守卫。
