// src/utils/request.js
import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router' // 需要你使用 vue-router，并配置 login 页面

const baseUrl = 'https://food.wechat.sczhiyun.net' // 正式地址
// const baseUrl = 'https://test.api.xzddd.com' // 测试地址

const service = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('Authorization')
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { status, data } = response
    if (status !== 200) {
      message.error(data.message || '服务异常')
      return Promise.reject(data.message || '服务异常')
    }
    const { code, message: msg } = data
    switch (code) {
      case 1:
        return data
      case -1:
        message.warning('登录已过期，请重新登录')
        localStorage.removeItem('token')
        setTimeout(() => {
          router.push('/login')
        }, 1000)
        return Promise.reject('未登录')
      case -2:
        message.error('账号被禁用，请联系管理员')
        break
      case -3:
        message.error('没有操作权限')
        break
      case -999:
        message.warning(msg || '警告信息')
        break
      case 0:
        message.error(msg || '操作失败')
        break
      default:
        message.error(msg || '未知错误')
        break
    }
    return Promise.reject(msg || '接口错误')
  },
  (error) => {
    console.log('响应失败', error)
    message.error(error.response?.data?.message || '网络异常')
    return Promise.reject(error)
  }
)

export default service
