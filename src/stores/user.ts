import { defineStore } from 'pinia'

// 用户信息接口
interface User {
  id: string
  name: string
  email: string
  picture: string
}

// 用户状态接口
interface UserState {
  user: User | null
  token: string | null
}

// 从localStorage获取存储的用户信息
const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
}

// 从localStorage获取存储的token
const getStoredToken = (): string | null => {
  return localStorage.getItem('token')
}

// 定义用户store
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: getStoredUser(),
    token: getStoredToken()
  }),
  
  getters: {
    // 获取用户头像
    userAvatar: (state) => state.user?.picture || '',
    
    // 获取用户名称
    userName: (state) => state.user?.name || '',
    
    // 获取用户邮箱
    userEmail: (state) => state.user?.email || '',
    
    // 判断是否已登录
    isAuthenticated: (state) => !!state.user && !!state.token
  },
  
  actions: {
    // 设置用户信息
    setUser(user: User | null) {
      this.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    
    // 设置token
    setToken(token: string | null) {
      this.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    
    // 清除用户信息
    clearUser() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    
    // 登出
    async logout() {
      this.clearUser()
    }
  }
}) 