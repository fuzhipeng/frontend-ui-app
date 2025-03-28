<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-left">
        <router-link to="/" class="logo">
          <h1 class="app-title">IntroCard AI</h1>
        </router-link>
        <nav class="nav-menu">
          <a href="#features" @click.prevent="scrollToSection('features')">{{ $t('nav.features') }}</a>
          <a href="#faq" @click.prevent="scrollToSection('faq')">{{ $t('nav.faq') }}</a>
          <!-- <router-link to="/pricing">{{ $t('nav.pricing') }}</router-link> -->
        </nav>
      </div>
      <div class="header-right">
        <!-- 积分显示，仅在用户已登录时显示 -->
        <div v-if="userStore.isAuthenticated" class="user-points">
          {{ $t('nav.points', { points: userPoints || 0 }) }}
        </div>
        
        <el-dropdown class="language-dropdown" @command="handleLanguageChange">
          <span class="el-dropdown-link">
            {{ currentLanguageLabel }} <el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="lang in supportedLanguages" :key="lang.value" :command="lang.value">
                {{ lang.icon }} {{ lang.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <!-- 未登录时显示登录按钮 -->
        <template v-if="!userStore.isAuthenticated">
          <el-button type="primary" class="login-btn" @click="showLoginDialog">
            {{ $t('nav.login') }}
          </el-button>
        </template>
        <!-- 已登录时显示用户信息 -->
        <template v-else>
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.userAvatar" />
              <span class="username">{{ userStore.userName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- 底部版权信息 -->
    <footer class="app-footer">
      <div class="footer-content">
        <span class="copyright">© {{ new Date().getFullYear() }} • IntroCard AI  保留所有权利。</span>
        <div class="footer-links">
          <router-link to="/privacy" class="footer-link">隐私政策</router-link>
          <router-link to="/terms" class="footer-link">服务条款</router-link>
        </div>
      </div>
    </footer>
    
    <!-- 登录弹窗组件 -->
    <login-dialog ref="loginDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from './stores/user'
import LoginDialog from './components/LoginDialog.vue'
import { ElMessage } from 'element-plus'
import { Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { getUserPoints } from './api/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginDialog = ref()
const { locale, t } = useI18n()

// 用户积分
const userPoints = ref(0)

// 支持的语言
interface LanguageOption {
  label: string;
  value: string;
  icon: string;
}

const supportedLanguages: LanguageOption[] = [
  { label: '简体中文', value: 'zh-CN', icon: '🇨🇳' },
  { label: 'English', value: 'en-US', icon: '🇺🇸' },
  { label: '日本語', value: 'ja-JP', icon: '🇯🇵' },
  { label: '한국어', value: 'ko-KR', icon: '🇰🇷' },
  { label: 'Français', value: 'fr-FR', icon: '🇫🇷' },
  { label: 'Deutsch', value: 'de-DE', icon: '🇩🇪' },
  { label: 'Español', value: 'es-ES', icon: '🇪🇸' },
  { label: 'Русский', value: 'ru-RU', icon: '🇷🇺' }
];

// 当前语言标签
const currentLanguageLabel = computed(() => {
  const currentLang = supportedLanguages.find(lang => lang.value === locale.value)
  return currentLang ? currentLang.label : '简体中文'
})

// 处理语言切换
function handleLanguageChange(lang: string) {
  if (lang !== locale.value) {
    locale.value = lang
    localStorage.setItem('appLanguage', lang)
    ElMessage.success(t('system.languageChanged', { lang: supportedLanguages.find(l => l.value === lang)?.label }))
  }
}

// 处理滚动到指定部分
function scrollToSection(sectionId: string) {
  // 如果不在首页，先跳转到首页
  if (route.path !== '/') {
    router.push('/').then(() => {
      // 等待路由跳转完成后滚动
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 300)
    })
  } else {
    // 在首页直接滚动
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// 添加调试日志
console.log('App组件初始化')

onMounted(() => {
  // 添加用户状态监听（调试用）
  console.log('当前用户认证状态:', {
    isAuthenticated: userStore.isAuthenticated,
    userName: userStore.userName,
    userAvatar: userStore.userAvatar
  })
  
  // 加载用户积分
  if (userStore.isAuthenticated) {
    try {
      // 调用API获取用户积分，确保ID为字符串类型
      const userId = userStore.user && userStore.user.id ? String(userStore.user.id) : userStore.googleId;
      getUserPoints(userId).then(response => {
        console.log('获取积分成功:', response);
        // 根据API实际返回结构调整
        if (response && response.points !== undefined) {
          userPoints.value = response.points;
        } else if (response && response.data && response.data.points !== undefined) {
          userPoints.value = response.data.points;
        } else {
          console.error('无法从API响应中获取积分数据');
        }
      }).catch(error => {
        console.error('获取用户积分失败:', error);
      });
    } catch (error) {
      console.error('获取用户积分失败:', error);
    }
  }
})

// 显示登录弹窗
const showLoginDialog = () => {
  loginDialog.value?.open()
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  console.log('下拉菜单命令:', command)
  
  switch (command) {
    case 'settings':
      goToSettings()
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = () => {
  userStore.clearUser()
  ElMessage.success('已退出登录')
  router.push('/')
}

// 处理设置按钮点击
const goToSettings = () => {
  console.log('点击设置按钮')
  console.log('用户认证状态:', userStore.isAuthenticated)
  console.log('当前路由:', router.currentRoute.value.path)
  
  if (userStore.isAuthenticated) {
    console.log('用户已登录，正在导航到设置页面')
    router.push('/settings').catch(err => {
      console.error('导航失败:', err)
    })
  } else {
    console.log('用户未登录，显示登录对话框')
    showLoginDialog()
  }
}

// 检查登录状态并显示登录弹窗
const checkLoginAndShowDialog = () => {
  if (!userStore.isAuthenticated) {
    showLoginDialog()
    return false
  }
  return true
}
</script>

<style>
/* 全局样式 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  background-color: #141414;
  color: #ffffff;
}

#app {
  width: 100%;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background-color: #1a1a1a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
}

.app-title {
  margin: 0;
  font-size: 20px;
  color: #ffffff;
}

.nav-menu {
  display: flex;
  margin-left: 20px;
}

.nav-menu a {
  color: #aaaaaa;
  text-decoration: none;
  margin: 0 10px;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #ffffff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-points {
  color: #d4a055;
  font-weight: 500;
  margin-right: 20px;
}

.language-dropdown {
  margin-right: 16px;
}

.el-dropdown-link {
  color: #aaaaaa;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.login-btn {
  margin-left: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.username {
  margin-left: 8px;
  color: #ffffff;
  font-size: 14px;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .user-points {
    display: none;
  }
}

.app-main {
  flex: 1;
  padding-top: 64px; /* 为固定的header留出空间 */
  min-height: calc(100vh - 64px - 61px); /* 减去header和footer的高度 */
}

/* Element Plus 暗色主题覆盖 */
.el-dropdown-menu {
  background-color: #1f1f1f !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 4px 0 !important;
}

.el-dropdown-menu__item {
  color: #ffffff !important;
  padding: 8px 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
}

.el-dropdown-menu__item:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.el-dropdown-menu__item .el-icon {
  font-size: 16px !important;
  margin-right: 4px !important;
}

.el-button {
  border-color: #4a4a4a !important;
}

.el-button--primary {
  background-color: #409eff !important;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 修改底部样式 */
.app-footer {
  background-color: rgba(0, 0, 0, 0.3);
  color: #666;
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #999;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style> 