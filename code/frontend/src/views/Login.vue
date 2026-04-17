<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- 登录框 -->
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <el-icon :size="50"><UserFilled /></el-icon>
        </div>
        <h1 class="title">学管系统</h1>
        <p class="subtitle">学院数据管理平台</p>
      </div>

      <el-form 
        ref="loginFormRef"
        :model="loginForm" 
        :rules="loginRules" 
        class="login-form"
        size="large"
      >
        <el-form-item prop="role">
          <el-select 
            v-model="loginForm.role" 
            placeholder="请选择登录身份"
            clearable
            style="width: 100%"
          >
            <el-option label="管理员" value="admin" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="人事秘书" value="secretary" />
          </el-select>
        </el-form-item>

        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p>© 2026 学管系统。All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api'
import store from '@/store'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: localStorage.getItem('loginUsername') || '',
  password: '',
  role: localStorage.getItem('loginRole') || ''
})

const loginRules = {
  role: [
    { required: true, message: '请选择登录身份', trigger: 'change' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  // 保存登录信息到localStorage，防止登录失败后丢失
  localStorage.setItem('loginUsername', loginForm.username)
  localStorage.setItem('loginRole', loginForm.role)
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      
      try {
        const response = await login(loginForm)
        store.setToken(response.data.token)
        store.setUserInfo(response.data.userInfo)
        loading.value = false
        ElMessage.success('登录成功！')
        
        // 登录成功后清除临时存储的登录信息
        localStorage.removeItem('loginUsername')
        localStorage.removeItem('loginRole')
        
        router.push('/dashboard')
        
      } catch (error) {
        loading.value = false
        ElMessage.error('登录失败，请检查用户名和密码')
      }
    } else {
      ElMessage.warning('请填写完整的登录信息')
    }
  })
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 背景装饰 */
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #5f27cd, #00d2d3);
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #ff9ff3, #54a0ff);
  top: 50%;
  right: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 登录框 */
.login-box {
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  margin-bottom: 15px;
  color: white;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 45px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  color: #999;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }
  
  .shape-1 {
    width: 200px;
    height: 200px;
  }
  
  .shape-2 {
    width: 150px;
    height: 150px;
  }
  
  .shape-3 {
    width: 100px;
    height: 100px;
  }
}
</style>
