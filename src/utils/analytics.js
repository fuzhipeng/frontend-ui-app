// Google Analytics 工具函数

/**
 * 跟踪页面访问
 * @param {string} pagePath - 页面路径
 * @param {string} pageTitle - 页面标题
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

/**
 * 跟踪用户事件
 * @param {string} eventName - 事件名称
 * @param {Object} eventParams - 事件参数
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * 跟踪用户点击
 * @param {string} elementName - 元素名称
 * @param {string} elementType - 元素类型
 * @param {Object} additionalParams - 额外参数
 */
export const trackClick = (elementName, elementType, additionalParams = {}) => {
  trackEvent('click', {
    element_name: elementName,
    element_type: elementType,
    ...additionalParams
  });
};

/**
 * 跟踪表单提交
 * @param {string} formName - 表单名称
 * @param {boolean} success - 是否成功
 * @param {Object} additionalParams - 额外参数
 */
export const trackFormSubmit = (formName, success, additionalParams = {}) => {
  trackEvent('form_submit', {
    form_name: formName,
    success: success,
    ...additionalParams
  });
};

/**
 * 跟踪错误
 * @param {Error} error - 错误对象
 * @param {string} context - 错误上下文
 */
export const trackError = (error, context) => {
  trackEvent('error', {
    error_message: error.message,
    error_stack: error.stack,
    context: context
  });
};

/**
 * 跟踪用户会话
 * @param {string} userId - 用户ID
 * @param {Object} userProperties - 用户属性
 */
export const trackUserSession = (userId, userProperties = {}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('set', 'user_id', userId);
    window.gtag('set', userProperties);
  }
}; 