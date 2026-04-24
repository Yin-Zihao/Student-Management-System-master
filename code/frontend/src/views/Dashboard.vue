<template>
  <el-container class="dashboard-container">
    <el-aside width="240px" class="sidebar">
      <div class="logo">
        <el-icon :size="32"><UserFilled /></el-icon>
        <span>学管系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-sub-menu v-if="['admin'].includes(role)">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/classes">
            <el-icon><School /></el-icon>
            <span>班级管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="['admin', 'teacher'].includes(role)">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>教学管理</span>
          </template>
          <el-menu-item index="/courses">
            <el-icon><Notebook /></el-icon>
            <span>课程管理</span>
          </el-menu-item>
          <el-menu-item index="/scores">
            <el-icon><DataLine /></el-icon>
            <span>成绩管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-if="['student'].includes(role)" index="/my-scores">
          <el-icon><Trophy /></el-icon>
          <span>我的成绩</span>
        </el-menu-item>

        <el-sub-menu v-if="['secretary'].includes(role)">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>数据看板</span>
          </template>
          <el-menu-item index="/secretary/dashboard">
            <el-icon><DataLine /></el-icon>
            <span>人事看板</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="['secretary'].includes(role)">
          <template #title>
            <el-icon><Postcard /></el-icon>
            <span>人事管理</span>
          </template>
          <el-menu-item index="/secretary/teacher-info">
            <el-icon><User /></el-icon>
            <span>教职工信息</span>
          </el-menu-item>
          <el-menu-item index="/secretary/educations">
            <el-icon><School /></el-icon>
            <span>学历学位</span>
          </el-menu-item>
          <el-menu-item index="/secretary/assessments">
            <el-icon><CircleCheck /></el-icon>
            <span>年度考核</span>
          </el-menu-item>
          <el-menu-item index="/secretary/entrepreneurships">
            <el-icon><Briefcase /></el-icon>
            <span>创业信息</span>
          </el-menu-item>
          <el-menu-item index="/secretary/children">
            <el-icon><UserFilled /></el-icon>
            <span>子女信息</span>
          </el-menu-item>
          <el-menu-item index="/secretary/honors">
            <el-icon><Trophy /></el-icon>
            <span>荣誉称号</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="['secretary'].includes(role)">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>党务管理</span>
          </template>
          <el-menu-item index="/secretary/party-documents">
            <el-icon><Files /></el-icon>
            <span>党务文件</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="['secretary'].includes(role)">
          <template #title>
            <el-icon><Folder /></el-icon>
            <span>数据管理</span>
          </template>
          <el-menu-item index="/secretary/papers">
            <el-icon><Document /></el-icon>
            <span>论文管理</span>
          </el-menu-item>
          <el-menu-item index="/secretary/research-projects">
            <el-icon><FolderOpened /></el-icon>
            <span>科研项目</span>
          </el-menu-item>
          <el-menu-item index="/secretary/research-awards">
            <el-icon><Medal /></el-icon>
            <span>科研奖励</span>
          </el-menu-item>
          <el-menu-item index="/secretary/teaching-awards">
            <el-icon><Reading /></el-icon>
            <span>教研奖励</span>
          </el-menu-item>
          <el-menu-item index="/secretary/innovation-projects">
            <el-icon><Cpu /></el-icon>
            <span>大创项目</span>
          </el-menu-item>
          <el-menu-item index="/secretary/competitions">
            <el-icon><Trophy /></el-icon>
            <span>竞赛管理</span>
          </el-menu-item>
          <el-menu-item index="/secretary/lanqiao">
            <el-icon><Monitor /></el-icon>
            <span>蓝桥杯</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu v-if="['secretary'].includes(role)">
          <template #title>
            <el-icon><Upload /></el-icon>
            <span>导入导出</span>
          </template>
          <el-menu-item index="/secretary/import-export">
            <el-icon><Download /></el-icon>
            <span>数据导入导出</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="welcome">欢迎，{{ userInfo?.realName || '用户' }}</span>
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
const role = computed(() => store.state.userInfo?.role || '')

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
.dashboard-container {
  height: 100vh;
}

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
  font-size: 20px;
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
