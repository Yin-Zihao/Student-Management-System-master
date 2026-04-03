import axios from 'axios'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// request interceptor: attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
}, error => Promise.reject(error))

// response interceptor: handle auth errors and show global messages
api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response ? err.response.status : null
    if (status === 401) {
      // token invalid or expired
      localStorage.removeItem('sm_token')
      localStorage.removeItem('sm_role')
      ElMessage.error('认证已过期，请重新登录')
      // redirect to login (SPA-safe)
      try {
        // try router push without importing router to avoid circular deps
        window.location.href = '/login'
      } catch (e) {
        window.location.href = '/login'
      }
    } else {
      const msg = err.response?.data?.message || err.message || '请求出错'
      ElMessage.error(msg)
    }
    return Promise.reject(err)
  }
)

export default api
