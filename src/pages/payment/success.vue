<template>
  <div class="payment-success">
    <div class="success-container">
      <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
      <h1>支付成功！</h1>
      <p>感谢您的订购。您的订单已成功处理。</p>
      
      <div class="order-details" v-if="orderDetails">
        <h3>订单详情</h3>
        <div class="detail-item">
          <span class="label">订单编号:</span>
          <span class="value">{{ orderDetails.order_id }}</span>
        </div>
        <div class="detail-item">
          <span class="label">商品:</span>
          <span class="value">{{ getProductName(orderDetails.product_id) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">金额:</span>
          <span class="value">{{ orderDetails.amount }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态:</span>
          <span class="value">{{ getStatusText(orderDetails.status) }}</span>
        </div>
      </div>
      
      <div v-else class="loading-message">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div class="actions">
        <el-button type="primary" @click="goToDashboard">进入控制面板</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { verifyPaymentStatus } from '../../api/payment'

const route = useRoute()
const router = useRouter()
const orderDetails = ref(null)
const isLoading = ref(true)

// 产品名称映射，实际项目中可能来自后端或配置
const productMap = {
  'prod_basic': '基础套餐',
  'prod_pro': '专业套餐',
  'prod_enterprise': '企业套餐'
}

function getProductName(productId) {
  return productMap[productId] || productId
}

function getStatusText(status) {
  const statusMap = {
    'succeeded': '支付成功',
    'pending': '处理中',
    'failed': '支付失败',
    'canceled': '已取消'
  }
  return statusMap[status] || status
}

onMounted(async () => {
  // Creem回调可能包含这些参数
  const checkoutId = route.query.checkout_id
  const orderId = route.query.order_id
  const signature = route.query.signature
  
  if (checkoutId && orderId && signature) {
    try {
      const result = await verifyPaymentStatus({
        checkout_id: checkoutId,
        order_id: orderId,
        signature: signature
      })
      
      orderDetails.value = result
    } catch (error) {
      console.error('验证支付状态失败:', error)
      ElMessage.warning('无法获取订单详情')
    } finally {
      isLoading.value = false
    }
  } else {
    ElMessage.warning('缺少必要的支付参数')
    isLoading.value = false
  }
})

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<style scoped>
.payment-success {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 20px;
}

.success-container {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.success-icon {
  font-size: 80px;
  color: #52c41a;
  margin-bottom: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 16px;
}

p {
  font-size: 1.1rem;
  color: #aaaaaa;
  margin-bottom: 30px;
}

.order-details {
  background-color: #222222;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
}

.order-details h3 {
  margin-bottom: 16px;
  font-size: 1.2rem;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
}

.label {
  flex: 0 0 120px;
  color: #aaaaaa;
}

.value {
  font-weight: 500;
}

.loading-message {
  margin: 20px 0;
  padding: 20px;
  background-color: #222222;
  border-radius: 8px;
}

.actions {
  margin-top: 30px;
}
</style> 