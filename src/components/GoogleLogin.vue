<template>
  <div class="google-login">
    <div id="g_id_onload"
         :data-client_id="clientId"
         data-context="signin"
         data-ux_mode="popup"
         data-callback="handleCredentialResponse"
         data-auto_prompt="false">
    </div>

    <div class="g_id_signin"
         data-type="standard"
         data-shape="rectangular"
         data-theme="outline"
         data-text="signin_with"
         data-size="large"
         data-logo_alignment="left">
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// Google OAuth客户端ID - 需要从Google Cloud Console获取
const clientId = '1040336269348-svo55jc3tmk8eedsimqhqrbhk0amnnp7.apps.googleusercontent.com'

// 处理Google登录回调
window.handleCredentialResponse = async (response) => {
  try {
    // 获取ID Token
    const idToken = response.credential
    
    // 这里可以发送token到后端验证
    // const validationResponse = await validateWithBackend(idToken)
    
    // 解析JWT获取用户信息
    const payload = decodeJwtPayload(idToken)
    
    // 存储用户信息
    userStore.setUser({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    })
    
    // 登录成功后跳转
    router.push('/dashboard')
    
  } catch (error) {
    console.error('Google登录失败:', error)
  }
}

// 解析JWT payload
function decodeJwtPayload(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}

onMounted(() => {
  // 动态加载Google Sign-In脚本
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
})
</script>

<style scoped>
.google-login {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
</style> 