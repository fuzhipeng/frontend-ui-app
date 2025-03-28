<template>
  <div class="settings-page">
    <h1 class="page-title">设置</h1>
    
    <div class="settings-content">
      <div class="settings-layout">
        <!-- 左侧个人信息 -->
        <div class="settings-column">
          <div class="settings-section">
            <h2 class="section-title">
              <el-icon><User /></el-icon>
              个人信息
            </h2>
            <div class="user-info">
              <el-avatar :size="64" :src="userStore.userAvatar" />
              <div class="user-details">
                <div class="user-name">{{ userStore.userName || '未知用户' }}</div>
                <div class="user-email">{{ userStore.userEmail || 'user@example.com' }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧套餐信息 -->
        <div class="settings-column">
          <div class="settings-section plan-section">
            <h2 class="section-title">
              <el-icon><Ticket /></el-icon>
              套餐与账单
            </h2>
            
            <SubscriptionManager />
            
            <!-- 用户付费套餐内容已经在SubscriptionManager中显示，无需重复展示 -->
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user'
import { User, Ticket, Check, Star, DataAnalysis, Picture, Sort, Lock, ArrowRight } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CreemCheckout from '@/components/CreemCheckout.vue'
import SubscriptionManager from '@/components/SubscriptionManager.vue'

const router = useRouter()
const userStore = useUserStore()

function trackCheckoutStarted(plan: string) {
  console.log(`用户开始${plan}套餐的结账流程`)
}

onMounted(() => {
  console.log('Settings组件已挂载')
  console.log('当前用户状态:', {
    isAuthenticated: userStore.isAuthenticated,
    userName: userStore.userName,
    userAvatar: userStore.userAvatar
  })
  console.log('当前路由:', router.currentRoute.value.path)
})
</script>

<style scoped>
.settings-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #1a1a1a;
  min-height: calc(100vh - 64px);
  
  @media (max-width: 768px) {
    padding: 10px;
  }
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #ffffff;
}

.settings-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.settings-column {
  flex: 1;
  min-width: 300px;
}

.settings-section {
  background: #222222;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .el-icon {
  font-size: 18px;
  color: #d4a055;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #2a2a2a;
  border-radius: 8px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name {
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}

.user-email {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.plan-header,
.plan-features,
.feature-item,
.upgrade-title,
.upgrade-features,
.feature-content,
.feature-name,
.feature-desc,
.upgrade-pricing,
.price,
.billing-cycle {
  display: none;
}

@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
  }
  
  .settings-section {
    padding: 16px;
  }
  
  .upgrade-plan {
    padding: 16px;
  }
}
</style> 