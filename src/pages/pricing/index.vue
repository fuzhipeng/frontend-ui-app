<template>
  <div class="pricing-page">
    <main class="pricing-container">
      <h1 class="pricing-title">{{ $t('pricing.title') }}</h1>
      <p class="pricing-subtitle">{{ $t('pricing.subtitle') }}</p>
      
      <!-- 价格卡片 -->
      <div class="pricing-cards">
        <!-- 高级版 -->
        <div class="pricing-card">
          <div class="pricing-card-header">
            <h2>{{ $t('pricing.highTier.title') }}</h2>
            <p class="pricing-description">{{ planPeriod }}</p>
          </div>
          <div class="pricing-card-price">
            <span class="price-currency">$</span>
            <span class="price-amount">{{ highTierPrice }}</span>
            <span class="price-period">/{{ !isYearly ? $t('pricing.monthly').split(' ')[0].toLowerCase() : $t('pricing.yearly').split(' ')[0].toLowerCase() }}</span>
          </div>
          <div class="pricing-card-features">
            <ul>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.highTier.points') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.highTier.speed') }}
                <el-tooltip :content="$t('pricing.highTier.speedTooltip')" placement="top">
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.highTier.noAds') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.highTier.noWatermark') }}
              </li>
            </ul>
          </div>
          <div class="pricing-card-footer">
            <CreemCheckout
              :productId="highPlan.productId"
              :buttonText="$t('pricing.highTier.buttonText')"
              :metadata="highPlan.metadata"
              @checkout-started="trackCheckoutStarted('high')"
            />
          </div>
        </div>
        
        <!-- 旗舰版 -->
        <div class="pricing-card highlighted">
          <div class="pricing-card-header">
            <div class="popular-tag">{{ $t('pricing.premiumTier.popular') }}</div>
            <h2>{{ $t('pricing.premiumTier.title') }}</h2>
            <p class="pricing-description">{{ planPeriod }}</p>
          </div>
          <div class="pricing-card-price">
            <span class="price-currency">$</span>
            <span class="price-amount">{{ premiumTierPrice }}</span>
            <span class="price-period">/{{ !isYearly ? $t('pricing.monthly').split(' ')[0].toLowerCase() : $t('pricing.yearly').split(' ')[0].toLowerCase() }}</span>
          </div>
          <div class="pricing-card-features">
            <ul>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.premiumTier.points') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.premiumTier.speed') }}
                <el-tooltip :content="$t('pricing.premiumTier.speedTooltip')" placement="top">
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.highTier.noAds') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.highTier.noWatermark') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.premiumTier.formatOptimization') }}
                <el-tooltip :content="$t('pricing.premiumTier.formatTooltip')" placement="top">
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.premiumTier.privateProcessing') }}
                <el-tooltip :content="$t('pricing.premiumTier.privateTooltip')" placement="top">
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.premiumTier.earlyAccess') }}
                <el-tooltip :content="$t('pricing.premiumTier.earlyAccessTooltip')" placement="top">
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </li>
            </ul>
          </div>
          <div class="pricing-card-footer">
            <CreemCheckout
              :productId="premiumPlan.productId"
              :buttonText="$t('pricing.premiumTier.buttonText')"
              :metadata="premiumPlan.metadata"
              @checkout-started="trackCheckoutStarted('premium')"
            />
          </div>
        </div>
        
        <!-- 企业版 -->
        <div class="pricing-card">
          <div class="pricing-card-header">
            <h2>{{ $t('pricing.enterpriseTier.title') }}</h2>
            <p class="pricing-description">{{ $t('pricing.enterpriseTier.description') }}</p>
          </div>
          <div class="pricing-card-price">
            <span class="price-amount">{{ $t('pricing.enterpriseTier.price') }}</span>
          </div>
          <div class="pricing-card-features">
            <ul>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.enterpriseTier.privacy') }}
                <el-tooltip :content="$t('pricing.enterpriseTier.privacyTooltip')" placement="top">
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.enterpriseTier.customModel') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.enterpriseTier.customIntegration') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.enterpriseTier.dedicatedSupport') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.enterpriseTier.apiAccess') }}
              </li>
              <li>
                <el-icon><Check /></el-icon>
                {{ $t('pricing.enterpriseTier.highVolume') }}
              </li>
            </ul>
          </div>
          <div class="pricing-card-footer">
            <button class="custom-button primary-button plain-button">{{ $t('pricing.enterpriseTier.buttonText') }}</button>
          </div>
        </div>
      </div>
      
      <!-- 常见问题 FAQ -->
      <div id="faq" class="faq-section">
        <h2>{{ $t('pricing.faq.title') }}</h2>
        <p class="faq-subtitle">{{ $t('pricing.faq.subtitle') }}</p>
        <div class="faq-container">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <div 
              class="faq-question" 
              @click="togglePanel(index)"
              :class="{ 'active': !collapsedPanels[index] }"
            >
              <h3>{{ faq.question }}</h3>
              <el-icon class="faq-icon" :class="{ 'rotate': !collapsedPanels[index] }">
                <ArrowDown />
              </el-icon>
            </div>
            <div class="faq-answer" v-show="!collapsedPanels[index]">
              <div v-html="formatText(faq.answer)"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ArrowDown, Check, InfoFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import CreemCheckout from '@/components/CreemCheckout.vue'
import { useUserStore } from '@/stores/user'

const { t, locale, messages } = useI18n()
const userStore = useUserStore()

// 调试
console.log('当前语言:', locale.value)

// 设置为月付
const isYearly = ref(false)

// 根据付款方式计算价格 - 只使用月付价格
const highTierPrice = computed(() => 12)
const premiumTierPrice = computed(() => 24)
const planPeriod = computed(() => {
  return isYearly.value ? t('pricing.yearly') : t('pricing.monthly')
})

// 定义产品计划数据 - 只使用月付产品
const highPlan = computed(() => ({
  productId: 'prod_72KZNhyOAGYixU89pUMenL',
  name: '高级版',
  buttonText: '升级到高级版',
  metadata: { plan: 'high', period: 'monthly' }
}))

const premiumPlan = computed(() => ({
  productId: 'prod_2JByiTnhcB99sEdTUsbvDQ',
  name: '旗舰版',
  buttonText: '升级到旗舰版',
  metadata: { plan: 'premium', period: 'monthly' }
}))

// FAQ数据
interface FaqItem {
  question: string;
  answer: string;
}

const faqs = computed<FaqItem[]>(() => {
  try {
    const currentMessages = messages.value[locale.value] as any;
    return currentMessages?.pricing?.faq?.items || [];
  } catch (error) {
    console.error('获取FAQ数据出错:', error);
    return [];
  }
});

// 初始化所有面板为展开状态（设置为false表示不折叠）
const collapsedPanels = ref<boolean[]>([])

// 监听FAQ数据变化，更新面板状态数组
watch(faqs, (newFaqs) => {
  collapsedPanels.value = Array(newFaqs.length).fill(false);
}, { immediate: true })

// 切换面板展开/折叠状态
const togglePanel = (index: number) => {
  collapsedPanels.value[index] = !collapsedPanels.value[index]
}

// 格式化文本，处理嵌套列表
const formatText = (text: string) => {
  if (!text) return ''
  
  // 替换带缩进的嵌套列表项
  let formattedText = text.replace(/\n• (.*?)(?=\n|$)/g, '<li>$1</li>')
  
  // 替换带缩进的嵌套列表项（使用◦符号的嵌套项）
  formattedText = formattedText.replace(/\n  ◦ (.*?)(?=\n|$)/g, '<ul class="nested-list"><li>$1</li></ul>')
  
  // 替换以连字符开头的列表项
  formattedText = formattedText.replace(/\n- (.*?)(?=\n|$)/g, '<li>$1</li>')
  
  // 将所有列表项包装在ul标签中
  if (formattedText.includes('<li>')) {
    formattedText = '<ul>' + formattedText + '</ul>'
    
    // 修复嵌套列表的结构
    formattedText = formattedText.replace(/<\/li><ul class="nested-list">/g, '<ul class="nested-list">')
    formattedText = formattedText.replace(/<\/ul><\/li>/g, '</ul></li>')
    formattedText = formattedText.replace(/<\/ul><ul class="nested-list">/g, '')
  }
  
  // 替换换行符为段落
  formattedText = formattedText.replace(/\n\n/g, '</p><p>')
  
  // 包装在段落标签中
  if (!formattedText.startsWith('<ul>')) {
    formattedText = '<p>' + formattedText + '</p>'
  }
  
  return formattedText
}

// 跟踪结账事件
function trackCheckoutStarted(plan: string) {
  console.log(`${plan} 计划结账已开始`)
  // 这里可以添加分析追踪代码
}

onMounted(() => {
  console.log('价格页面已加载')
})
</script>

<style scoped>
.pricing-page {
  padding-top: 0;
  background-color: #1a1a1a;
  color: #ffffff;
  min-height: 100vh;
}

.pricing-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 40px;
}

.pricing-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
}

.pricing-subtitle {
  font-size: 1.2rem;
  text-align: center;
  color: #aaaaaa;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* 价格卡片 */
.pricing-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 36px;
  margin-bottom: 60px;
}

.pricing-card {
  background-color: #2a2a2a;
  border-radius: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}

.pricing-card.highlighted {
  border: 2px solid #d4a055;
  transform: scale(1.05);
}

.pricing-card.highlighted:hover {
  transform: translateY(-8px) scale(1.05);
}

.pricing-card-header {
  padding: 24px;
  position: relative;
}

.popular-tag {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #d4a055;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-bottom-left-radius: 8px;
}

.pricing-card-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.pricing-description {
  color: #aaaaaa;
  font-size: 0.9rem;
  line-height: 1.5;
}

.pricing-card-price {
  padding: 16px;
  background-color: #222222;
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.price-currency {
  font-size: 1.2rem;
  font-weight: 500;
  margin-right: 2px;
}

.price-amount {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1;
}

.price-period {
  font-size: 0.9rem;
  color: #aaaaaa;
  margin-left: 2px;
}

.pricing-card-features {
  padding: 24px;
  flex-grow: 1;
}

.pricing-card-features ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.pricing-card-features li {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  color: #e0e0e0;
  font-size: 0.95rem;
}

.pricing-card-features li:last-child {
  margin-bottom: 0;
}

.pricing-card-features .el-icon {
  color: #d4a055;
  margin-right: 12px;
  font-size: 18px;
}

.info-icon {
  color: #888;
  margin-left: 6px;
  font-size: 14px;
  cursor: help;
}

.pricing-card-footer {
  padding: 24px;
  text-align: center;
}

.custom-button {
  width: 100%;
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: inline-block;
  text-align: center;
}

.primary-button {
  background-color: #409eff;
  color: white;
}

.primary-button:hover {
  background-color: #66b1ff;
}

.plain-button {
  background-color: transparent;
  border: 1px solid #409eff;
  color: #409eff;
}

.plain-button:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

/* FAQ样式 */
.faq-section {
  padding-top: 30px;
  padding-bottom: 40px;
}

.faq-section h2 {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 8px;
}

.faq-subtitle {
  text-align: center;
  color: #aaaaaa;
  font-size: 1.1rem;
  margin-bottom: 25px;
}

.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 12px;
  border-radius: 12px;
  background-color: #2a2a2a;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.faq-question:hover {
  background-color: #333333;
}

.faq-question.active {
  background-color: #333333;
}

.faq-question h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.faq-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.faq-icon.rotate {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 20px 20px;
  color: #bbbbbb;
  line-height: 1.6;
  transition: all 0.3s ease-in-out;
}

.faq-answer p {
  margin-top: 0;
}

/* 响应式样式 */
@media (max-width: 1100px) {
  .pricing-cards {
    gap: 28px;
  }
  
  .pricing-card {
    width: 300px;
  }
}

@media (max-width: 960px) {
  .pricing-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .pricing-card {
    width: 100%;
    max-width: 500px;
  }
  
  .pricing-card.highlighted {
    transform: scale(1);
    order: -1;
    margin-bottom: 16px;
  }
  
  .pricing-card.highlighted:hover {
    transform: translateY(-8px) scale(1);
  }
}

@media (max-width: 600px) {
  .pricing-container {
    padding: 40px 16px 20px;
  }
  
  .pricing-title {
    font-size: 2rem;
  }
  
  .pricing-subtitle {
    font-size: 1rem;
    margin-bottom: 32px;
  }
  
  .pricing-card-price {
    padding: 16px;
  }
  
  .price-amount {
    font-size: 3rem;
  }
  
  .faq-section h2 {
    font-size: 1.8rem;
  }
}

/* 列表样式 */
:deep(ul) {
  list-style: none;
  padding-left: 0;
}

:deep(li) {
  margin-bottom: 8px;
  position: relative;
  padding-left: 24px;
}

:deep(li::before) {
  content: '•';
  position: absolute;
  left: 0;
  color: #d4a055;
  font-size: 20px;
  line-height: 1;
}

:deep(ul.nested-list) {
  margin-top: 8px;
  margin-bottom: 0;
  padding-left: 20px;
}

:deep(ul.nested-list li::before) {
  content: '◦';
  font-size: 16px;
}

/* 移除价格选择开关相关样式 */
.pricing-toggle,
.pricing-toggle-switch,
.discount-tag {
  display: none;
}
</style> 