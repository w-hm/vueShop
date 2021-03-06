import Vue from 'vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        redirect:'/login'
    },
    {
        path:'/login',
        component:()=>import('../components/Login')
    },
    {
        path:'/home',
        component:()=>import('../views/Home'),
        redirect:'/welcome',
        children:[
            {path:'/welcome',component:()=>import('../views/Welcome')},
            {path:'/users',component:()=>import('../views/Users')},
            {path:'/rights',component:()=>import('../views/Power')},
            {path:'/roles',component:()=>import('../views/Power/roles')},
            {path:'/categories',component:()=>import('../views/Goods/cate')},
            {path:'/params',component:()=>import('../views/Goods/params')},
            {path:'/goods',component:()=>import('../views/Goods/list')},
            {path:'/goods/add',component:()=>import('../views/Goods/add')},
            {path:'/orders',component:()=>import('../views/Order/order')},
            {path:'/reports',component:()=>import('../views/Report/report')},
        ]
    },
    
]


const router = new VueRouter({
  routes
})

// 路由守卫，判断去其他页面时候有没有携带token，没有就跳转登录页，有就可以跳转
router.beforeEach((to, from, next)=>{
    if(to.path ==='/login') return next()
    const tokenStr=window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
})
export default router
