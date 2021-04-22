import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$http=axios

axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"

// 请求拦截器，每次发送请求都要再header里面添加一个属性并携带token
axios.interceptors.request.use(config=>{

        config.headers.Authorization=window.sessionStorage.getItem('token')

    return config
},error => {
    return Promise.reject();
})

// 响应拦截器
axios.interceptors.response.use(
    response=>{
        return response.data
    }, error => {
         return Promise.reject();
    })
