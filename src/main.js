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


// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.component('tree-table',TreeTable)

Vue.filter('dataFormat',function (oldVal) {
    var dt=new Date(oldVal)

    // padStart是字符串方法补足，第一个参数是不足几位时，第二个参数是用什么补
    var y=dt.getFullYear()
    var m=(dt.getMonth()+1+'').padStart(2,'0')
    var d=(dt.getDate()+'').padStart(2,'0')
    var h=(dt.getHours()+'').padStart(2,'0')
    var mm=(dt.getMinutes()+'').padStart(2,'0')
    var ss=(dt.getSeconds()+'').padStart(2,'0')

    return `${y}-${m}-${d} ${h}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
