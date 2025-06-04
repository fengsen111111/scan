<script setup>
  import { login } from '@/api'
  import { ref } from 'vue'
  import router from '@/router' // 
  const account = ref('')
  const password = ref('')
  function _login() {
    if (!account.value) {
      message.error('请输入用户名')
      return false
    }
    if (!password.value) {
      message.error('请输入密码')
      return false
    }
    login({
      post_params: {
        account: account.value,
        password: password.value,
      }
    }).then((res) => {
      console.log('登录结果', res.data);
      localStorage.setItem('Authorization', res.data.token)//缓存token
      localStorage.setItem('store_name', res.data.store_name)//缓存用户名
      router.push('/')
    })
  }
</script>

<template>
  <div class="my-bg">
    <div class="a1">
      <!-- 你内容放这里 -->
      <div class="logo">
        <img src="@/assets/logo.png" style="width: 100%;height: 100%;" alt="">
      </div>
      <div class="right">
        <div style="font-size: 40px;">收银系统管理台</div>
        <div style="font-size: 20px;">CASHIER SYSTEM</div>
        <div style="margin-top: 30px;padding: 0px 60px;">
          <a-input v-model:value="account" placeholder="用户名" class="a3">
            <template #prefix>
              <img src="@/assets/user.png" class="icon" alt="">
            </template>
          </a-input>
        </div>
        <div style="margin-top: 40px;padding: 0px 60px;">
          <a-input-password v-model:value="password" placeholder="密码" class="a3">
            <template #prefix>
              <img src="@/assets/psw.png" class="icon" alt="">
            </template>
          </a-input-password>
        </div>
        <div class="a2">
          <div class="btn" @click="_login()"> 登录 </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .a3 {
    border-radius: 30px;
    padding: 15px 35px;
    background-color: #f5f5f5;
  }

  .icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .a2 {
    margin-top: 70px;
    padding: 0px 60px;
  }

  .btn {
    background-color: #0EB1F2;
    width: 450px;
    padding: 15px 35px;
    color: #fff;
    border-radius: 30px;
    font-size: 24px;
    letter-spacing: 20px;
    cursor: pointer;
  }

  .right {
    text-align: center;
    margin: 40px 0px;
  }

  .logo {
    width: 500px;
    height: 500px;
  }

  .a1 {
    width: 1200px;
    height: 600px;
    background-color: #fff;
    border-radius: 10px;
    display: flex;
    padding: 50px;
  }

  .my-bg {
    background-image: url('@/assets/bg.png');
    background-size: 100% 100%;
    height: 100vh;
    width: 100vw;

    /* 新增：让子元素水平垂直居中 */
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
  }

  ::v-deep(.ant-input) {
    background-color: #f5f5f5 !important;
    border: none !important;
    font-size: 18px !important;
  }
</style>