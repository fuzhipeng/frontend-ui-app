import { createI18n } from 'vue-i18n'
import zhCN from './langs/zh-CN'
import enUS from './langs/en-US'
import frFR from './langs/fr-FR'
import deDE from './langs/de-DE'
import esES from './langs/es-ES'
import jaJP from './langs/ja-JP'
import koKR from './langs/ko-KR'
import ruRU from './langs/ru-RU'

// 导出支持的语言列表
export const SUPPORT_LANGUAGES = [
  {
    label: '简体中文',
    value: 'zh-CN',
    icon: '🇨🇳'
  },
  {
    label: 'English',
    value: 'en-US',
    icon: '🇺🇸'
  },
  {
    label: '日本語',
    value: 'ja-JP',
    icon: '🇯🇵'
  },
  {
    label: '한국어',
    value: 'ko-KR',
    icon: '🇰🇷'
  },
  {
    label: 'Français',
    value: 'fr-FR',
    icon: '🇫🇷'
  },
  {
    label: 'Deutsch',
    value: 'de-DE',
    icon: '🇩🇪'
  },
  {
    label: 'Español',
    value: 'es-ES',
    icon: '🇪🇸'
  },
  {
    label: 'Русский',
    value: 'ru-RU',
    icon: '🇷🇺'
  }
]

// 验证语言包内容
const validateLanguagePack = (lang, pack) => {
  console.log(`[i18n] 开始验证语言包 ${lang}`)
  console.log(`[i18n] 语言包内容:`, pack)
  
  // 检查语言包是否为对象
  if (!pack || typeof pack !== 'object') {
    console.error(`[i18n] 语言包 ${lang} 无效:`, pack)
    return false
  }

  // 检查privacy部分
  if (!pack.privacy) {
    console.error(`[i18n] 语言包 ${lang} 缺少 privacy 部分`)
    return false
  }
  if (!pack.privacy.sections) {
    console.error(`[i18n] 语言包 ${lang} 缺少 privacy.sections 部分`)
    return false
  }
  console.log(`[i18n] 语言包 ${lang} 的 privacy.sections 结构:`, Object.keys(pack.privacy.sections))

  // 检查terms部分
  if (!pack.terms) {
    console.error(`[i18n] 语言包 ${lang} 缺少 terms 部分`)
    return false
  }
  if (!pack.terms.sections) {
    console.error(`[i18n] 语言包 ${lang} 缺少 terms.sections 部分`)
    return false
  }
  console.log(`[i18n] 语言包 ${lang} 的 terms.sections 结构:`, Object.keys(pack.terms.sections))

  // 验证sections的结构
  try {
    const privacySections = pack.privacy.sections
    const termsSections = pack.terms.sections

    // 验证privacy sections
    Object.entries(privacySections).forEach(([key, section]) => {
      if (!section || typeof section !== 'object') {
        throw new Error(`privacy.sections中的section无效: ${key}`)
      }
      if (!section.title || typeof section.title !== 'string') {
        throw new Error(`privacy.sections中的section缺少title: ${key}`)
      }
      if (!section.content || typeof section.content !== 'string') {
        throw new Error(`privacy.sections中的section缺少content: ${key}`)
      }
    })

    // 验证terms sections
    Object.entries(termsSections).forEach(([key, section]) => {
      if (!section || typeof section !== 'object') {
        throw new Error(`terms.sections中的section无效: ${key}`)
      }
      if (!section.title || typeof section.title !== 'string') {
        throw new Error(`terms.sections中的section缺少title: ${key}`)
      }
      if (!section.content || typeof section.content !== 'string') {
        throw new Error(`terms.sections中的section缺少content: ${key}`)
      }
    })
  } catch (error) {
    console.error(`[i18n] 语言包 ${lang} 的sections结构验证失败:`, error)
    return false
  }

  console.log(`[i18n] 语言包 ${lang} 验证通过`)
  return true
}

// 获取浏览器语言设置
const getBrowserLanguage = () => {
  try {
    const language = navigator.language || navigator.userLanguage
    console.log('[i18n] 浏览器语言:', language)
    // 检查是否支持当前语言
    const supportedLanguage = SUPPORT_LANGUAGES.find(lang => language.startsWith(lang.value))
    const result = supportedLanguage ? supportedLanguage.value : 'en-US'
    console.log('[i18n] 选择的语言:', result)
    return result
  } catch (e) {
    console.error('[i18n] 获取浏览器语言失败:', e)
    return 'en-US'
  }
}

// 获取存储的语言设置或使用浏览器语言
const getStoredLanguage = () => {
  try {
    const storedLang = localStorage.getItem('lang')
    console.log('[i18n] 存储的语言:', storedLang)
    if (storedLang && SUPPORT_LANGUAGES.some(lang => lang.value === storedLang)) {
      return storedLang
    }
    return getBrowserLanguage()
  } catch (e) {
    console.error('[i18n] 获取存储语言失败:', e)
    return 'en-US'
  }
}

// 准备语言包
console.log('[i18n] 开始准备语言包...')
const messages = {
  'zh-CN': zhCN,
  'zh': zhCN,
  'en-US': enUS,
  'fr-FR': frFR,
  'de-DE': deDE,
  'es-ES': esES,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'ru-RU': ruRU,
}

// 验证所有语言包
Object.entries(messages).forEach(([lang, pack]) => {
  console.log(`[i18n] 正在验证语言包 ${lang}...`)
  if (!validateLanguagePack(lang, pack)) {
    console.error(`[i18n] 语言包 ${lang} 验证失败，将使用默认语言包`)
    // 深拷贝默认语言包
    messages[lang] = JSON.parse(JSON.stringify(messages['zh-CN']))
  }
})

// 获取初始语言
const initialLocale = getStoredLanguage()
console.log('[i18n] 初始语言:', initialLocale)

// 创建i18n实例
const i18n = createI18n({
  legacy: true,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: {
    'en': ['en-US'],
    'default': ['en-US']
  },
  allowComposition: true,
  messages,
  missingWarn: true,
  fallbackWarn: true,
  silentFallbackWarn: false,
  formatFallbackMessages: true,
})

// 添加调试日志
console.log('[i18n] i18n实例创建完成')
console.log('[i18n] 当前语言:', i18n.global.locale)
console.log('[i18n] 可用语言包:', Object.keys(i18n.global.messages))

// 验证当前语言包是否可用
const currentLang = i18n.global.locale
const currentPack = i18n.global.messages[currentLang]
console.log('[i18n] 当前语言包内容:', {
  locale: currentLang,
  hasPrivacy: !!currentPack?.privacy,
  hasPrivacySections: !!currentPack?.privacy?.sections,
  hasTerms: !!currentPack?.terms,
  hasTermsSections: !!currentPack?.terms?.sections,
  privacySections: currentPack?.privacy?.sections ? Object.keys(currentPack.privacy.sections) : [],
  termsSections: currentPack?.terms?.sections ? Object.keys(currentPack.terms.sections) : []
})

// 添加全局方法用于检查翻译是否存在
i18n.global.hasTranslation = (key) => {
  const hasKey = i18n.global.te(key)
  console.log(`[i18n] 检查翻译键 ${key} 是否存在:`, hasKey)
  if (!hasKey) {
    console.log(`[i18n] 当前语言包中的可用键:`, Object.keys(i18n.global.messages[i18n.global.locale]))
    // 如果是嵌套键，逐层检查
    const keyParts = key.split('.')
    let currentObj = i18n.global.messages[i18n.global.locale]
    let currentPath = ''
    for (const part of keyParts) {
      currentPath = currentPath ? `${currentPath}.${part}` : part
      if (!currentObj || !currentObj[part]) {
        console.log(`[i18n] 键路径 ${currentPath} 不存在`)
        break
      }
      currentObj = currentObj[part]
      console.log(`[i18n] 键路径 ${currentPath} 存在:`, currentObj)
    }
  }
  return hasKey
}

// 添加安全检查以防止意外错误
try {
  const storedLang = localStorage.getItem('lang')
  if (storedLang && !Object.keys(i18n.global.messages).includes(storedLang)) {
    console.warn(`[i18n] 检测到无效的语言设置: ${storedLang}，重置为默认语言`)
    localStorage.setItem('lang', 'en-US')
    i18n.global.locale = 'en-US'
  }
  
  // 验证当前语言包
  if (!validateLanguagePack(currentLang, currentPack)) {
    console.error('[i18n] 当前语言包验证失败，切换到默认语言')
    // 深拷贝默认语言包
    i18n.global.messages[currentLang] = JSON.parse(JSON.stringify(messages['en-US']))
    i18n.global.locale = 'en-US'
  }
} catch (e) {
  console.error('[i18n] 初始化语言设置时出错:', e)
  try {
    localStorage.setItem('lang', 'en-US')
    // 确保使用默认语言包
    i18n.global.messages['en-US'] = enUS
    i18n.global.locale = 'en-US'
  } catch (storageError) {
    console.error('[i18n] 无法访问localStorage:', storageError)
  }
}

export default i18n 