/*
 * @Author: YinZihao 2764053835@qq.com
 * @Date: 2026-04-03 15:04:13
 * @LastEditors: YinZihao 2764053835@qq.com
 * @LastEditTime: 2026-04-10 06:25:17
 * @FilePath: \Student-Management-System-master\code\frontend\src\router\index.js
 * @Description: 
 * 
 */
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Home from '../views/Home.vue'
import UserManagement from '../views/UserManagement.vue'
import ClassManagement from '../views/ClassManagement.vue'
import CourseManagement from '../views/CourseManagement.vue'
import ScoreManagement from '../views/ScoreManagement.vue'
import MyScores from '../views/MyScores.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Dashboard,
    children: [
      {
        path: 'dashboard',
        name: 'Home',
        component: Home
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement
      },
      {
        path: 'classes',
        name: 'ClassManagement',
        component: ClassManagement
      },
      {
        path: 'courses',
        name: 'CourseManagement',
        component: CourseManagement
      },
      {
        path: 'scores',
        name: 'ScoreManagement',
        component: ScoreManagement
      },
      {
        path: 'my-scores',
        name: 'MyScores',
        component: MyScores
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
