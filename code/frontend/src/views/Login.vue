<template>
  <div style="max-width:360px;margin:80px auto">
    <el-card>
      <h3 style="text-align:center;margin-bottom:16px">登录 - 学生管理系统</h3>
      <el-form :model="form" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.role" placeholder="选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const form = reactive({ username: '', password: '', role: 'student' })
function login() {
  // mock login: store token and role
  localStorage.setItem('sm_token', 'mock-token')
  localStorage.setItem('sm_role', form.role)
  if (form.role === 'admin') router.push('/admin')
  else if (form.role === 'teacher') router.push('/teacher/courses')
  else router.push('/student/dashboard')
}
</script>
