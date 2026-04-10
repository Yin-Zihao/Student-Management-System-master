<template>
  <el-container style="height:100vh">
    <el-aside width="200px">
      <el-menu router>
        <el-menu-item index="/student/dashboard">个人看板</el-menu-item>
        <el-menu-item index="/student/scores">我的成绩</el-menu-item>
        <el-menu-item index="/student/competitions">竞赛获奖</el-menu-item>
        <el-menu-item index="/student/profile">个人信息</el-menu-item>
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
const roleLabel = role === 'student' ? '学生' : role
function handleLogout() {
  logout()
  router.push('/login')
}
</script>
