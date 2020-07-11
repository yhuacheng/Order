import axios from 'axios'
import router from '../router/index.js'
import store from '../components/store/store'

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
    //     querry: {redirect: router.currentRoute.fullPath} // 从哪个页面跳转
    //   })
    // }
    const userId = store.state.userId;
    userId && (config.headers.Authorization = userId);
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          store.commit(types.LOGOUT)

          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'index' &&
          router.replace({
            path: 'index',
            query: { redirect: router.currentRoute.path }
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)
// 封装get
export function getAction(url, params){
    return new Promise((resolve, reject) =>{
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res);
        }).catch(err =>{
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
