<template>
	<view class="profile-container">
		<!-- 用户信息区域 -->
		<view class="user-info-section">
			<view class="avatar-container">
				<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<text class="username">用户名</text>
				<text class="user-id">ID: 10001</text>
			</view>
		</view>
		
		<!-- 功能列表 -->
		<view class="function-list">
			<view class="list-item" @click="navigateTo('settings')">
				<text class="item-text">账号设置</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="list-item" @click="navigateTo('orders')">
				<text class="item-text">我的订单</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="list-item" @click="navigateTo('favorites')">
				<text class="item-text">我的收藏</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="list-item" @click="navigateTo('help')">
				<text class="item-text">帮助中心</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="list-item" @click="logout">
				<text class="item-text">退出登录</text>
				<text class="item-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			navigateTo(page) {
				// 这里可以根据不同页面进行跳转
				uni.showToast({
					title: `跳转到${page}页面`,
					icon: 'none'
				})
			},
			logout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							// 清除登录状态
							uni.removeStorageSync('token')
							uni.removeStorageSync('userInfo')
							
							// 跳转到登录页
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.profile-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 100rpx;
	}
	
	.user-info-section {
		background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
		padding: 60rpx 40rpx;
		display: flex;
		align-items: center;
		color: #ffffff;
	}
	
	.avatar-container {
		margin-right: 30rpx;
	}
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid #ffffff;
	}
	
	.user-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.username {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	
	.user-id {
		font-size: 28rpx;
		opacity: 0.9;
	}
	
	.function-list {
		margin-top: 20rpx;
		background: #ffffff;
	}
	
	.list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 40rpx;
		border-bottom: 1rpx solid #f0f0f0;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	
	.list-item:active {
		background-color: #f5f5f5;
	}
	
	.list-item:last-child {
		border-bottom: none;
	}
	
	.item-text {
		font-size: 32rpx;
		color: #333333;
	}
	
	.item-arrow {
		font-size: 40rpx;
		color: #999999;
	}
</style>