<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
			<text class="username" v-if="userInfo">欢迎, {{userInfo.username}}</text>
		</view>
		<button class="logout-btn" v-if="userInfo" @click="handleLogout">
			登出
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '首页',
				userInfo: null
			}
		},
		onLoad() {
			// 获取用户信息
			this.userInfo = this.$store.getters.getUserInfo
		},
		onShow() {
			// 页面显示时更新用户信息
			this.userInfo = this.$store.getters.getUserInfo
		},
		methods: {
			// 登出
			handleLogout() {
				this.$store.dispatch('logout')
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.username {
		font-size: 32rpx;
		color: #1890ff;
		margin-top: 20rpx;
	}

	.logout-btn {
		width: 200rpx;
		height: 60rpx;
		background-color: #ff4d4f;
		color: white;
		border: none;
		border-radius: 30rpx;
		margin-top: 40rpx;
		font-size: 28rpx;
	}

	.logout-btn:active {
		opacity: 0.8;
	}
</style>
