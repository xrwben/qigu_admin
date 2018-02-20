/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import { Loading, Message } from 'element-ui'
// 超时时间
// axios.defaults.timeout = 10000

// http请求拦截器
var loadinginstace
let httpUrl = '/keygood/admin/sysuser/login'
axios.interceptors.request.use(
  config => {
    if (httpUrl.indexOf(config.url) > -1) {
      return config
    } else {
      // element ui Loading方法
      loadinginstace = Loading.service({
        fullscreen: true,
        text: '正在加载中'
      })
      return config
    }
  },
  error => {
    loadinginstace.close()
    Message.error({
      message: '加载超时'
    })
    return Promise.reject(error)
  })

// http响应拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response.config.url)
    if (httpUrl.indexOf(response.config.url) > -1) {
      return response
    } else {
      loadinginstace.close() // 响应成功关闭loading
      if (response.data.code === 401) {
        window.location.href = ('/login')
      }
      return response
    }
  },
  error => {
    console.log(error.response.data)
    // loadinginstace.close()
    if (error.response.data.code === 401) {
      window.location.href = ('/login')
    } else {
      Message.error({
        message: error.response.data.msg || '服务器异常'
      })
      loadinginstace.close()
    }
    return Promise.reject(error)
  })

export default axios
