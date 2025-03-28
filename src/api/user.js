import request from '@/utils/request'

// 获取用户积分
export function getUserPoints(googleId) {
  return request({
    url: '/api/user/points',
    method: 'get',
    params: { googleId }
  })
} 