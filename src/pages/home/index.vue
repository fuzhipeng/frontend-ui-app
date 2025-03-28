<template>
  <div class="home">
    <!-- 登录弹窗 -->
    <LoginDialog ref="loginDialog" />

    <!-- 首页内容 -->
    <main class="main-content">
      <template v-if="route.path === '/'">
        <div class="hero-section">
          <h1>{{ $t('hero.title') }}</h1>
          <p class="subtitle">{{ $t('hero.subtitle') }}</p>
          <div class="feature-tags">
            <span class="tag">{{ $t('hero.tags.free') }}</span>
            <span class="tag">{{ $t('hero.tags.ai') }}</span>
            <span class="tag">{{ $t('hero.tags.noRegister') }}</span>
            <span class="tag">{{ $t('hero.tags.unlimited') }}</span>
          </div>
        </div>

        <!-- 文件上传和转换区域 -->
        <div class="convert-section">
          <div class="upload-area" 
               @drop.prevent="handleDrop"
               @dragover.prevent
               @click="triggerFileInput">
            <input
              type="file"
              ref="fileInput"
              class="file-input"
              @change="handleFileChange"
              accept=".pdf,.doc,.docx,.txt"
              hidden
            >
            <div v-if="!converting" class="upload-placeholder">
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <h3>{{ $t('upload.title') }}</h3>
              <p>{{ $t('upload.subtitle') }}</p>
            </div>
            <div v-else class="converting-status">
              <div class="file-info">
                <el-icon><document /></el-icon>
                <span class="filename">{{ currentFile?.name }}</span>
                <span class="filesize">{{ formatFileSize(currentFile?.size) }}</span>
              </div>
              <el-progress 
                :percentage="convertProgress"
                :status="convertStatus"
              />
              <div class="convert-actions">
                <el-button v-if="convertStatus === 'exception'" 
                          type="primary" 
                          @click="retryConvert">
                  {{ $t('upload.retry') }}
                </el-button>
                <el-button v-if="convertStatus !== 'success'" 
                          @click="cancelConvert">
                  {{ $t('upload.cancel') }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 转换结果预览 -->
          <div v-if="showPreview" class="preview-area">
            <div class="preview-header">
              <h3>{{ $t('preview.title') }}</h3>
              <div class="preview-actions">
                <el-button type="primary" @click="downloadHtml">
                  {{ $t('preview.download') }}
                </el-button>
                <el-button @click="copyHtml">
                  {{ $t('preview.copy') }}
                </el-button>
              </div>
            </div>
            <div class="preview-container">
              <div v-if="directDisplay" class="direct-preview" v-html="previewHtml"></div>
              <el-skeleton v-else :loading="previewLoading" animated :rows="20" style="width: 100%; min-height: 300px;">
                <template #default>
                  <iframe ref="previewFrame" class="preview-frame"></iframe>
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>

        <!-- 操作流程说明 -->
        <div class="workflow-section">
          <h2>{{ $t('workflow.title') }}</h2>
          <p class="workflow-subtitle">{{ $t('workflow.subtitle') }}</p>
          
          <div class="workflow-steps">
            <div class="workflow-step">
              <div class="step-number">1</div>
              <h3>{{ $t('workflow.steps.upload.title') }}</h3>
              <p>{{ $t('workflow.steps.upload.desc') }}</p>
            </div>
            
            <div class="workflow-step">
              <div class="step-number">2</div>
              <h3>{{ $t('workflow.steps.analyze.title') }}</h3>
              <p>{{ $t('workflow.steps.analyze.desc') }}</p>
            </div>
            
            <div class="workflow-step">
              <div class="step-number">3</div>
              <h3>{{ $t('workflow.steps.download.title') }}</h3>
              <p>{{ $t('workflow.steps.download.desc') }}</p>
            </div>
          </div>
        </div>

        <!-- 功能特点展示 -->
        <div id="features" class="features-section">
          <h2>{{ $t('features.title') }}</h2>
          <p class="features-subtitle">{{ $t('features.subtitle') }}</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <el-icon class="feature-icon"><reading /></el-icon>
              <h3>{{ $t('features.cards.free.title') }}</h3>
              <p>{{ $t('features.cards.free.desc') }}</p>
            </div>
            
            <div class="feature-card">
              <el-icon class="feature-icon"><star /></el-icon>
              <h3>{{ $t('features.cards.quality.title') }}</h3>
              <p>{{ $t('features.cards.quality.desc') }}</p>
            </div>
            
            <div class="feature-card">
              <el-icon class="feature-icon"><magic-stick /></el-icon>
              <h3>{{ $t('features.cards.smart.title') }}</h3>
              <p>{{ $t('features.cards.smart.desc') }}</p>
            </div>

            <div class="feature-card">
              <el-icon class="feature-icon"><lock /></el-icon>
              <h3>{{ $t('features.cards.privacy.title') }}</h3>
              <p>{{ $t('features.cards.privacy.desc') }}</p>
            </div>
            
            <div class="feature-card">
              <el-icon class="feature-icon"><document /></el-icon>
              <h3>{{ $t('features.cards.understanding.title') }}</h3>
              <p>{{ $t('features.cards.understanding.desc') }}</p>
            </div>
            
            <div class="feature-card">
              <el-icon class="feature-icon"><medal /></el-icon>
              <h3>{{ $t('features.cards.advanced.title') }}</h3>
              <p>{{ $t('features.cards.advanced.desc') }}</p>
            </div>
          </div>
        </div>

        <!-- 用户评价部分 -->
         <Testimonials /> 

        <!-- FAQ部分 -->
        <FAQ />
      </template>
      <template v-else>
        <router-view></router-view>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, Document, Money, Star, Reading, Lock, MagicStick, Medal, ArrowDown, SwitchButton, Setting } from '@element-plus/icons-vue'
import Testimonials from '@/components/Testimonials.vue'
import FAQ from '@/components/FAQ.vue'
import { useI18n } from 'vue-i18n'
import { SUPPORT_LANGUAGES } from '@/i18n'
import axios from 'axios'
import LoginDialog from '@/components/LoginDialog.vue'
import type { Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserPoints } from '@/api/user' // 导入获取用户积分的API

interface FileInfo {
  name: string
  size: number
  raw: File
}

// API基础URL - 使用Vite环境变量
const apiBaseUrlDefault = import.meta.env.VITE_API_BASE_URL || ''
console.log('初始API基础URL:', apiBaseUrlDefault)
const apiBaseUrl = ref(apiBaseUrlDefault)

// 是否为开发环境
const isDev = false // 修改为false，禁用所有开发环境特性

// 国际化
const { t, locale } = useI18n()

// 支持的语言
const supportedLanguages = SUPPORT_LANGUAGES

// 当前语言标签
const currentLanguageLabel = computed(() => {
  const currentLang = supportedLanguages.find(lang => lang.value === locale.value)
  return currentLang ? currentLang.label : '简体中文'
})

// 处理语言切换
const handleLanguageChange = (langValue) => {
  locale.value = langValue
  localStorage.setItem('language', langValue)
  ElMessage.success(t('system.languageChanged', { lang: currentLanguageLabel.value }))
}

// 滚动到指定部分
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 文件上传相关
const fileInput: Ref<HTMLInputElement | null> = ref(null)
const currentFile: Ref<FileInfo | null> = ref(null)
const converting = ref(false)
const convertProgress = ref(0)
const convertStatus = ref('')
const showPreview = ref(false)
const previewHtml = ref('')
const previewLoading = ref(false)
const fileUploaded = ref(false)
const fileId = ref(null)
const isConverting = ref(false)
const errorMessage = ref('')

// 预览iframe引用
const previewFrame = ref(null)

// 改为默认使用iframe模式
const directDisplay = ref(false)

// 添加测试预览内容变量
const testHtmlContent = ref('')

// 实际图片路径数组
// const exampleImages = Array.from({ length: 9 }, (_, i) => `/images/examples/example-${i + 1}.jpg`)

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理文件选择
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查登录状态
    if (!userStore.isAuthenticated) {
      ElMessage.warning(t('upload.needLogin'))
      loginDialog.value?.open()
      // 重置文件输入
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      return
    }

    // 检查文件大小是否超过1MB
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      // 显示文件大小超过限制的提示
      ElMessage.error(t('upload.fileSizeExceeded'));
      // 重置文件输入
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      return;
    }
    
    // 设置当前文件
    currentFile.value = {
      name: file.name,
      size: file.size,
      raw: file
    }
    fileUploaded.value = false
    showPreview.value = true
    // 然后调用startConvert
    startConvert()
  }
}

// 处理拖放
const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file) {
    // 检查登录状态
    if (!userStore.isAuthenticated) {
      ElMessage.warning(t('upload.needLogin'))
      loginDialog.value?.open()
      return
    }

    // 检查文件大小是否超过1MB
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      // 显示文件大小超过限制的提示
      ElMessage.error(t('upload.fileSizeExceeded'));
      return;
    }
    
    // 设置当前文件
    currentFile.value = {
      name: file.name,
      size: file.size,
      raw: file
    }
    fileUploaded.value = false
    showPreview.value = true
    // 然后调用startConvert
    startConvert()
  }
}

// 下载HTML
const downloadHtml = () => {
  // 创建完整的HTML文档 - 确保与iframe中的HTML结构一致
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${currentFile.value?.name.replace(/\.[^/.]+$/, '') + ' - IntroCard AI'}</title>
      <style>
        body {
          margin: 0;
          padding: 0; /* 移除内边距 */
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #333;
          background-color: #fff;
          overflow-x: hidden;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        svg {
          display: inline-block;
          vertical-align: middle;
        }
        * {
          box-sizing: border-box;
        }
        
        /* 添加服务贸易卡片的样式 */
        .service-trade-card {
          background-color: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin: 0 auto;
          max-width: 1000px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .service-trade-card h1 {
          font-size: 28px; 
          color: #0052cc; 
          margin: 0 0 8px 0; 
          font-weight: 600;
        }
        
        .service-trade-card h2,
        .service-trade-card h3 {
          font-size: 18px; 
          color: #333; 
          margin: 0 0 8px 0;
        }
        
        /* 服务贸易卡片数据值样式 */
        .service-trade-card p[style*="font-size: 32px"],
        .service-trade-card span[style*="font-size: 32px"],
        .service-trade-card p:has(span[style*="font-size: 32px"]) {
          font-size: 32px !important;
          font-weight: 700 !important;
          color: #ff6b00 !important;
          margin: 0 0 8px 0 !important;
        }
        
        /* 服务贸易卡片列表样式 */
        .service-trade-card ul {
          padding-left: 20px;
          margin: 0;
          color: #333;
        }
        
        .service-trade-card li {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        /* 服务贸易卡片图标样式 */
        .service-trade-card svg {
          display: inline-block;
          vertical-align: middle;
          min-width: 16px;
          margin-right: 8px;
        }
        
        /* 服务贸易卡片卡片式布局 */
        .service-trade-card > div {
          padding: 10px 15px;
        }
        
        /* 服务贸易卡片数据区域样式 */
        .service-trade-card div[style*="background-color: #f0f5ff"] {
          background-color: #f0f5ff;
          padding: 10px;
          border-radius: 8px;
        }
        
        /* 服务贸易卡片底部样式 */
        .service-trade-card > div:last-child {
          padding: 8px 15px;
          background-color: #f8f9fa;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
          display: flex;
          justify-content: space-between;
        }
        
        /* 通用表格样式 */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        
        th {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          background-color: #f2f2f2;
        }
        
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        tr {
          border-bottom: 1px solid #ddd;
        }
        
        /* 通用列表样式 */
        ul, ol {
          padding-left: 20px;
          margin: 15px 0;
        }
        
        li {
          margin-bottom: 8px;
          line-height: 1.5;
        }
        
        /* 通用标题样式 */
        h1, h2, h3, h4, h5, h6 {
          color: #333;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        /* 通用段落样式 */
        p {
          margin: 10px 0;
          line-height: 1.6;
          color: #333;
        }
      </style>
    </head>
    <body>
      ${previewHtml.value}
    </body>
    </html>
  `
  
  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = currentFile.value?.name.replace(/\.[^/.]+$/, '') + '.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 复制HTML
const copyHtml = async () => {
  try {
    await navigator.clipboard.writeText(previewHtml.value)
    ElMessage.success(t('preview.copySuccess'))
  } catch (error) {
    ElMessage.error(t('preview.copyError'))
  }
}

// 处理HTML内容使其适合在预览窗口中显示
const processHtmlContent = (htmlContent) => {
  try {
    // 如果内容很简单（纯文本），给它添加一些基本样式
    if (htmlContent.trim().length > 0 && !htmlContent.includes('<div')) {
      return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; padding: 10px; width: auto; max-width: 100%; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); color: #333;">
        ${htmlContent}
      </div>`;
    }
    
    // 如果是服务贸易卡片，添加响应式样式并修复可能的图片路径
    if (htmlContent.includes('service-trade-card')) {
      // 处理服务贸易卡片样式
      let enhancedHtml = htmlContent.replace(
        /<div class="service-trade-card"/g, 
        '<div class="service-trade-card" style="width: auto; max-width: 100%; margin: 0 auto; box-sizing: border-box;"'
      );
      
      // 修复图片相对路径问题
      enhancedHtml = enhancedHtml.replace(
        /src="\/images\//g,
        'src="./images/'
      );
      
      return enhancedHtml;
    }
    
    // 修复所有内容中的相对路径
    let processedHtml = htmlContent;
    
    // 修复图片相对路径问题
    processedHtml = processedHtml.replace(
      /src="\/images\//g,
      'src="./images/'
    );
    
    // 如果内容已经有足够的样式，则保持原样
    return processedHtml;
  } catch (error) {
    console.error('处理HTML内容时出错:', error);
    return htmlContent; // 发生错误时返回原始内容
  }
}

// 提取iframe渲染逻辑为单独的函数，确保和下载HTML时的结构一致
const renderHTMLInIframe = () => {
  console.log('开始渲染HTML内容到iframe');
  
  // 创建新的iframe元素
  const newFrame = document.createElement('iframe');
  newFrame.className = 'preview-frame';
  newFrame.style.width = '100%';
  newFrame.style.minWidth = '100%';
  newFrame.style.minHeight = '300px'; 
  newFrame.style.border = 'none';
  newFrame.style.display = 'block';
  newFrame.style.backgroundColor = '#fff';
  newFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts');
  
  // 构建HTML内容
  const htmlParts = [];
  htmlParts.push('<!DOCTYPE html>');
  htmlParts.push('<html>');
  htmlParts.push('<head>');
  htmlParts.push('<meta charset="UTF-8">');
  htmlParts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  
  // 添加标题
  const title = (currentFile.value?.name?.replace(/\.[^/.]+$/, '') || '文档') + ' - 预览';
  htmlParts.push(`<title>${title}</title>`);
  
  // 添加base标签，确保相对路径正确解析
  const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  htmlParts.push(`<base href="${baseUrl}">`);
  
  // 添加样式
  htmlParts.push('<style>');
  htmlParts.push('html, body { margin: 0; padding: 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; color: #333; background-color: #fff; overflow-x: hidden; }');
  htmlParts.push('img { max-width: 100%; height: auto; }');
  htmlParts.push('svg { display: inline-block; vertical-align: middle; }');
  htmlParts.push('* { box-sizing: border-box; }');
  htmlParts.push('.service-trade-card { background-color: #f8f9fa; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 0 auto; width: auto; max-width: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }');
  htmlParts.push('.service-trade-card-header { padding: 1rem; background-color: #ffffff; border-bottom: 1px solid #e9ecef; }');
  htmlParts.push('.service-trade-card-body { padding: 1rem; }');
  htmlParts.push('.service-trade-card-footer { padding: 1rem; background-color: #f8f9fa; border-top: 1px solid #e9ecef; }');
  htmlParts.push('.service-trade-card-title { margin: 0; font-size: 1.25rem; color: #212529; }');
  htmlParts.push('.service-trade-card-subtitle { margin: 0.5rem 0 0; font-size: 0.875rem; color: #6c757d; }');
  htmlParts.push('.service-trade-card-text { margin-bottom: 1rem; color: #212529; }');
  htmlParts.push('.service-trade-card-link { color: #007bff; text-decoration: none; }');
  htmlParts.push('.service-trade-card-link:hover { color: #0056b3; text-decoration: underline; }');
  htmlParts.push('html, body { height: auto !important; overflow: visible !important; }');
  htmlParts.push('body > div { margin: 0 !important; padding: 5px !important; }'); /* 减少内容顶部和底部空白 */
  htmlParts.push('</style>');
  
  // 处理路径的脚本
  htmlParts.push('<script>');
  htmlParts.push('window.addEventListener("DOMContentLoaded", function() {');
  htmlParts.push('  document.querySelectorAll("img").forEach(function(img) {');
  htmlParts.push('    var src = img.getAttribute("src");');
  htmlParts.push('    if(src && src.startsWith("/")) {');
  htmlParts.push('      img.setAttribute("src", "." + src);');
  htmlParts.push('    }');
  htmlParts.push('  });');
  htmlParts.push('});');
  htmlParts.push('</' + 'script>');
  
  // 高度调整脚本
  htmlParts.push('<script>');
  htmlParts.push('function updateHeight() {');
  htmlParts.push('  var height = document.body.scrollHeight;');
  htmlParts.push('  window.parent.postMessage({ type: "resize", height: height }, "*");');
  htmlParts.push('}');
  htmlParts.push('window.addEventListener("load", updateHeight);');
  htmlParts.push('window.addEventListener("DOMContentLoaded", updateHeight);');
  htmlParts.push('setTimeout(updateHeight, 100);');
  htmlParts.push('setTimeout(updateHeight, 500);');
  htmlParts.push('</' + 'script>');
  
  // 添加body标签和内容
  htmlParts.push('</head>');
  htmlParts.push('<body>');
  htmlParts.push(previewHtml.value || '<div style="padding: 20px; text-align: center; color: #666;">请上传文件查看预览</div>');
  htmlParts.push('</body>');
  htmlParts.push('</html>');
  
  // 合并所有HTML部分
  const frameContent = htmlParts.join('\n');
  
  // 使用srcdoc属性设置HTML内容
  newFrame.srcdoc = frameContent;
  
  // 监听从iframe发送的消息，用于动态调整高度
  const handleMessage = (event) => {
    if (event.data && event.data.type === 'resize') {
      console.log('收到iframe高度调整消息:', event.data.height);
      // 不限制最大高度，允许内容完全显示
      const newHeight = Math.max(event.data.height, 300);
      newFrame.style.height = `${newHeight}px`;
    }
  };
  
  window.addEventListener('message', handleMessage);
  
  // 等待iframe加载完成
  newFrame.onload = () => {
    console.log('iframe加载完成');
    previewLoading.value = false;
    
    // 确保内容可见
    try {
      if (newFrame.contentDocument?.body) {
        const height = Math.max(newFrame.contentDocument.body.scrollHeight, 300);
        newFrame.style.height = `${height}px`;
      }
    } catch (e) {
      console.error('调整iframe高度时出错:', e);
    }
  };
  
  // 替换现有iframe
  setTimeout(() => {
    if (previewFrame.value && previewFrame.value.parentNode) {
      previewFrame.value.parentNode.replaceChild(newFrame, previewFrame.value);
      previewFrame.value = newFrame;
    } else {
      // 如果previewFrame.value为null，则尝试找到容器并添加iframe
      const container = document.querySelector('.preview-container');
      if (container) {
        // 首先移除el-skeleton的加载状态
        previewLoading.value = false;
        // 然后清空容器并添加iframe
        container.innerHTML = '';
        container.appendChild(newFrame);
        previewFrame.value = newFrame;
      } else {
        console.error('找不到预览容器');
        previewLoading.value = false;
      }
    }
  }, 0);
  
  // 确保加载状态最终会被清除
  setTimeout(() => {
    previewLoading.value = false;
  }, 2000);
  
  return newFrame;
}

// 同样修改强制重渲染函数中的逻辑
const forceRerender = () => {
  if (!previewHtml.value) {
    ElMessage.warning('没有HTML内容可渲染')
    return
  }
  
  previewLoading.value = true
  
  // 重新调用渲染函数
  setTimeout(() => {
    try {
      renderHTMLInIframe();
    } catch (error) {
      console.error('强制重渲染时出错:', error);
      previewLoading.value = false;
    }
  }, 100);
}

// 启动文件转换进程
const startConvert = async () => {
  if (!currentFile.value) {
    ElMessage.error('请先选择文件')
    return
  }

  try {
    isConverting.value = true
    converting.value = true
    previewHtml.value = ''
    errorMessage.value = ''
    previewLoading.value = true
    showPreview.value = true
    
    console.log('开始文件转换流程，当前文件:', currentFile.value.name)
    
    // 模拟转换进度
    let progress = 0
    const progressInterval = setInterval(() => {
      progress += 10
      convertProgress.value = Math.min(progress, 90) // 最多到90%，等待实际结果
      
      if (progress >= 100) {
        clearInterval(progressInterval)
      }
    }, 500)
    
    // 上传文件
    try {
      console.log('准备上传文件...')
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', currentFile.value.raw)
    // 添加用户ID
    if (userStore.isAuthenticated && userStore.user) {
      formData.append('userId', userStore.user.id)
    }
      // 发送POST请求上传文件
      console.log('正在调用上传API:', `${apiBaseUrl.value}/api/file/uploadUserData`)
      const response = await axios.post(`${apiBaseUrl.value}/api/file/uploadUserData`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // 如果上传成功，设置fileId
      console.log('文件上传成功，响应数据:', response.data)
      fileUploaded.value = true
      fileId.value = response.data.id || response.data.data?.id
      console.log('提取的文件ID:', fileId.value)
      
      if (!fileId.value) {
        throw new Error('上传成功但未能获取文件ID')
      }
    } catch (uploadError) {
      console.error('文件上传失败:', uploadError)
      clearInterval(progressInterval)
      convertStatus.value = 'exception'
      errorMessage.value = `上传失败: ${uploadError.message || '服务器错误'}`
      previewLoading.value = false
      isConverting.value = false
      return
    }
    
    // 获取转换结果
    try {
      console.log('准备获取转换结果，文件ID:', fileId.value)
      console.log('调用转换API:', `${apiBaseUrl.value}/api/file/conversion/${fileId.value}`)
      
      const conversionResponse = await axios.get(`${apiBaseUrl.value}/api/file/conversion/${fileId.value}`)
      console.log('获取转换结果成功:', conversionResponse.status)
      
      clearInterval(progressInterval)
      convertProgress.value = 100
      convertStatus.value = 'success'
      
      const responseData = conversionResponse.data
      console.log('转换结果数据:', JSON.stringify(responseData).substring(0, 200) + '...')

      // 检查返回数据，提取HTML内容
      let htmlContent = ''
      
      try {
        const data = responseData.data || responseData
        console.log('提取的数据类型:', typeof data)
        
        if (typeof data === 'string') {
          console.log('数据是字符串类型')
          if (data.trim().startsWith('{') && data.trim().endsWith('}')) {
            // 是JSON字符串
            try {
              console.log('尝试解析JSON字符串')
              const jsonData = JSON.parse(data)
              console.log('JSON解析成功，查找HTML内容字段')
              
              if (jsonData.htmlContent) {
                console.log('从jsonData.htmlContent获取内容')
                htmlContent = jsonData.htmlContent
              } else if (jsonData.html) {
                console.log('从jsonData.html获取内容')
                htmlContent = jsonData.html
              } else if (jsonData.content) {
                console.log('从jsonData.content获取内容')
                htmlContent = jsonData.content
              } else {
                // 遍历JSON对象查找可能包含HTML的字段
                console.log('遍历JSON字段查找HTML内容')
                for (const key in jsonData) {
                  if (typeof jsonData[key] === 'string' && 
                      (jsonData[key].includes('<div') || 
                       jsonData[key].includes('<p') || 
                       jsonData[key].includes('<html'))) {
                    console.log(`从字段${key}找到HTML内容`)
                    htmlContent = jsonData[key]
                    break
                  }
                }
                // 如果仍然没有找到HTML内容，则直接显示JSON字符串
                if (!htmlContent) {
                  console.log('未找到HTML内容，显示格式化的JSON')
                  htmlContent = `<pre>${JSON.stringify(jsonData, null, 2)}</pre>`
                }
              }
            } catch (e) {
              console.error('解析JSON时出错:', e)
              htmlContent = data // 如果解析失败，直接显示原始字符串
            }
          } else {
            console.log('数据是普通字符串，可能直接是HTML')
            htmlContent = data
          }
        } else if (typeof data === 'object') {
          console.log('数据是对象类型，查找HTML内容字段')
          if (data.htmlContent) {
            console.log('从data.htmlContent获取内容')
            htmlContent = data.htmlContent
          } else if (data.html) {
            console.log('从data.html获取内容')
            htmlContent = data.html
          } else if (data.content) {
            console.log('从data.content获取内容')
            htmlContent = data.content
          } else {
            // 尝试JSON.stringify
            console.log('未找到HTML内容字段，显示格式化的JSON对象')
            htmlContent = `<pre>${JSON.stringify(data, null, 2)}</pre>`
          }
        } else {
          console.log('未知的数据格式:', typeof data)
          htmlContent = '无法识别的数据格式'
        }
      } catch (e) {
        console.error('处理响应数据时出错:', e)
        htmlContent = '处理数据时出错: ' + e.message
      }
      
      console.log('提取的HTML内容长度:', htmlContent ? htmlContent.length : 0)
      
      // 处理HTML内容
      if (htmlContent && htmlContent.trim()) {
        // 处理HTML内容
        console.log('处理HTML内容...')
        previewHtml.value = processHtmlContent(htmlContent)
        console.log('HTML内容已处理完成，长度:', previewHtml.value.length)
        
        // 使用iframe模式渲染HTML
          setTimeout(() => {
            renderHTMLInIframe()
          }, 0)
      } else {
        console.warn('未获取到有效的HTML内容')
        previewHtml.value = '<div class="error-message">未获取到有效的HTML内容</div>'
        previewLoading.value = false
      }
    } catch (conversionError) {
      console.error('获取转换结果时出错:', conversionError)
      clearInterval(progressInterval)
      convertStatus.value = 'exception'
      errorMessage.value = `获取转换结果失败: ${conversionError.message || '服务器错误'}`
      previewLoading.value = false
    }
  } catch (error) {
    console.error('转换过程中出错:', error)
    convertStatus.value = 'exception'
    errorMessage.value = `转换失败: ${error.message || '未知错误'}`
    previewLoading.value = false
  } finally {
    isConverting.value = false
  }
}

// 重试转换
const retryConvert = () => {
  if (currentFile.value) {
    fileUploaded.value = false
    startConvert()
  }
}

// 取消转换
const cancelConvert = () => {
  isConverting.value = false
  currentFile.value = null
  convertProgress.value = 0
  convertStatus.value = ''
  showPreview.value = false
  fileUploaded.value = false
  fileId.value = null
  previewHtml.value = ''
}

// 格式化文件大小
const formatFileSize = (size) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(2)} ${units[index]}`
}

const loginDialog = ref()

const handleLogin = () => {
  loginDialog.value?.open()
}

const router = useRouter()
const userStore = useUserStore()

// 处理退出登录
const handleLogout = async () => {
  try {
    // 直接调用clearUser方法
    userStore.clearUser()
    ElMessage.success('已退出登录')
    // 强制刷新页面以确保状态更新
    window.location.reload()
  } catch (error) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败，请重试')
  }
}

// 处理设置按钮点击
const handleSettings = () => {
  console.log('点击设置按钮')
  console.log('用户认证状态:', userStore.isAuthenticated)
  console.log('当前路由:', router.currentRoute.value.path)
  
  if (userStore.isAuthenticated) {
    console.log('用户已登录，正在导航到设置页面')
    router.push('/settings').catch(err => {
      console.error('导航失败:', err)
      ElMessage.error('导航到设置页面失败，请重试')
    })
  } else {
    console.log('用户未登录，显示登录对话框')
    ElMessage.warning('请先登录')
    handleLogin()
  }
}

const route = useRoute()

// 添加userPoints响应式变量
const userPoints = ref(0)

// 获取用户积分的方法
const fetchUserPoints = async () => {
  if (!userStore.isAuthenticated || !userStore.user?.id) {
    userPoints.value = 0
    return
  }
  
  try {
    const response = await getUserPoints(userStore.user.id)
    if (response && response.points) {
      userPoints.value = response.points
    } else {
      userPoints.value = 0
    }
  } catch (error) {
    console.error('获取用户积分失败:', error)
    userPoints.value = 0
  }
}

// 监听用户登录状态变化
watch(() => userStore.isAuthenticated, (newValue) => {
  if (newValue) {
    fetchUserPoints()
  } else {
    userPoints.value = 0
  }
}, { immediate: true })
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #111111;
  color: #e0e0e0;
  position: relative;
  overflow: hidden;
}

.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(to bottom right, rgba(30, 30, 30, 0.8) 0%, transparent 100%),
    linear-gradient(to top right, rgba(20, 20, 20, 0.8) 0%, transparent 100%),
    repeating-linear-gradient(45deg, 
      rgba(25, 25, 25, 0.1) 0px, 
      rgba(25, 25, 25, 0.1) 1px,
      transparent 1px, 
      transparent 10px
    ),
    repeating-linear-gradient(-45deg, 
      rgba(25, 25, 25, 0.1) 0px, 
      rgba(25, 25, 25, 0.1) 1px,
      transparent 1px, 
      transparent 10px
    );
  pointer-events: none;
  z-index: 0;
}

.home::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(40, 40, 40, 0.3) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(26, 26, 26, 0.8);  /* 增加背景色透明度 */
  backdrop-filter: blur(10px);  /* 添加毛玻璃效果 */
  -webkit-backdrop-filter: blur(10px);  /* Safari支持 */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;  /* 确保在最上层 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);  /* 添加微妙的边框 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  color: #e0e0e0;
}

.logo img {
  height: 28px;
  width: auto;
  object-fit: contain;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 600;
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-menu a {
  color: #e0e0e0;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #d4a055;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-btn {
  background-color: #d4a055;
  border-color: #d4a055;
  color: #fff;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #c28d42;
    border-color: #c28d42;
  }
}

.language-dropdown {
  color: #e0e0e0;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 7rem 2rem 1rem;
  & > div:not(:last-child) {
    margin-bottom: 1.5rem;
  }
  position: relative;
  z-index: 1;
}

.hero-section {
  text-align: center;
  margin-top: 1rem;  /* 调整顶部外边距 */
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #d4a055;
  margin-bottom: 1.5rem;
}

.feature-tags {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tag {
  padding: 0.5rem 1rem;
  background-color: rgba(212, 160, 85, 0.1);
  border: 1px solid #d4a055;
  border-radius: 20px;
  font-size: 0.9rem;
}

.convert-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.upload-area {
  width: 100%;
  min-height: 300px;
  border: 2px dashed #666;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #d4a055;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: #666;
  margin-bottom: 1rem;
}

.converting-status {
  width: 100%;
  padding: 2rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.convert-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.preview-area {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 0;
  margin-top: 0.5rem; /* 进一步减少顶部外边距 */
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 0.3rem 1rem; /* 减少内边距 */
  background-color: #2d2d2d;
  color: #fff;
}

.preview-container {
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  border-radius: 0;
  box-shadow: none;
  max-width: 100%;
  margin: 0;
  max-height: none;
  padding: 0;
}

.preview-frame {
  width: 100%;
  min-width: 100%;
  min-height: 300px; /* 进一步减少最小高度 */
  border: none;
  display: block;
  background-color: #fff;
  padding: 0;
  margin: 0;
  overflow: visible;
}

/* 确保预览区域在移动设备上也能正常显示 */
@media (max-width: 1280px) {
  .preview-container {
    overflow: hidden;
    width: 100%;
  }
  
  .preview-frame {
    width: 100%;
    min-width: auto;
  }
}

.preview-content {
  display: none;
}

.direct-preview {
  width: 100%;
  min-height: 300px;
  background-color: #fff;
  color: #333;
  padding: 0;
  border-radius: 4px;
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 恢复基本样式 */
.direct-preview :deep(div) {
  max-width: 100%;
}

.direct-preview :deep(img) {
  max-width: 100%;
  height: auto;
}

.direct-preview :deep(*) {
  box-sizing: border-box;
}

/* 为深圳服务贸易的特殊样式 */
.direct-preview :deep(.service-trade-card) {
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin: 0 auto;
  max-width: 1000px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 服务贸易卡片标题样式 */
.direct-preview :deep(.service-trade-card h1) {
  font-size: 28px; 
  color: #0052cc; 
  margin: 0 0 8px 0; 
  font-weight: 600;
}

/* 服务贸易卡片子标题样式 */
.direct-preview :deep(.service-trade-card h2),
.direct-preview :deep(.service-trade-card h3) {
  font-size: 18px; 
  color: #333; 
  margin: 0 0 8px 0;
}

/* 服务贸易卡片数据值样式 */
.direct-preview :deep(.service-trade-card p[style*="font-size: 32px"]),
.direct-preview :deep(.service-trade-card p:has(span[style*="font-size: 32px"])) {
  font-size: 32px !important;
  font-weight: 700 !important;
  color: #ff6b00 !important;
  margin: 0 0 8px 0 !important;
}

/* 服务贸易卡片列表样式 */
.direct-preview :deep(.service-trade-card ul) {
  padding-left: 20px;
  margin: 0;
  color: #333;
}

.direct-preview :deep(.service-trade-card li) {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

/* 服务贸易卡片图标样式 */
.direct-preview :deep(.service-trade-card svg) {
  display: inline-block;
  vertical-align: middle;
  min-width: 16px;
  margin-right: 8px;
}

/* 服务贸易卡片卡片式布局 */
.direct-preview :deep(.service-trade-card > div) {
  padding: 10px 15px;
}

.direct-preview :deep(.service-trade-card > div:first-child) {
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.features-section {
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.features-subtitle {
  color: #888;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  overflow: visible;
  max-height: none !important;
}

.feature-card {
  background-color: #2d2d2d;
  padding: 1.2rem 1.5rem;
  border-radius: 10px;
  text-align: center;
  height: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 1 !important;
  visibility: visible !important;
  position: relative !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 40px;
  color: #d4a055;
  margin-bottom: 0.8rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: #e0e0e0;
  font-size: 1.2rem;
  font-weight: 600;
}

.feature-card p {
  color: #888;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 0;
  margin-top: 0;
}

.examples-section {
  text-align: center;
  margin-top: 3rem;
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.examples-section h2 {
  font-size: 2rem;
  margin-bottom: 0.8rem;
  color: #e0e0e0;
}

.examples-subtitle {
  color: #888;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1.25rem;
  margin: 1rem auto;
  width: 100%;
  max-width: 1200px;
}

.example-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 4/3;
}

.example-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.example-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.example-item:hover .example-image {
  transform: scale(1.05);
}

.example-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.example-item:hover .example-overlay {
  opacity: 1;
}

.example-tag {
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background-color: rgba(212, 160, 85, 0.8);
  border-radius: 20px;
}

.debug-info {
  margin-top: 2rem;
  text-align: center;
  background-color: rgba(212, 160, 85, 0.1);
  border: 1px solid #d4a055;
  border-radius: 8px;
  padding: 1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.debug-info p {
  margin: 0.5rem 0;
  color: #d4a055;
}

.debug-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.api-url-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.api-url-form p {
  margin-bottom: 0.5rem;
}

.api-url-form .el-input {
  width: 300px;
}

.api-url-form .el-button {
  margin-top: 0.5rem;
}

/* 添加Testimonials组件的样式 */
:deep(.testimonials-section) {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

:deep(.testimonials-section h2) {
  margin-bottom: 0.8rem;
}

:deep(.testimonials-section .testimonials-subtitle) {
  margin-bottom: 1rem;
}

:deep(.testimonials-container) {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

:deep(.testimonial-card) {
  padding: 1rem;
}

/* 减少主页面中各部分的间距 */
.examples-section {
  margin-bottom: 2rem;
}

#faq {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* 添加FAQ组件样式 */
:deep(.faq-section) {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.faq-section h2) {
  margin-bottom: 0.5rem;
}

:deep(.faq-header-wrap) {
  margin-bottom: 0.5rem;
}

:deep(.faq-content) {
  margin-top: 0.5rem;
}

/* 减少FAQ与上方区域的间距 */
.main-content > div:nth-last-child(2) {
  margin-bottom: 1rem;
}

/* 用户信息样式 */
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

.dropdown-user-info {
  display: flex;
  align-items: center;
  padding: 8px;
  min-width: 200px;
}

.dropdown-user-details {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.dropdown-user-name {
  font-size: 14px;
  font-weight: 500;
}

.dropdown-user-email {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* Element Plus 暗色主题覆盖 */
:deep(.el-dropdown-menu) {
  background-color: #1f1f1f !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-dropdown-menu__item) {
  color: #ffffff !important;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-dropdown-menu__item.is-disabled) {
  color: #606266 !important;
}

:deep(.el-button--primary) {
  background-color: #d4a055 !important;
  border-color: #d4a055 !important;
  
  &:hover {
    background-color: #c28d42 !important;
    border-color: #c28d42 !important;
  }
}

/* 其他页面容器样式 */
.other-pages {
  margin-top: 70px; /* 为导航栏留出空间 */
  padding: 2rem;
  min-height: calc(100vh - 70px);
}

/* 其他页面内容样式 */
.other-page-content {
  padding-top: 80px; /* 为顶部导航栏留出空间 */
  min-height: calc(100vh - 80px);
}

/* 子路由内容样式 */
.main-content {
  padding-top: 64px; /* 为固定的header留出空间 */
}

.router-view-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 积分显示样式 */
.user-points {
  margin-right: 15px;
  font-size: 14px;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

/* 操作流程说明样式 */
.workflow-section {
  text-align: center;
  margin: 3rem auto;
  padding: 0 1rem;
  max-width: 1200px;
}

.workflow-section h2 {
  font-size: 2rem;
  margin-bottom: 0.8rem;
  color: #e0e0e0;
}

.workflow-subtitle {
  color: #888;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.workflow-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;
}

.workflow-step {
  background-color: #2d2d2d;
  padding: 2rem 1.5rem;
  border-radius: 10px;
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
}

.workflow-step:hover {
  transform: translateY(-5px);
}

.step-number {
  width: 40px;
  height: 40px;
  background-color: #d4a055;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.workflow-step h3 {
  color: #e0e0e0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.workflow-step p {
  color: #888;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

/* 添加连接线 */
.workflow-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 15%;
  right: 15%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4a055, transparent);
  z-index: 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .workflow-steps {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .workflow-steps::before {
    display: none;
  }
  
  .workflow-step {
    padding: 1.5rem 1rem;
  }
}
</style> 