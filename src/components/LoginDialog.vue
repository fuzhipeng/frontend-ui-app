<template>
  <el-dialog
    v-model="visible"
    :title="$t('login.title')"
    width="400px"
    :close-on-click-modal="false"
    class="login-dialog dark-theme"
  >
    <div class="login-content">
      <h3 class="subtitle">{{ $t('login.subtitle') }}</h3>
      
      <div v-if="!isScriptLoaded" class="loading-state">
        {{ $t('system.loading') }}
      </div>
      
      <div v-else>
        <div id="google-signin-button" class="google-button-container"></div>
        
        <button 
          v-if="!googleButtonRendered"
          class="google-login-btn"
          @click="handleManualGoogleLogin"
        >
          <img :src="googleIcon" alt="Google" class="google-icon">
          {{ $t('login.googleLogin') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n()
const visible = ref(false)
const isScriptLoaded = ref(false)
const googleButtonRendered = ref(false)

// Google OAuth客户端ID
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Google图标的base64编码
const googleIcon = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0VBNDMzNSIgZD0iTTI0IDkuNWMzLjU0IDAgNi43MSAxLjIyIDkuMjEgMy42bDYuODUtNi44NUMzNS45IDIuMzggMzAuNDcgMCAyNCAwIDE0LjYyIDAgNi41MSA1LjM4IDIuNTYgMTMuMjJsNy45OCA2LjE5QzEyLjQzIDEzLjcyIDE3Ljc0IDkuNSAyNCA5LjV6Ii8+PHBhdGggZmlsbD0iIzQyODVGNCIgZD0iTTQ2Ljk4IDI0LjU1YzAtMS41Ny0uMTUtMy4wOS0uMzgtNC41NUgyNHY5LjAyaDEyLjk0Yy0uNTggMi45Ni0yLjI2IDUuNDgtNC43OCA3LjE4bDcuNzMgNmM0LjUxLTQuMTggNy4wOS0xMC4zNiA3LjA5LTE3LjY1eiIvPjxwYXRoIGZpbGw9IiNGQkJDMDUiIGQ9Ik0xMC41MyAyOC41OWMtLjQ4LTEuNDUtLjc2LTIuOTktLjc2LTQuNTlzLjI3LTMuMTQuNzYtNC41OWwtNy45OC02LjE5Qy45MiAxNi40NiAwIDIwLjEyIDAgMjRjMCAzLjg4LjkyIDcuNTQgMi41NiAxMC43OGw3Ljk3LTYuMTl6Ii8+PHBhdGggZmlsbD0iIzM0QTg1MyIgZD0iTTI0IDQ4YzYuNDggMCAxMS45My0yLjEzIDE1Ljg5LTUuODFsLTcuNzMtNmMtMi4xNSAxLjQ5LTQuOTIgMi4zLTguMTYgMi4zLTYuMjYgMC0xMS41Ny00LjIyLTEzLjQ3LTkuOTFsLTcuOTggNi4xOUM2LjUxIDQyLjYyIDE0LjYyIDQ4IDI0IDQ4eiIvPjwvc3ZnPg=='

// 声明全局类型
declare global {
  interface Window {
    google?: any
  }
}

// 处理Google登录
const handleGoogleLogin = () => {
  if (!window.google) {
    ElMessage.error(t('login.error'))
    return
  }

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin'
    })

    // 使用显式渲染按钮，而不是依赖prompt
    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { 
        type: 'standard',
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 280
      }
    )
  } catch (error) {
    console.error('初始化Google登录失败:', error)
    ElMessage.error(t('login.initError'))
  }
}

// 处理Google登录回调
const handleGoogleCallback = async (response: any) => {
  try {
    // 获取ID Token
    const idToken = response.credential
    if (!idToken) {
      ElMessage.error('无效的Google登录凭证')
      return
    }
    
    try {
      // 发送ID Token到后端验证，使用完整URL
      const apiResponse = await axios.post('https://docsmart-backend.zeabur.app/api/auth/google', {
        idToken: idToken
      })
      
      if (apiResponse.data.success) {
        // 存储用户信息
        const userData = {
          id: apiResponse.data.user.id,
          email: apiResponse.data.user.email,
          name: apiResponse.data.user.name,
          picture: apiResponse.data.user.picture
        }
        
        // 存储用户信息和token
        if (apiResponse.data.token) {
          await userStore.setToken(apiResponse.data.token)
        } else {
          // 如果后端没有返回token，使用Google的ID token
          await userStore.setToken(idToken)
        }
        await userStore.setUser(userData)
        
        // 确认登录状态
        if (userStore.isAuthenticated) {
          // 关闭登录弹窗
          close()
          
          // 显示成功消息
          ElMessage.success(t('login.success'))
          
          // 跳转到设置页面
          router.push('/settings')
        } else {
          throw new Error(t('login.statusError'))
        }
      } else {
        throw new Error(apiResponse.data.message || t('login.error'))
      }
    } catch (apiError) {
      // 如果后端API调用失败，尝试直接使用Google信息
      // 解析JWT获取用户信息
      const payload = decodeJwtPayload(idToken)
      
      // 直接使用Google返回的用户信息登录
      const userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
      
      // 存储用户信息和token
      await userStore.setToken(idToken)
      await userStore.setUser(userData)
      
      // 确认登录状态
      if (userStore.isAuthenticated) {
        // 关闭登录弹窗
        close()
        
        // 显示成功消息
        ElMessage.success(t('login.success'))
        
        // 跳转到设置页面
        router.push('/settings')
      } else {
        throw new Error(t('login.statusError'))
      }
    }
  } catch (error) {
    console.error('登录错误:', error)
    ElMessage.error(t('login.error'))
  }
}

// 解析JWT payload
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return {
      sub: 'unknown_id',
      email: 'unknown@example.com',
      name: t('login.testUser'),
      picture: 'https://lh3.googleusercontent.com/a/default-user'
    }
  }
}

// 手动触发Google登录
const handleManualGoogleLogin = () => {
  try {
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.error('Google登录提示未显示:', notification.getNotDisplayedReason())
        ElMessage.warning('尝试直接打开Google登录页面')
        // 尝试直接打开OAuth授权页面
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=token&scope=email%20profile&redirect_uri=${encodeURIComponent(window.location.origin)}`
      }
    })
  } catch (error) {
    console.error('手动触发Google登录失败:', error)
    ElMessage.error(t('login.error'))
  }
}

onMounted(() => {
  // 动态加载Google Sign-In脚本
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => {
    console.log('Google Sign-In script loaded')
    isScriptLoaded.value = true
    // 脚本加载完成后初始化Google登录
    setTimeout(() => {
      handleGoogleLogin()
      // 检查按钮是否渲染成功
      const googleButton = document.getElementById('google-signin-button')
      if (googleButton && googleButton.children.length > 0) {
        googleButtonRendered.value = true
      }
    }, 500)
  }
  script.onerror = (error) => {
    console.error('Failed to load Google Sign-In script:', error)
    ElMessage.error(t('login.scriptError'))
  }
  document.head.appendChild(script)
})

// 打开弹窗方法
const open = () => {
  visible.value = true
}

// 关闭弹窗方法
const close = () => {
  visible.value = false
}

// 暴露方法供父组件调用
defineExpose({
  open,
  close
})
</script>

<style>
/* 增加全局样式以覆盖element-plus的默认样式 */
.dark-theme.el-dialog {
  background: #141414 !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  margin-top: 15vh !important;
}

.dark-theme .el-dialog__header {
  background: #141414 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 16px;
  margin-right: 0;
}

.dark-theme .el-dialog__title {
  color: #ffffff !important;
}

.dark-theme .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff !important;
}

.dark-theme .el-dialog__body {
  background: #141414 !important;
  color: #ffffff !important;
}

.login-content {
  padding: 20px;
  text-align: center;
}

.subtitle {
  margin-bottom: 24px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.google-login-btn:hover {
  background: #f5f5f5;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}

.loading-state {
  padding: 20px;
  color: #ffffff;
}

.google-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
</style> 