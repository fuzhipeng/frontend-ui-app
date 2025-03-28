<template>
  <div class="testimonials-section">
    <div class="testimonials-header">
      <h2 class="title">{{ $t('testimonials.title') }}</h2>
      <p class="subtitle">{{ $t('testimonials.subtitle') }}</p>
    </div>
    
    <div class="testimonials-container">
      <div class="testimonials-track">
        <div v-for="(testimonial, index) in testimonialsList" :key="'first-'+index" class="testimonial-card">
          <div class="user-info">
            <div class="user-avatar" v-html="defaultAvatar"></div>
            <div class="user-details">
              <h3 class="user-name">{{ testimonial.name }}</h3>
              <p class="user-title">{{ testimonial.title }}</p>
            </div>
          </div>
          <div class="rating">
            <span v-for="n in 5" :key="n" class="star">★</span>
          </div>
          <p class="testimonial-text">{{ testimonial.text }}</p>
        </div>
        
        <div v-for="(testimonial, index) in testimonialsList" :key="'second-'+index" class="testimonial-card">
          <div class="user-info">
            <div class="user-avatar" v-html="defaultAvatar"></div>
            <div class="user-details">
              <h3 class="user-name">{{ testimonial.name }}</h3>
              <p class="user-title">{{ testimonial.title }}</p>
            </div>
          </div>
          <div class="rating">
            <span v-for="n in 5" :key="n" class="star">★</span>
          </div>
          <p class="testimonial-text">{{ testimonial.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, tm } = useI18n()

const defaultAvatar = `<svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
  <circle cx="18" cy="18" r="18" fill="#2A2A2A"/>
  <path d="M18 24c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" fill="#404040"/>
  <path d="M18 28c5.523 0 10-4.477 10-10S23.523 8 18 8 8 12.477 8 18s4.477 10 10 10z" stroke="#404040" stroke-width="2"/>
</svg>`

const testimonialsList = computed(() => {
  try {
    // 使用tm()而不是t()来获取数组/对象类型的翻译
    const list = tm('testimonials.list')
    if (!list) {
      console.warn('Testimonials list is null or undefined')
      return []
    }
    
    // 确保list是数组
    if (!Array.isArray(list)) {
      console.warn('Converting testimonials to array')
      return Object.values(list || {})
    }
    
    return list.filter(item => {
      if (!item || typeof item !== 'object') {
        console.warn('Invalid testimonial object:', item)
        return false
      }
      if (!item.name || !item.title || !item.text || 
          typeof item.name !== 'string' || 
          typeof item.title !== 'string' || 
          typeof item.text !== 'string') {
        console.warn('Testimonial missing required fields:', item)
        return false
      }
      return true
    })
  } catch (error) {
    console.error('Failed to load testimonials:', error)
    return []
  }
})
</script>

<style scoped>
.testimonials-section {
  padding: 60px 0;
  background-color: #1a1a1a;
  color: #fff;
  overflow: hidden;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.subtitle {
  font-size: 1.1rem;
  color: #999;
  max-width: 600px;
  margin: 0 auto;
}

.testimonials-container {
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
  position: relative;
}

.testimonials-container::before,
.testimonials-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.testimonials-container::before {
  left: 0;
  background: linear-gradient(to right, #1a1a1a, transparent);
}

.testimonials-container::after {
  right: 0;
  background: linear-gradient(to left, #1a1a1a, transparent);
}

.testimonials-track {
  display: flex;
  gap: 24px;
  animation: scroll 60s linear infinite;
  width: fit-content;
}

.testimonial-card {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  min-width: 320px;
  max-width: 320px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  margin-right: 12px;
  border-radius: 50%;
  overflow: hidden;
  background: #404040;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar svg {
  width: 100%;
  height: 100%;
  display: block;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.user-title {
  font-size: 0.9rem;
  color: #999;
  margin: 4px 0 0;
}

.rating {
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 16px;
}

.star {
  margin-right: 2px;
}

.testimonial-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e0e0e0;
  margin: 0;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-100% / 2));
  }
}

.testimonials-container:hover .testimonials-track {
  animation-play-state: paused;
}

.testimonial-card {
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  background: #333;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .testimonial-card {
    min-width: 280px;
    max-width: 280px;
    padding: 20px;
  }
  
  .testimonials-container::before,
  .testimonials-container::after {
    width: 50px;
  }
}
</style> 