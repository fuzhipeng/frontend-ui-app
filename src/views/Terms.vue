<template>
  <div class="terms-page">
    <div class="content-container">
      <h1>{{ $t('terms.title') }}</h1>
      <p class="last-updated">{{ $t('terms.lastUpdated') }}</p>
      
      <div class="content">
        <template v-if="isLoading">
          <div class="loading-message">
            <p>{{ $t('system.loading') }}</p>
          </div>
        </template>
        <template v-else-if="hasError">
          <div class="error-message">
            <p>{{ errorMessage }}</p>
            <p v-if="debugInfo" class="debug-info">{{ debugInfo }}</p>
          </div>
        </template>
        <template v-else>
          <section v-for="(section, key) in termsData" :key="key">
            <h2>{{ section.title }}</h2>
            <p>{{ section.content }}</p>
            <ul v-if="section.items">
              <li v-for="(item, index) in section.items" :key="index">{{ item }}</li>
            </ul>
          </section>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Section {
  title: string
  content: string
  items?: string[]
}

interface TermsSections {
  [key: string]: Section
}

const { t, locale, te } = useI18n()

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const debugInfo = ref('')
const termsData = ref<TermsSections>({})

const loadTermsContent = async () => {
  console.log('开始加载服务条款内容')
  console.log('当前语言:', locale.value)
  
  try {
    // 等待一小段时间，确保i18n实例已经准备就绪
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 定义所有section的key
    const sectionKeys = [
      'acceptance',
      'description',
      'conditions',
      'intellectual',
      'changes',
      'disclaimer',
      'liability',
      'termsChanges',
      'termination',
      'contact'
    ]

    // 逐个获取每个section的内容
    const sections: TermsSections = {}
    for (const key of sectionKeys) {
      const titleKey = `terms.sections.${key}.title`
      const contentKey = `terms.sections.${key}.content`
      const itemsKey = `terms.sections.${key}.items`

      // 检查必需的翻译键是否存在
      if (!te(titleKey) || !te(contentKey)) {
        console.error(`缺少必需的翻译键: ${titleKey} 或 ${contentKey}`)
        continue
      }

      sections[key] = {
        title: t(titleKey),
        content: t(contentKey)
      }

      // 如果有items，添加到section中
      if (te(itemsKey)) {
        const items = t(itemsKey)
        sections[key].items = Array.isArray(items) ? items : [items]
      }
    }

    // 检查是否成功获取了任何section
    if (Object.keys(sections).length === 0) {
      throw new Error('未能加载任何服务条款内容')
    }

    termsData.value = sections
    hasError.value = false
    errorMessage.value = ''
    debugInfo.value = ''
  } catch (error: any) {
    console.error('加载terms内容时出错:', error)
    hasError.value = true
    errorMessage.value = '无法加载内容，请稍后重试'
    debugInfo.value = `当前语言: ${locale.value}\n错误: ${error.message}`
  } finally {
    isLoading.value = false
  }
}

// 监听语言变化
watch(locale, () => {
  console.log('语言已变更为:', locale.value)
  isLoading.value = true
  loadTermsContent()
})

onMounted(() => {
  console.log('Terms组件已挂载')
  loadTermsContent()
})
</script>

<style scoped>
.terms-page {
  padding: 40px 20px;
  background-color: #1a1a1a;
  min-height: 100vh;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #2a2a2a;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.last-updated {
  color: #999;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

h2 {
  color: #fff;
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

section {
  margin-bottom: 2rem;
}

p {
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 1rem;
}

ul {
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

.loading-message {
  text-align: center;
  padding: 20px;
  color: #e0e0e0;
}

.error-message {
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px 0;
}

.error-message p {
  color: #ff6b6b;
  margin: 0;
}

.debug-info {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #999;
  white-space: pre-wrap;
  word-break: break-all;
}

@media (max-width: 768px) {
  .content-container {
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.3rem;
  }
}
</style> 