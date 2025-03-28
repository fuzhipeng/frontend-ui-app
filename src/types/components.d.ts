declare module '@/components/*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/i18n' {
  export const SUPPORT_LANGUAGES: { label: string; value: string }[]
}

// 扩展ImportMeta接口
interface ImportMetaEnv {
  VITE_API_BASE_URL: string
  [key: string]: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 