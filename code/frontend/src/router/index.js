import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import Users from '../views/admin/Users.vue'
import Classes from '../views/admin/Classes.vue'
import Courses from '../views/admin/Courses.vue'
import Scores from '../views/admin/Scores.vue'
import ImportExport from '../views/admin/ImportExport.vue'
import Papers from '../views/admin/Papers.vue'
import ResearchProjects from '../views/admin/ResearchProjects.vue'
import ResearchAwards from '../views/admin/ResearchAwards.vue'
import TeachingAwards from '../views/admin/TeachingAwards.vue'
import InnovationProjects from '../views/admin/InnovationProjects.vue'
import TeacherInfo from '../views/admin/TeacherInfo.vue'
import Educations from '../views/admin/Educations.vue'
import Assessments from '../views/admin/Assessments.vue'
import Entrepreneurships from '../views/admin/Entrepreneurships.vue'
import Children from '../views/admin/Children.vue'
import Honors from '../views/admin/Honors.vue'
import PartyDocuments from '../views/admin/PartyDocuments.vue'
import Competitions from '../views/admin/Competitions.vue'
import Lanqiao from '../views/admin/Lanqiao.vue'

import TeacherLayout from '../layouts/TeacherLayout.vue'
import TeacherCourses from '../views/teacher/Courses.vue'
import TeacherScores from '../views/teacher/Scores.vue'
import TeacherPapers from '../views/teacher/Papers.vue'
import TeacherResearch from '../views/teacher/ResearchProjects.vue'
import TeacherTeachingAwards from '../views/teacher/TeachingAwards.vue'
import TeacherInnovation from '../views/teacher/InnovationProjects.vue'
import TeacherProfile from '../views/teacher/Profile.vue'

import StudentLayout from '../layouts/StudentLayout.vue'
import StudentDashboard from '../views/student/Dashboard.vue'
import StudentScores from '../views/student/Scores.vue'
import StudentCompetitions from '../views/student/Competitions.vue'
import StudentProfile from '../views/student/Profile.vue'

import { getToken, getRole } from '../utils/auth'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'AdminUsers', component: Users },
      { path: 'classes', name: 'AdminClasses', component: Classes },
      { path: 'courses', name: 'AdminCourses', component: Courses },
      { path: 'scores', name: 'AdminScores', component: Scores },
      { path: 'import-export', name: 'AdminImportExport', component: ImportExport },
      { path: 'papers', name: 'AdminPapers', component: Papers },
      { path: 'research-projects', name: 'AdminResearchProjects', component: ResearchProjects },
      { path: 'research-awards', name: 'AdminResearchAwards', component: ResearchAwards },
      { path: 'teaching-awards', name: 'AdminTeachingAwards', component: TeachingAwards },
      { path: 'innovation-projects', name: 'AdminInnovationProjects', component: InnovationProjects },
      { path: 'teacher-info', name: 'AdminTeacherInfo', component: TeacherInfo },
      { path: 'educations', name: 'AdminEducations', component: Educations },
      { path: 'assessments', name: 'AdminAssessments', component: Assessments },
      { path: 'entrepreneurships', name: 'AdminEntrepreneurships', component: Entrepreneurships },
      { path: 'children', name: 'AdminChildren', component: Children },
      { path: 'honors', name: 'AdminHonors', component: Honors },
      { path: 'party-documents', name: 'AdminPartyDocuments', component: PartyDocuments },
      { path: 'competitions', name: 'AdminCompetitions', component: Competitions },
      { path: 'lanqiao', name: 'AdminLanqiao', component: Lanqiao }
    ]
  },
  {
    path: '/teacher',
    component: TeacherLayout,
    children: [
      { path: 'courses', name: 'TeacherCourses', component: TeacherCourses },
      { path: 'scores', name: 'TeacherScores', component: TeacherScores },
      { path: 'papers', name: 'TeacherPapers', component: TeacherPapers },
      { path: 'research-projects', name: 'TeacherResearch', component: TeacherResearch },
      { path: 'teaching-awards', name: 'TeacherTeachingAwards', component: TeacherTeachingAwards },
      { path: 'innovation-projects', name: 'TeacherInnovation', component: TeacherInnovation },
      { path: 'profile', name: 'TeacherProfile', component: TeacherProfile }
    ]
  },
  {
    path: '/student',
    component: StudentLayout,
    children: [
      { path: 'dashboard', name: 'StudentDashboard', component: StudentDashboard },
      { path: 'scores', name: 'StudentScores', component: StudentScores },
      { path: 'competitions', name: 'StudentCompetitions', component: StudentCompetitions },
      { path: 'profile', name: 'StudentProfile', component: StudentProfile }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = getToken()
  const role = getRole()
  if (to.path === '/login') return next()
  if (!token) return next('/login')
  // role-based access
  if (to.path.startsWith('/admin') && role !== 'admin') {
    if (role === 'teacher') return next('/teacher/courses')
    if (role === 'student') return next('/student/dashboard')
    return next('/login')
  }
  if (to.path.startsWith('/teacher') && role !== 'teacher') {
    if (role === 'admin') return next('/admin')
    if (role === 'student') return next('/student/dashboard')
    return next('/login')
  }
  if (to.path.startsWith('/student') && role !== 'student') {
    if (role === 'admin') return next('/admin')
    if (role === 'teacher') return next('/teacher/courses')
    return next('/login')
  }
  next()
})

export default router
