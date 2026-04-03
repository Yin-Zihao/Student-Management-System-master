export function getToken() {
  return localStorage.getItem('sm_token')
}
export function getRole() {
  return localStorage.getItem('sm_role') || null
}
export function getUsername() {
  return localStorage.getItem('sm_username') || '示例用户'
}
export function loginMock({ username, role }) {
  localStorage.setItem('sm_token', 'mock-token')
  localStorage.setItem('sm_role', role)
  localStorage.setItem('sm_username', username)
}
export function logout() {
  localStorage.removeItem('sm_token')
  localStorage.removeItem('sm_role')
  localStorage.removeItem('sm_username')
}
