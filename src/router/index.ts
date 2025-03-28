import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import Home from '../pages/home/index.vue'
import Privacy from '../views/Privacy.vue'
import Terms from '../views/Terms.vue'

// 添加调试日志
console.log('正在加载路由配置...')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../pages/settings/index.vue'),
        meta: {
          requiresAuth: true,
          title: '设置 - IntroCard AI'
        }
      }
    ]
  },
  // 添加价格页面路由
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('../pages/pricing/index.vue'),
    meta: {
      title: '价格套餐 - IntroCard AI'
    }
  },
  // 添加错误页面路由
  {
    path: '/error',
    name: 'error',
    component: () => import('../pages/error/index.vue'),
    meta: {
      title: '出错了 - IntroCard AI'
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms
  },
  // 捕获所有未匹配路由
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  console.log('路由守卫触发:', {
    to: to.path,
    from: from.path,
    toName: to.name,
    fromName: from.name,
    isAuthenticated: userStore.isAuthenticated,
    requiresAuth: to.meta.requiresAuth,
    meta: to.meta
  })
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    console.log('未登录，重定向到首页')
    next('/')
  } else {
    console.log('允许导航到:', to.path)
    next()
  }
})

// 添加路由变化监听
router.afterEach((to, from) => {
  console.log('路由变化完成:', {
    from: from.path,
    to: to.path
  })
})

// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  // 如果是组件加载失败，可以重定向到错误页面
  if (error.message.includes('Failed to load module') || error.message.includes('Failed to fetch dynamically imported module')) {
    router.push('/error?message=' + encodeURIComponent('页面加载失败，请刷新重试'))
  }
})

export default router 