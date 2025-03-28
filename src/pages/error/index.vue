<template>
  <div class="error-page">
    <h1>{{ $t('error.title') }}</h1>
    <p>{{ errorMessage || $t('error.defaultMessage') }}</p>
    <div class="error-actions">
      <el-button type="primary" @click="goHome">{{ $t('error.backHome') }}</el-button>
      <el-button @click="refresh">{{ $t('error.refresh') }}</el-button>
    </div>
    <div class="error-details" v-if="showDetails">
      <pre>{{ errorDetails }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 错误信息
const errorMessage = ref('')
const errorDetails = ref('')
const showDetails = ref(false)

// 初始化错误信息
onMounted(() => {
  // 从路由参数中获取错误信息
  if (route.query.message) {
    errorMessage.value = decodeURIComponent(route.query.message)
  }

  // 从路由参数中获取错误详情
  if (route.query.details) {
    errorDetails.value = decodeURIComponent(route.query.details)
    showDetails.value = true
  }

  // 将错误记录到控制台
  console.error('显示错误页面:', {
    message: errorMessage.value,
    details: errorDetails.value,
    path: route.fullPath
  })
})

// 返回首页
const goHome = () => {
  router.push('/')
}

// 刷新页面
const refresh = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  color: #f3f4f6;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #e0e0e0;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #a0a0a0;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.error-details {
  margin-top: 2rem;
  text-align: left;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #2d2d2d;
  overflow: auto;
}

pre {
  white-space: pre-wrap;
  font-family: monospace;
  color: #e83838;
}
</style> 