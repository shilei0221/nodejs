import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/eduservice/teacher/login',
    method: 'get',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/eduservice/teacher/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/eduservice/teacher/logout',
    method: 'post'
  })
}
