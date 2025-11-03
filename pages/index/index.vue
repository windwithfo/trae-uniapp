<template>
	<view class="content">
		<view class="list-header">
			<text class="title">{{title}}</text>
		</view>
		
		<uni-list>
			<uni-swipe-action 
				v-for="(item, index) in listData" 
				:key="item.id"
				:show="swipeIndex === index"
				@change="swipeChange"
				@click="handleClick(index)"
				@longpress="handleLongPress(index)"
			>
				<uni-swipe-action-item :options="options" @click="onClickItem"></uni-swipe-action-item>
				
				<uni-list-item 
					:title="item.title"
					:note="item.content"
					:show-checkmark="showCheckbox"
					:checked="item.checked"
					@click="handleCheck(index)"
				>
				</uni-list-item>
			</uni-swipe-action>
		</uni-list>
		
		<!-- 底部批量删除按钮 -->
		<view class="bottom-bar" v-if="showBottomBar">
			<text class="selected-count">已选择{{selectedCount}}项</text>
			<button class="delete-btn" @click="batchDelete">批量删除</button>
			<button class="cancel-btn" @click="cancelBatch">取消</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '列表首页',
				listData: [
					{ id: 1, title: '列表项1', content: '这是列表项1的内容', checked: false },
					{ id: 2, title: '列表项2', content: '这是列表项2的内容', checked: false },
					{ id: 3, title: '列表项3', content: '这是列表项3的内容', checked: false },
					{ id: 4, title: '列表项4', content: '这是列表项4的内容', checked: false },
					{ id: 5, title: '列表项5', content: '这是列表项5的内容', checked: false }
				],
				swipeIndex: -1, // 当前展开的滑动项索引
				showCheckbox: false, // 是否显示复选框
				showBottomBar: false, // 是否显示底部批量删除栏
				options: [ // 左滑操作按钮
					{
						text: '删除',
						style: {
							backgroundColor: '#FF4D4F',
							color: '#fff'
						}
					}
				]
			}
		},
		computed: {
			// 计算选中的项目数量
			selectedCount() {
				return this.listData.filter(item => item.checked).length
			}
		},
		onLoad() {

		},
		methods: {
			// 滑动状态变化
			swipeChange(e) {
				this.swipeIndex = e.show ? e.index : -1
			},
			// 点击列表项
			handleClick(index) {
				// 如果显示复选框，则切换选中状态
				if (this.showCheckbox) {
					this.handleCheck(index)
				} else {
					// 否则执行点击操作
					uni.showToast({
						title: `点击了第${index + 1}项`,
						icon: 'none'
					})
				}
			},
			// 长按列表项
			handleLongPress(index) {
				// 显示复选框和底部批量删除栏
				this.showCheckbox = true
				this.showBottomBar = true
				// 选中当前项
				this.listData[index].checked = true
			},
			// 切换选中状态
			handleCheck(index) {
				this.listData[index].checked = !this.listData[index].checked
				// 如果没有选中任何项，隐藏底部批量删除栏
				if (this.selectedCount === 0) {
					this.showBottomBar = false
				}
			},
			// 左滑操作按钮点击
			onClickItem(e) {
				const { index } = e
				// 删除当前项
				this.listData.splice(index, 1)
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
				// 关闭滑动操作
				this.swipeIndex = -1
			},
			// 批量删除
			batchDelete() {
				// 删除选中的项
				this.listData = this.listData.filter(item => !item.checked)
				uni.showToast({
					title: `删除了${this.selectedCount}项`,
					icon: 'success'
				})
				// 隐藏复选框和底部批量删除栏
				this.showCheckbox = false
				this.showBottomBar = false
			},
			// 取消批量操作
			cancelBatch() {
				// 取消所有选中状态
				this.listData.forEach(item => {
					item.checked = false
				})
				// 隐藏复选框和底部批量删除栏
				this.showCheckbox = false
				this.showBottomBar = false
			}
		}
	}
</script>

<style scoped>
	.content {
		min-height: 100vh;
		background-color: #f5f7fa;
	}

	.list-header {
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 1px solid #e8e8e8;
	}

	.title {
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
	}

	/* 列表项样式 */
	.uni-list-item {
		background-color: #fff;
		border-radius: 10rpx;
		margin: 20rpx 30rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	/* 滑动操作按钮样式 */
	.uni-swipe-action__content {
		background-color: #fff;
	}

	.uni-swipe-action-item {
		height: 100%;
	}

	/* 底部批量删除栏样式 */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 88rpx;
		background-color: #fff;
		border-top: 1px solid #e8e8e8;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.selected-count {
		font-size: 28rpx;
		color: #333;
	}

	.delete-btn {
		width: 200rpx;
		height: 60rpx;
		background-color: #ff4d4f;
		color: #fff;
		border: none;
		border-radius: 30rpx;
		font-size: 28rpx;
	}

	.cancel-btn {
		width: 200rpx;
		height: 60rpx;
		background-color: #fff;
		color: #333;
		border: 1px solid #e8e8e8;
		border-radius: 30rpx;
		font-size: 28rpx;
	}
</style>
