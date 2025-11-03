// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// #endif

// #ifdef VUE3
import { createStore } from 'vuex'
// #endif

let logoutTimer = null

const store = (
  // #ifndef VUE3
  new Vuex.Store(
  // #endif
  // #ifdef VUE3
  createStore(
  // #endif
  {
    state: {
      userInfo: null, // 用户信息存储
      loginTime: null // 登录时间戳
    },
    mutations: {
      // 设置用户信息
      setUserInfo(state, userInfo) {
        state.userInfo = userInfo
        state.loginTime = Date.now()
      },
      // 清除用户信息
      clearUserInfo(state) {
        state.userInfo = null
        state.loginTime = null
      }
    },
    actions: {
      // 登录操作
      login({ commit }, userInfo) {
        // 清除之前的定时器
        if (logoutTimer) {
          clearTimeout(logoutTimer)
          logoutTimer = null
        }
        
        // 保存用户信息
        commit('setUserInfo', userInfo)
        
        // 设置2分钟后自动登出
        logoutTimer = setTimeout(() => {
          commit('clearUserInfo')
          logoutTimer = null
          
          // 跳转到登录页
          uni.redirectTo({
            url: '/pages/login/login'
          })
          
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          })
        }, 120000) // 2分钟 = 120000毫秒
      },
      // 登出操作
      logout({ commit }) {
        if (logoutTimer) {
          clearTimeout(logoutTimer)
          logoutTimer = null
        }
        
        commit('clearUserInfo')
        
        // 跳转到登录页
        uni.redirectTo({
          url: '/pages/login/login'
        })
      },
      // 检查登录状态是否过期
      checkLoginStatus({ state, commit }) {
        if (!state.userInfo || !state.loginTime) {
          return false
        }
        
        // 计算登录是否超过2分钟
        const now = Date.now()
        const elapsed = now - state.loginTime
        
        if (elapsed > 120000) {
          commit('clearUserInfo')
          return false
        }
        
        return true
      }
    },
    getters: {
      // 获取用户信息
      getUserInfo: state => state.userInfo,
      // 判断是否已登录
      isLoggedIn: state => !!state.userInfo,
      // 获取登录时间
      getLoginTime: state => state.loginTime
    }
  }
  // #ifndef VUE3
  )
  // #endif
  // #ifdef VUE3
  )
  // #endif
)

export default store