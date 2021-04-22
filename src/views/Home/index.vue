<template>
    <div class="home">
        <el-container class="home-con">
            <el-header>
                <div class="d-f ai-c jc-sb ">
                    <div class="d-f ai-c">
                        <img src="../../assets/imgs/heima.png" alt="">
                        <span>电商后台管理系统</span>
                    </div>
                    <el-button type="info" @click="logout">退出</el-button>
                </div>
            </el-header>
            <el-container>
                <el-aside :width="toggleMenu?'64px':'200px'">
                    <div class="home-toggle" @click="toggleMenu=!toggleMenu" :class="{'textRotate':toggleMenu}">
                        <span>|||</span>
                    </div>
                    <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409EFF"
                        unique-opened
                        :collapse="toggleMenu"
                        :collapse-transition="false"
                        router
                        :default-active="'/'+hightLight">
                            <el-submenu :index="menu.id+''" v-for="menu in menuList" :key="menu.id">
                                <template slot="title">
                                    <i :class="menuIcon[menu.id]"></i>
                                    <span>{{menu.authName}}</span>
                                </template>
                                <el-menu-item 
                                    :index="'/'+submenu.path" 
                                    v-for="submenu in menu.children" :key="submenu.id"
                                    @click="activeColor(submenu.path)">
                                    <i class="el-icon-menu"></i>
                                    {{submenu.authName}}
                                </el-menu-item>
                            </el-submenu>
                        </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name:'home',
    data() {
        return {
            menuList:[],
            menuIcon:{
                '125':'iconfont el-icon-user-solid',
                '103':'iconfont el-icon-share',
                '101':'iconfont el-icon-shopping-cart-1',
                '102':'iconfont el-icon-s-order',
                '145':'iconfont el-icon-s-data',
            },
            toggleMenu:false,
            hightLight:''
        };
    },
    mounted(){
        this.getMenuList();
        this.hightLight=window.sessionStorage.getItem('activeColor')
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取左侧菜单栏
        getMenuList(){
            this.$http.get('menus').then(res=>{

                this.menuList=res.data

                // console.log(this.menuList)
            })
        },

        // 设置高亮，存储当前高亮选项
        activeColor(path){
            window.sessionStorage.setItem('activeColor',path);
            this.hightLight=path
        }
    }
};
</script>
<style lang="less" scoped>
    .home{
            height: 100%;
        &-con{
            height: 100%;
        }
        .el-header{
            background-color: #373d41;
            font-size: 20px;
            color: #fff;
            span{
                margin-left: 20px;
            }
        }
        .el-aside{
            background-color: #333744;
        }
        .el-main{
            background-color: #eaedf1;
        }
        .el-menu{
            border-right: none;
        }
        .iconfont{
            margin-right: 10px;
            font-size: 20px;
        }
        &-toggle{
            line-height: 30px;
            font-size: 16px;
            color:#fff;
            letter-spacing: 0.2em;
            text-align: center;
            background-color: #5e5756;
            cursor: pointer;
            >span{
                display: block;
                transition: all  .2s;
            }
        }
        &-toggle.textRotate{
            >span{
                display: block;
                transform: rotate(90deg);
            }
        }
    }
</style>