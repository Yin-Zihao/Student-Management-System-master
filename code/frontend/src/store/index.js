import { reactive } from 'vue'

const state = reactive({
  token: localStorage.getItem('token') || '',
  userInfo: (() => {
    try {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr === 'undefined' || userInfoStr === 'null' || !userInfoStr) {
        return null
      }
      return JSON.parse(userInfoStr)
    } catch (e) {
      return null
    }
  })()
})

const setToken = (token) => {
  state.token = token
  localStorage.setItem('token', token)
}

const setUserInfo = (userInfo) => {
  state.userInfo = userInfo
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

const logout = () => {
  state.token = ''
  state.userInfo = null
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

export default {
  state,
  setToken,
  setUserInfo,
  logout
}
