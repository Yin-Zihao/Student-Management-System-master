<template>
  <el-container style="height:100vh">
    <el-aside width="200px">
      <el-menu router>
        <el-menu-item index="/teacher/courses">我的课程</el-menu-item>
        <el-menu-item index="/teacher/scores">成绩管理</el-menu-item>
        <el-menu-item index="/teacher/papers">论文管理</el-menu-item>
        <el-menu-item index="/teacher/research-projects">科研项目</el-menu-item>
        <el-menu-item index="/teacher/teaching-awards">教研奖励</el-menu-item>
        <el-menu-item index="/teacher/innovation-projects">大创项目</el-menu-item>
        <el-menu-item index="/teacher/profile">个人信息</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background:#fff;padding:10px;display:flex;justify-content:flex-end;align-items:center">
        <div style="margin-right:16px">{{ username }}（{{ roleLabel }}）</div>
        <el-button type="text" @click="handleLogout">退出</el-button>
      </el-header>
      <el-main style="padding:16px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUsername, getRole, logout } from '../utils/auth'
const router = useRouter()
const username = ref(getUsername())
const role = getRole()
const roleLabel = role === 'teacher' ? '教师' : role
function handleLogout() {
  logout()
  router.push('/login')
}
</script>
