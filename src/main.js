import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import "./assets/style/css/common.css"

import axios from 'axios'
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
Vue.prototype.$http=axios

// 拦截器，每次发送请求都要再header里面添加一个属性并携带token
axios.interceptors.request.use(config=>{
    config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
