import axios from 'axios'
import router from '../router/index.js'
import store from '../components/store/store'
import qs from 'qs'
import Vue from 'vue'

import {
  Message,
  Loading
} from 'element-ui';

let loading; //定义loading变量

function startLoading() { //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '请稍候',
    background: 'rgba(0, 0, 0, 0.3)'
  })
}

function endLoading() { //使用Element loading-close 方法
  loading.close()
}
//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://203.195.212.239/' // 测试接口
} else {
  axios.defaults.baseURL = '/api'
}
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(
  config => {
    // if (!config.data.errCode) {
    //   router.push({
    //     path: '/index',
    //     querry: {redirect: router.currentRoute.fullPath} //从哪个页面跳转
    //   })
    // }
    const userId = store.state.userId;
    userId && (config.headers.Authorization = userId);

    //显示等待框
    showFullScreenLoading();

    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {

    //隐藏等待框
    tryHideFullScreenLoading()

    return response
  },
  error => {

    //隐藏等待框
    tryHideFullScreenLoading()

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)

          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'index' &&
            router.replace({
              path: 'index',
              query: {
                redirect: router.currentRoute.path
              }
            })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)
// 封装get
export function getAction(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err)
    })
  });
};
export function get(url, parameter) {
  return axios({
    url: url,
    method: 'get',
    params: parameter
  })
}
// 封装post
export function post(url, parameter) {
  return axios({
    url: url,
    method: 'post',
    data: parameter
  })
}
export default axios
