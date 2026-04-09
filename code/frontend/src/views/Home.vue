<template>
  <div class="home-container">
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon :size="40"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.userCount }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon course-icon">
              <el-icon :size="40"><Notebook /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.courseCount }}</div>
              <div class="stat-label">课程总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon class-icon">
              <el-icon :size="40"><School /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.classCount }}</div>
              <div class="stat-label">班级总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon score-icon">
              <el-icon :size="40"><DataLine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.scoreCount }}</div>
              <div class="stat-label">成绩记录</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="welcome-row">
      <el-col :span="24">
        <el-card class="welcome-card">
          <h2>欢迎使用学生管理系统！</h2>
          <p>这是一个面向计算机学院的学生成绩管理系统，集成了学生信息管理、课程管理、成绩录入与查询、学分统计等功能。</p>
          <el-divider />
          <h3>快速开始</h3>
          <ul>
            <li v-if="['admin'].includes(role)">
              <el-link type="primary" @click="$router.push('/users')">用户管理</el-link> - 管理系统用户
            </li>
            <li v-if="['admin'].includes(role)">
              <el-link type="primary" @click="$router.push('/classes')">班级管理</el-link> - 维护班级结构
            </li>
            <li v-if="['admin', 'teacher'].includes(role)">
              <el-link type="primary" @click="$router.push('/courses')">课程管理</el-link> - 管理课程信息
            </li>
            <li v-if="['admin', 'teacher'].includes(role)">
              <el-link type="primary" @click="$router.push('/scores')">成绩管理</el-link> - 录入和查询成绩
            </li>
            <li v-if="['student'].includes(role)">
              <el-link type="primary" @click="$router.push('/my-scores')">我的成绩</el-link> - 查看个人成绩
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import store from '@/store'
import { getUserList, getCourseList, getClassList, getScoreList } from '@/api'

const role = computed(() => store.state.userInfo?.role || '')

const stats = reactive({
  userCount: 0,
  courseCount: 0,
  classCount: 0,
  scoreCount: 0
})

const loadStats = async () => {
  try {
    const [users, courses, classes, scores] = await Promise.all([
      getUserList({ page: 1, size: 1 }),
      getCourseList({ page: 1, size: 1 }),
      getClassList(),
      getScoreList({ page: 1, size: 1 })
    ])
    stats.userCount = users.data?.total || 0
    stats.courseCount = courses.data?.total || 0
    stats.classCount = classes.data?.length || 0
    stats.scoreCount = scores.data?.total || 0
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.home-container {
  padding: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 20px;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.class-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.score-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #999;
}

.welcome-card h2 {
  color: #333;
  margin-bottom: 10px;
}

.welcome-card p {
  color: #666;
  line-height: 1.6;
}

.welcome-card h3 {
  color: #333;
  margin: 20px 0 15px 0;
}

.welcome-card ul {
  list-style: none;
  padding: 0;
}

.welcome-card li {
  padding: 8px 0;
  color: #666;
}
</style>
