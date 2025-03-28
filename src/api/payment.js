// @ts-check
import axios from 'axios'
import request from '../utils/request'
// 导入用户store以获取当前登录用户ID
import { useUserStore } from '../stores/user'

// 注释掉直接调用Creem API的客户端
// const creemApi = axios.create({
//   baseURL: 'https://api.creem.io/v1',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//     'x-api-key': 'creem_123456789' // 替换为您的Creem API密钥
//   }
// })

/**
 * 创建Creem结账会话
 * @param {Object} data - 支付数据
 * @param {string} data.productId - Creem产品ID
 * @param {string} [data.requestId] - 请求ID，用于跟踪支付
 * @param {string} [data.successUrl] - 支付成功后的跳转URL
 * @param {string} [data.cancelUrl] - 支付取消后的跳转URL
 * @param {Object} [data.metadata] - 元数据
 * @returns {Promise<{checkoutUrl: string, checkoutId: string}>} 结账URL和会话ID
 */
export function createCheckoutSession(data) {
  // 改为调用本地后端API，由后端转发请求到Creem API
  return request({
    url: '/api/payment/checkout/create',
    method: 'post',
    data
  })
}

/**
 * 验证支付状态
 * @param {Object} params - 参数
 * @param {string} params.checkout_id - 结账会话ID
 * @param {string} params.order_id - 订单ID
 * @param {string} params.signature - Creem签名
 * @returns {Promise<{status: string, order_id: string, product_id: string, amount: string}>} 订单详情
 */
export function verifyPaymentStatus(params) {
  return request({
    url: '/api/payment/verify',
    method: 'get',
    params
  })
}

/**
 * 查询用户订阅状态
 * @returns {Promise<any>} 订阅信息
 */
export function getUserSubscription() {
  // 获取当前登录用户ID
  const userStore = useUserStore()
  const userId = userStore.user?.id ? String(userStore.user.id) : null
  
  console.log('请求用户订阅信息，用户ID:', userId)
  
  return request({
    url: '/api/payment/subscriptions',
    method: 'get',
    params: { userId }
  }).then(response => {
    console.log('订阅API原始响应:', response)
    return response
  }).catch(error => {
    console.error('订阅API请求失败:', error)
    throw error
  })
}

/**
 * 取消用户订阅
 * @param {string} subscription_id - 订阅ID
 * @returns {Promise<{success: boolean, message: string}>} 取消结果
 */
export function cancelSubscription(subscription_id) {
  return request({
    url: '/api/subscription/cancel',
    method: 'post',
    data: { subscription_id }
  })
} 