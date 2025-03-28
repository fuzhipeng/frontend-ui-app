<template>
  <div class="payment-cancel">
    <div class="cancel-container">
      <el-icon class="cancel-icon"><CircleCloseFilled /></el-icon>
      <h1>支付已取消</h1>
      <p>您已取消本次支付。您的账户未被扣款。</p>
      
      <div v-if="checkoutId" class="cancel-details">
        <p>结账会话: {{ checkoutId }}</p>
      </div>
      
      <div class="actions">
        <el-button @click="goToHome">返回首页</el-button>
        <el-button type="primary" @click="goToPricing">查看订阅计划</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CircleCloseFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const checkoutId = ref(null)

onMounted(() => {
  // 获取URL参数
  if (route.query.checkout_id) {
    checkoutId.value = route.query.checkout_id
  }
})

function goToHome() {
  router.push('/')
}

function goToPricing() {
  router.push('/pricing')
}
</script>

<style scoped>
.payment-cancel {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1a1a1a;
  color: #ffffff;
  padding: 20px;
}

.cancel-container {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.cancel-icon {
  font-size: 80px;
  color: #ff4d4f;
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

.cancel-details {
  background-color: #222222;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.cancel-details p {
  margin: 0;
  font-size: 0.9rem;
  color: #888888;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style> 