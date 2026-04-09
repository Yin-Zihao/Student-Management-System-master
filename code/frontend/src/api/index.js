import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export const getUserInfo = () => {
  return request({
    url: '/users/info',
    method: 'get'
  })
}

export const getUserList = (params) => {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export const addUser = (data) => {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export const updateUser = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

export const deleteUser = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export const getClassList = () => {
  return request({
    url: '/classes',
    method: 'get'
  })
}

export const addClass = (data) => {
  return request({
    url: '/classes',
    method: 'post',
    data
  })
}

export const updateClass = (id, data) => {
  return request({
    url: `/classes/${id}`,
    method: 'put',
    data
  })
}

export const deleteClass = (id) => {
  return request({
    url: `/classes/${id}`,
    method: 'delete'
  })
}

export const getCourseList = (params) => {
  return request({
    url: '/courses',
    method: 'get',
    params
  })
}

export const addCourse = (data) => {
  return request({
    url: '/courses',
    method: 'post',
    data
  })
}

export const updateCourse = (id, data) => {
  return request({
    url: `/courses/${id}`,
    method: 'put',
    data
  })
}

export const deleteCourse = (id) => {
  return request({
    url: `/courses/${id}`,
    method: 'delete'
  })
}

export const getScoreList = (params) => {
  return request({
    url: '/scores',
    method: 'get',
    params
  })
}

export const getMyScores = (params) => {
  return request({
    url: '/scores/my',
    method: 'get',
    params
  })
}

export const addScore = (data) => {
  return request({
    url: '/scores',
    method: 'post',
    data
  })
}

export const updateScore = (id, data) => {
  return request({
    url: `/scores/${id}`,
    method: 'put',
    data
  })
}

export const deleteScore = (id) => {
  return request({
    url: `/scores/${id}`,
    method: 'delete'
  })
}
