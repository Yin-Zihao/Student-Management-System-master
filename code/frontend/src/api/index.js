import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// request interceptor: attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// response interceptor: handle auth errors
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // TODO: redirect to login
      localStorage.removeItem('sm_token')
    }
    return Promise.reject(err)
  }
)

export default api
