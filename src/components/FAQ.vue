<template>
  <div class="faq-section" id="faq">
    <div class="faq-tag">FAQ</div>
    <h2 class="faq-title">{{ $t('faq.title') }}</h2>
    <p class="faq-subtitle">
      {{ $t('faq.subtitle') }}
      <a :href="'mailto:' + $t('faq.emailName') + '@' + $t('faq.emailDomain')" class="faq-email">
        {{ $t('faq.emailName') + '@' + $t('faq.emailDomain') }}
      </a>
    </p>
    
    <div class="faq-list">
      <div v-for="(qa, index) in faqList" :key="index" class="faq-item">
        <div class="faq-question">
          <span class="question-number">{{ index + 1 }}</span>
          <h3>{{ qa.q }}</h3>
        </div>
        <p class="faq-answer">{{ qa.a }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, tm } = useI18n()

const faqList = computed(() => {
  try {
    // 添加调试日志
    console.log('正在获取FAQ问题列表...');
    
    // 使用tm()而不是t()来获取数组/对象类型的翻译
    const questions = tm('faq.questions')
    console.log('获取到的FAQ数据:', questions);
    
    if (!questions) {
      console.warn('FAQ questions is null or undefined')
      return []
    }
    
    // 确保questions是数组
    if (!Array.isArray(questions)) {
      console.warn('Converting questions to array')
      return Object.values(questions || {})
    }
    
    const filteredQuestions = questions.filter(q => {
      if (!q || typeof q !== 'object') {
        console.warn('Invalid question object:', q)
        return false
      }
      if (!q.q || !q.a || typeof q.q !== 'string' || typeof q.a !== 'string') {
        console.warn('Question missing required fields:', q)
        return false
      }
      return true
    })
    
    console.log('处理后的FAQ列表:', filteredQuestions);
    return filteredQuestions
    
  } catch (error) {
    console.error('Failed to load FAQ questions:', error)
    return []
  }
})
</script>

<style scoped>
.faq-section {
  padding: 80px 20px;
  background-color: #1a1a1a;
  color: #fff;
  max-width: 1200px;
  margin: 0 auto;
}

.faq-tag {
  display: block;
  background-color: #c4804e;
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  margin: 0 auto 1rem;
  width: fit-content;
}

.faq-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
}

.faq-subtitle {
  color: #999;
  margin-bottom: 3rem;
  text-align: center;
}

.faq-list {
  display: grid;
  gap: 2rem;
}

.faq-item {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.faq-item:hover {
  background: #333;
  transform: translateY(-2px);
}

.faq-question {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.question-number {
  background: #c4804e;
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
}

.faq-question h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.faq-answer {
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0;
  padding-left: calc(28px + 1rem);
}

.faq-email {
  color: #c4804e;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.3s;
}

.faq-email:hover {
  color: #d99b69;
  text-decoration: underline;
}

@media (min-width: 768px) {
  .faq-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 