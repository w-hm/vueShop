<template>
    <div class="home">
        我是首页
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
    name:'home',
    data() {
        return {

        };
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
};
</script>
<style>
</style>