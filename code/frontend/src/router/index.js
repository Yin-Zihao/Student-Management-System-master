import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import TeacherCourses from '../views/teacher/Courses.vue'
import StudentDashboard from '../views/student/Dashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      // other admin children will be added later
    ]
  },
  { path: '/teacher/courses', name: 'TeacherCourses', component: TeacherCourses },
  { path: '/student/dashboard', name: 'StudentDashboard', component: StudentDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// simple route guard skeleton
router.beforeEach((to, from, next) => {
  // TODO: implement auth check with JWT in localStorage
  next()
})

export default router
