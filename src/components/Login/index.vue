<template>
  <div class="login">
    <div class="login-box">
        <div class="login-box-header">
            <img src="../../assets/imgs/img1.jpeg"
                alt="">
        </div>
        <div class="login-box-form">
            <el-form ref="loginFormRef"
                    :model="loginForm"
                    :rules="loginFormRules">
            <el-form-item prop="username">
                <el-input prefix-icon="el-icon-user-solid"
                        v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input prefix-icon="el-icon-lock"
                        type="password"
                        v-model="loginForm.password"></el-input>
            </el-form-item>
            </el-form>

            <div class="d-f ai-c jc-e">
            <el-button type="primary"
                        @click="login">登录</el-button>
            <el-button type="info"
                        @click="resetCon">重置</el-button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted(){
  },
  methods: {
    login() {
        this.$refs.loginFormRef.validate((val) => {

                // 验证表单所有信息，如果不通过则不能执行下面代码
                if (!val) return;

                this.$http.post("login", this.loginForm).then((res) => {
                    // console.log(res.data)
                if (res.data.meta.status !== 200) return  this.$message.error({
                    message:'登陆失败',
                    center:true
                }) 
                
                this.$message.success({
                    message:'登录成功',
                    center:true
                })

                // 存储token
                window.sessionStorage.setItem('token',res.data.data.token)
                this.$router.push('/home')
            });
        });
    },
    resetCon() {
      this.$refs.loginFormRef.resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.login {
  height: 100%;

  &-box {
    width: 500px;
    height: 350px;
    padding: 0 30px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.3);
    border-radius: 10px;

    &-header {
      padding: 8px;
      border-radius: 50%;
      width: 130px;
      height: 130px;
      box-shadow: 0 0 20px 5px rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -30%);
      background-color: #fff;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        -webkit-user-drag: none;
        user-select: none;
      }
    }

    &-form {
      margin-top: 150px;
    }
  }
}
</style>