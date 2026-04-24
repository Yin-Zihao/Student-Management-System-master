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
import SecretaryLayout from '../layouts/SecretaryLayout.vue'
import Home from '../views/Home.vue'
import UserManagement from '../views/UserManagement.vue'
import ClassManagement from '../views/ClassManagement.vue'
import CourseManagement from '../views/CourseManagement.vue'
import ScoreManagement from '../views/ScoreManagement.vue'
import MyScores from '../views/MyScores.vue'
import TeacherInfo from '../views/admin/TeacherInfo.vue'
import Educations from '../views/admin/Educations.vue'
import Assessments from '../views/admin/Assessments.vue'
import Entrepreneurships from '../views/admin/Entrepreneurships.vue'
import Children from '../views/admin/Children.vue'
import Honors from '../views/admin/Honors.vue'
import PartyDocuments from '../views/admin/PartyDocuments.vue'
import Papers from '../views/admin/Papers.vue'
import ResearchProjects from '../views/admin/ResearchProjects.vue'
import ResearchAwards from '../views/admin/ResearchAwards.vue'
import TeachingAwards from '../views/admin/TeachingAwards.vue'
import InnovationProjects from '../views/admin/InnovationProjects.vue'
import Competitions from '../views/admin/Competitions.vue'
import Lanqiao from '../views/admin/Lanqiao.vue'
import ImportExport from '../views/admin/ImportExport.vue'

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
      },
      {
        path: 'papers',
        name: 'AdminPapers',
        component: Papers
      },
      {
        path: 'research-projects',
        name: 'AdminResearchProjects',
        component: ResearchProjects
      },
      {
        path: 'research-awards',
        name: 'AdminResearchAwards',
        component: ResearchAwards
      },
      {
        path: 'teaching-awards',
        name: 'AdminTeachingAwards',
        component: TeachingAwards
      },
      {
        path: 'innovation-projects',
        name: 'AdminInnovationProjects',
        component: InnovationProjects
      },
      {
        path: 'competitions',
        name: 'AdminCompetitions',
        component: Competitions
      },
      {
        path: 'lanqiao',
        name: 'AdminLanqiao',
        component: Lanqiao
      },
      {
        path: 'entrepreneurships',
        name: 'AdminEntrepreneurships',
        component: Entrepreneurships
      },
      {
        path: 'honors',
        name: 'AdminHonors',
        component: Honors
      }
    ]
  },
  {
    path: '/secretary',
    component: SecretaryLayout,
    children: [
      {
        path: 'dashboard',
        name: 'SecretaryDashboard',
        component: () => import('../views/secretary/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'SecretaryUsers',
        component: UserManagement
      },
      {
        path: 'classes',
        name: 'SecretaryClasses',
        component: ClassManagement
      },
      {
        path: 'courses',
        name: 'SecretaryCourses',
        component: CourseManagement
      },
      {
        path: 'scores',
        name: 'SecretaryScores',
        component: ScoreManagement
      },
      {
        path: 'teacher-info',
        name: 'SecretaryTeacherInfo',
        component: TeacherInfo
      },
      {
        path: 'educations',
        name: 'SecretaryEducations',
        component: Educations
      },
      {
        path: 'assessments',
        name: 'SecretaryAssessments',
        component: Assessments
      },
      {
        path: 'entrepreneurships',
        name: 'SecretaryEntrepreneurships',
        component: Entrepreneurships
      },
      {
        path: 'children',
        name: 'SecretaryChildren',
        component: Children
      },
      {
        path: 'honors',
        name: 'SecretaryHonors',
        component: Honors
      },
      {
        path: 'party-documents',
        name: 'SecretaryPartyDocuments',
        component: PartyDocuments
      },
      {
        path: 'import-export',
        name: 'SecretaryImportExport',
        component: ImportExport
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
