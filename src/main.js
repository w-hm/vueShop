import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import "./assets/style/css/common.css"

// 解决级联选择器样式问题
import 'element-ui/lib/theme-chalk/index.css'

// axios
import "./netWork/http.js"

// vue树形表格
import TreeTable from "vue-table-with-tree-grid"

Vue.component('tree-table',TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
