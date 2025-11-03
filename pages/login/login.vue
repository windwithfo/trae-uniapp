<template>
  <view class="login-container">
    <view class="login-header">
      <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
      <text class="title">欢迎登录</text>
    </view>
    
    <view class="login-form">
      <uni-forms ref="loginFormRef" :modelValue="loginForm" :rules="rules">
        <uni-forms-item name="username">
          <uni-easyinput 
            v-model="loginForm.username" 
            prefixIcon="person" 
            placeholder="请输入账号"
            :inputBorder="false"
            :clearable="true"
          />
        </uni-forms-item>
        
        <uni-forms-item name="password">
          <uni-easyinput 
            v-model="loginForm.password" 
            prefixIcon="locked" 
            placeholder="请输入密码"
            type="password"
            :inputBorder="false"
            :clearable="true"
          />
        </uni-forms-item>
      </uni-forms>
      
      <button class="login-btn" @click="handleLogin" :loading="loading">
        登录
      </button>
      
      <view class="login-options">
        <text class="option-text" @click="handleForgotPassword">忘记密码？</text>
        <text class="option-text" @click="handleRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const loginForm = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const loginFormRef = ref(null)

const rules = {
  username: {
    rules: [
      { required: true, errorMessage: '请输入账号' },
      { minLength: 3, errorMessage: '账号长度不能少于3位' }
    ]
  },
  password: {
    rules: [
      { required: true, errorMessage: '请输入密码' },
      { minLength: 6, errorMessage: '密码长度不能少于6位' }
    ]
  }
}

const handleLogin = async () => {
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 保存用户信息到store
      store.dispatch('login', { username: loginForm.username })
      
      // 跳转到首页
      uni.switchTab({
        url: '/pages/index/index'
      })
      
      loading.value = false
    }, 1500)
    
  } catch (error) {
    console.error('登录失败:', error)
    loading.value = false
  }
}

const handleForgotPassword = () => {
  uni.showToast({
    title: '忘记密码功能开发中',
    icon: 'none'
  })
}

const handleRegister = () => {
  uni.showToast({
    title: '注册功能开发中',
    icon: 'none'
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 40rpx;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 80rpx;
  text-align: center;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 30rpx;
  display: block;
}

.title {
  font-size: 48rpx;
  color: #ffffff;
  font-weight: bold;
}

.login-form {
  width: 100%;
  max-width: 600rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: #ffffff;
  border: none;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(24, 144, 255, 0.4);
}

.login-btn:active {
  opacity: 0.8;
}

.login-options {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.option-text {
  font-size: 28rpx;
  color: #1890ff;
  text-decoration: underline;
}

// 表单样式调整
:deep(.uni-forms-item) {
  margin-bottom: 40rpx;
  width: 100%;
}

:deep(.uni-easyinput) {
  background: #f0f7ff;
  border-radius: 12rpx;
  padding: 20rpx;
  border: 1px solid #1890ff;
  width: 100% !important;
  box-sizing: border-box !important;
}

:deep(.uni-easyinput__content-input) {
  color: #1890ff;
}
</style>