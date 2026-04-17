<template>
  <el-container style="height:100vh">
    <el-aside width="260px" style="background:#304156">
      <div class="logo">
        <el-icon :size="32"><UserFilled /></el-icon>
        <span>人事管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/secretary/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据看板</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><School /></el-icon>
            <span>教学管理</span>
          </template>
          <el-menu-item index="/secretary/courses">课程管理</el-menu-item>
          <el-menu-item index="/secretary/scores">成绩管理</el-menu-item>
          <el-menu-item index="/secretary/classes">班级管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><Postcard /></el-icon>
            <span>人事管理</span>
          </template>
          <el-menu-item index="/secretary/teacher-info">教职工信息</el-menu-item>
          <el-menu-item index="/secretary/educations">学历学位</el-menu-item>
          <el-menu-item index="/secretary/assessments">年度考核</el-menu-item>
          <el-menu-item index="/secretary/entrepreneurships">创业信息</el-menu-item>
          <el-menu-item index="/secretary/children">子女信息</el-menu-item>
          <el-menu-item index="/secretary/honors">荣誉称号</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="3">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>党务管理</span>
          </template>
          <el-menu-item index="/secretary/party-documents">党务文件</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="4">
          <template #title>
            <el-icon><Folder /></el-icon>
            <span>数据管理</span>
          </template>
          <el-menu-item index="/secretary/papers">论文管理</el-menu-item>
          <el-menu-item index="/secretary/research-projects">科研项目</el-menu-item>
          <el-menu-item index="/secretary/research-awards">科研奖励</el-menu-item>
          <el-menu-item index="/secretary/teaching-awards">教研奖励</el-menu-item>
          <el-menu-item index="/secretary/innovation-projects">大创项目</el-menu-item>
          <el-menu-item index="/secretary/competitions">竞赛管理</el-menu-item>
          <el-menu-item index="/secretary/lanqiao">蓝桥杯</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="5">
          <template #title>
            <el-icon><Upload /></el-icon>
            <span>导入导出</span>
          </template>
          <el-menu-item index="/secretary/import-export">数据导入导出</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="6">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/secretary/users">用户管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="welcome">欢迎，{{ userInfo?.realName || '用户' }}</span>
          <el-tag size="small" type="success" style="margin-left: 10px">人事秘书</el-tag>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="username">{{ userInfo?.realName }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import store from '@/store'
import { getUserInfo } from '@/api'

const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => route.path)
const userInfo = computed(() => store.state.userInfo)

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      store.logout()
      ElMessage.success('已退出登录')
      router.push('/login')
    } catch {
    }
  } else if (command === 'profile') {
    ElMessage.info('个人信息功能开发中')
  }
}

onMounted(async () => {
  if (!store.state.userInfo) {
    try {
      const response = await getUserInfo()
      store.setUserInfo(response.data)
    } catch (error) {
      router.push('/login')
    }
  }
})
</script>

<style scoped>
.sidebar {
  background-color: #304156;
  overflow-x: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2b3a4a;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.logo .el-icon {
  margin-right: 10px;
}

.sidebar-menu {
  border: none;
  height: calc(100vh - 60px);
}

.header {
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left .welcome {
  font-size: 16px;
  color: #333;
}

.header-right .user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header-right .username {
  margin: 0 10px;
  color: #333;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>