<template>
  <div class="subscription-manager">
    <div v-if="isLoading" class="loading-state">
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="error" class="error-state">
      <el-alert
        title="无法加载订阅信息"
        type="error"
        description="获取您的订阅信息时出现问题，请稍后再试。"
        show-icon
        :closable="false"
      />
    </div>
    
    <div v-else-if="!hasSubscription" class="no-subscription">
      <el-empty description="您目前没有活跃订阅" />
      <div class="action-buttons">
        <el-button type="primary" @click="goToPricing">查看套餐</el-button>
      </div>
    </div>
    
    <div v-else class="active-subscription">
      <div class="subscription-header">
        <el-tag :type="getStatusType" size="large">{{ getStatusText }}</el-tag>
        <h3 class="subscription-plan">{{ getSubscriptionPlanName }}</h3>
      </div>
      
      <div class="subscription-details" v-if="subscription">
        <div class="detail-row">
          <div class="detail-label">订阅ID:</div>
          <div class="detail-value">{{ subscription.subscriptionId || subscription.id }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">开始日期:</div>
          <div class="detail-value">{{ formatDate(subscription.startTime || subscription.startDate) }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">结束日期:</div>
          <div class="detail-value">{{ formatDate(subscription.endTime || subscription.nextBillingDate) }}</div>
        </div>
        
        <div class="detail-row" v-if="subscription.amount">
          <div class="detail-label">金额:</div>
          <div class="detail-value">{{ formatPrice(subscription.amount, subscription.currency) }}</div>
        </div>
        
        <div class="detail-row">
          <div class="detail-label">状态:</div>
          <div class="detail-value">{{ getStatusText }}</div>
        </div>
        
        <div class="detail-row" v-if="subscription.interval">
          <div class="detail-label">账单周期:</div>
          <div class="detail-value">{{ getBillingCycleText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// @ts-ignore
import { getUserSubscription, cancelSubscription as apiCancelSubscription } from '@/api/payment'

interface Subscription {
  id?: string
  subscriptionId?: string
  status?: 'active' | 'canceled' | 'past_due'
  planName?: string
  startDate?: string
  startTime?: string
  nextBillingDate?: string
  endTime?: string
  amount?: number
  currency?: string
  interval?: 'month' | 'year'
  product_id?: string
}

const router = useRouter()
const subscription = ref<Subscription | null>(null)
const isLoading = ref(true)
const isRefreshing = ref(false)
const isCancelling = ref(false)
const error = ref(false)

const getSubscriptionPlanName = computed(() => {
  if (!subscription.value) return '未知套餐';
  
  // 优先使用planName字段
  if (subscription.value.planName) return subscription.value.planName;
  
  // 根据产品ID映射套餐名称
  const productId = subscription.value.product_id;
  if (productId === 'prod_2JByiTnhcB99sEdTUsbvDQ') return '专业月度订阅';
  if (productId === 'sub_6pC2lNB6joCRQIZ1aMrTpi') return '基础月度订阅';
  
  // 如果没有匹配到产品ID或planName为"Monthly"，显示"月度订阅"
  if (subscription.value.planName === 'Monthly') return '月度订阅';
  
  return subscription.value.planName || '高级套餐';
});

const getStatusType = computed(() => {
  if (!subscription.value) return 'info';
  
  const status = subscription.value.status;
  
  switch (status) {
    case 'active': return 'success';
    case 'canceled': return 'danger';
    case 'past_due': return 'warning';
    default: return 'info';
  }
});

const getStatusText = computed(() => {
  if (!subscription.value) return '未知';
  
  const status = subscription.value.status;
  
  switch (status) {
    case 'active': return '活跃';
    case 'canceled': return '已取消';
    case 'past_due': return '逾期';
    default: return '未知';
  }
});

const getBillingCycleText = computed(() => {
  if (!subscription.value) return '未知'
  
  switch (subscription.value.interval) {
    case 'month': return '月付'
    case 'year': return '年付'
    default: return '未知'
  }
})

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatPrice(amount: number, currency: string | undefined): string {
  if (!amount) return '未知'
  
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency || 'USD'
  })
  
  return formatter.format(amount / 100) // 假设金额以分为单位存储
}

async function loadSubscription() {
  isLoading.value = true
  error.value = false
  
  try {
    const response = await getUserSubscription()
    console.log('订阅API返回数据:', response)
    
    // 处理多层嵌套的数据结构
    if (response) {
      let subscriptionData = null
      
      // 检查各种可能的数据结构
      if (response.data && response.data.subscriptionId) {
        // 直接在response.data中
        subscriptionData = response.data
      } else if (response.data && response.data.data && response.data.data.subscriptionId) {
        // 嵌套在response.data.data中
        subscriptionData = response.data.data
      } else if (response.subscriptionId) {
        // 直接在response中
        subscriptionData = response
      } else if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        // 遍历response.data查找可能的订阅数据
        const dataFields = Object.keys(response.data)
        for (const field of dataFields) {
          const value = response.data[field]
          if (typeof value === 'object' && value && (value.subscriptionId || value.planName)) {
            subscriptionData = value
            break
          }
        }
      }
      
      // 如果找到订阅数据
      if (subscriptionData) {
        console.log('找到订阅数据:', subscriptionData)
        subscription.value = subscriptionData
      } else {
        console.error('未找到有效的订阅数据:', response)
        error.value = true
      }
    } else {
      console.error('API返回为空')
      error.value = true
    }
  } catch (err) {
    console.error('加载订阅信息失败:', err)
    error.value = true
  } finally {
    isLoading.value = false
  }
}

async function refreshSubscription() {
  isRefreshing.value = true
  error.value = false
  
  try {
    const response = await getUserSubscription()
    subscription.value = response.data
    ElMessage.success('订阅信息已更新')
  } catch (err) {
    console.error('刷新订阅信息失败:', err)
    error.value = true
    ElMessage.error('刷新订阅信息失败')
  } finally {
    isRefreshing.value = false
  }
}

async function cancelSubscription() {
  isCancelling.value = true
  
  try {
    await apiCancelSubscription()
    ElMessage.success('订阅已成功取消')
    
    // 更新本地数据
    if (subscription.value) {
      subscription.value.status = 'canceled'
    }
  } catch (err) {
    console.error('取消订阅失败:', err)
    ElMessage.error('取消订阅失败，请稍后再试')
  } finally {
    isCancelling.value = false
  }
}

function goToPricing() {
  router.push('/pricing')
}

const hasSubscription = computed(() => {
  // 如果subscription为null，没有订阅
  if (!subscription.value) return false;
  
  // 宽松地判断是否有有效的订阅信息
  const sub = subscription.value;
  
  // 只要有订阅ID或计划名称和状态，就认为有订阅
  if (sub.subscriptionId || sub.id) return true;
  
  // 如果有计划名称和状态
  if (sub.planName && sub.status) return true;
  
  // 如果有startTime，也认为有订阅
  if (sub.startTime) return true;
  
  // 其他情况认为无订阅
  return false;
});

onMounted(() => {
  loadSubscription()
})
</script>

<style scoped>
.subscription-manager {
  background-color: #252525;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.loading-state,
.error-state,
.no-subscription {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.active-subscription {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subscription-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.subscription-plan {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.subscription-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  gap: 10px;
}

.detail-label {
  font-weight: 500;
  min-width: 120px;
  color: rgba(255, 255, 255, 0.7);
}

.detail-value {
  color: #ffffff;
}

.action-buttons {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .subscription-manager {
    padding: 16px;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-label {
    min-width: auto;
  }
}
</style> 