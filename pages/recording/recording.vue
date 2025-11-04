<template>
	<view class="recording-container">
		<!-- 录音状态显示区域 -->
		<view class="recording-status">
			<view class="sound-bars" v-if="isRecording">
				<view 
					class="sound-bar" 
					v-for="(bar, index) in soundBars" 
					:key="index"
					:style="{ height: bar.height + 'rpx', animationDelay: bar.delay + 's' }"
				></view>
			</view>
			<text class="status-text" v-if="isRecording">录音中...</text>
			<text class="status-text" v-else-if="recordedFile">录音完成</text>
			<text class="status-text" v-else>准备录音</text>
		</view>

		<!-- 录音控制按钮 -->
		<view class="control-buttons">
			<!-- 开始录音按钮 -->
			<view 
				class="record-button"
				@touchstart="startRecording"
				@touchend="stopRecording"
				@touchmove.prevent
				v-if="!isRecording && !recordedFile"
			>
				<view class="record-icon"></view>
				<text class="button-text">按住录音</text>
			</view>

			<!-- 录音中按钮 -->
			<view 
				class="recording-button"
				v-if="isRecording"
			>
				<view class="recording-icon"></view>
				<text class="button-text">松开结束</text>
			</view>

			<!-- 录音完成后的操作按钮 -->
			<view class="completed-buttons" v-if="recordedFile">
				<button class="play-button" @click="playRecording">
					<text>{{ isPlaying ? '暂停播放' : '播放录音' }}</text>
				</button>
				<button class="re-record-button" @click="reRecord">
					<text>重新录音</text>
				</button>
				<button class="clear-button" @click="clearRecording">
					<text>清空录音</text>
				</button>
			</view>
		</view>

		<!-- 录音文件信息显示 -->
		<view class="recording-info" v-if="recordedFile">
			<text class="info-text">录音时长: {{ recordingDuration }}秒</text>
			<text class="info-text">文件大小: {{ fileSize }}</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isRecording: false,
			recordedFile: null,
			isPlaying: false,
			recordingDuration: 0,
			fileSize: '',
			soundBars: [
				{ height: 20, delay: 0 },
				{ height: 40, delay: 0.1 },
				{ height: 60, delay: 0.2 },
				{ height: 80, delay: 0.3 },
				{ height: 100, delay: 0.4 }
			],
			recorderManager: null,
			innerAudioContext: null,
			recordingStartTime: 0
		}
	},
	mounted() {
		// 初始化录音管理器
		this.recorderManager = uni.getRecorderManager();
		this.innerAudioContext = uni.createInnerAudioContext();
		
		// 录音开始事件
		this.recorderManager.onStart(() => {
			console.log('录音开始');
			this.recordingStartTime = Date.now();
			this.startDurationTimer();
		});
		
		// 录音停止事件
		this.recorderManager.onStop((res) => {
			console.log('录音停止', res);
			this.isRecording = false;
			this.recordedFile = res.tempFilePath;
			this.recordingDuration = Math.round((Date.now() - this.recordingStartTime) / 1000);
			this.fileSize = this.formatFileSize(res.fileSize);
			this.stopDurationTimer();
		});
		
		// 录音错误事件
		this.recorderManager.onError((err) => {
			console.error('录音错误:', err);
			this.isRecording = false;
			uni.showToast({
				title: '录音失败',
				icon: 'none'
			});
		});
		
		// 音频播放结束事件
		this.innerAudioContext.onEnded(() => {
			this.isPlaying = false;
		});
		
		// 音频播放错误事件
		this.innerAudioContext.onError((err) => {
			console.error('播放错误:', err);
			this.isPlaying = false;
			uni.showToast({
				title: '播放失败',
				icon: 'none'
			});
		});
	},
	onHide() {
		// 应用进入后台时停止录音
		if (this.isRecording) {
			this.recorderManager.stop();
		}
		// 应用进入后台时停止播放
		if (this.isPlaying) {
			this.innerAudioContext.stop();
			this.isPlaying = false;
		}
	},
	beforeDestroy() {
		// 清理资源
		if (this.recorderManager) {
			this.recorderManager.stop();
		}
		if (this.innerAudioContext) {
			this.innerAudioContext.stop();
			this.innerAudioContext.destroy();
		}
		// 清理计时器
		this.stopDurationTimer();
	},
	methods: {
		// 开始录音
		startRecording() {
			if (this.isRecording) return;
			
			// 检查权限
			uni.authorize({
				scope: 'scope.record',
				success: () => {
					this.isRecording = true;
					this.recorderManager.start({
						duration: 60000, // 最大录音时长60秒
						sampleRate: 8000,
						numberOfChannels: 1,
						encodeBitRate: 24000,
						format: 'mp3'
					});
				},
				fail: () => {
					uni.showModal({
						title: '提示',
						content: '需要授权录音权限才能使用录音功能',
						showCancel: false
					});
				}
			});
		},
		
		// 停止录音
		stopRecording() {
			if (!this.isRecording) return;
			this.recorderManager.stop();
		},
		
		// 播放录音
		playRecording() {
			if (!this.recordedFile) return;
			
			if (this.isPlaying) {
				this.innerAudioContext.pause();
				this.isPlaying = false;
			} else {
				this.innerAudioContext.src = this.recordedFile;
				this.innerAudioContext.play();
				this.isPlaying = true;
			}
		},
		
		// 重新录音
		reRecord() {
			this.recordedFile = null;
			this.recordingDuration = 0;
			this.fileSize = '';
			this.isPlaying = false;
		},
		
		// 清空录音
		clearRecording() {
			this.recordedFile = null;
			this.recordingDuration = 0;
			this.fileSize = '';
			if (this.isPlaying) {
				this.innerAudioContext.stop();
				this.isPlaying = false;
			}
			uni.showToast({
				title: '已清空录音',
				icon: 'success'
			});
		},
		
		// 格式化文件大小
		formatFileSize(bytes) {
			if (bytes === 0) return '0 B';
			const k = 1024;
			const sizes = ['B', 'KB', 'MB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},
		
		// 开始录音时长计时器
		startDurationTimer() {
			this.durationTimer = setInterval(() => {
				this.recordingDuration = Math.round((Date.now() - this.recordingStartTime) / 1000);
			}, 1000);
		},
		
		// 停止录音时长计时器
		stopDurationTimer() {
			if (this.durationTimer) {
				clearInterval(this.durationTimer);
				this.durationTimer = null;
			}
		}
	}
}
</script>

<style scoped>
.recording-container {
	min-height: 100vh;
	background-color: #f5f7fa;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx;
}

.recording-status {
	width: 100%;
	height: 300rpx;
	background-color: #fff;
	border-radius: 20rpx;
	margin-bottom: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.sound-bars {
	display: flex;
	align-items: flex-end;
	justify-content: center;
	margin-bottom: 20rpx;
	height: 120rpx;
}

.sound-bar {
	width: 8rpx;
	background-color: #1890ff;
	margin: 0 4rpx;
	border-radius: 4rpx;
	animation: soundWave 1s ease-in-out infinite;
}

@keyframes soundWave {
	0%, 100% {
		height: 20rpx;
	}
	50% {
		height: 100rpx;
	}
}

.status-text {
	font-size: 32rpx;
	color: #666;
	margin-top: 20rpx;
}

.control-buttons {
	width: 100%;
	margin-bottom: 40rpx;
}

.record-button {
	width: 200rpx;
	height: 200rpx;
	background-color: #1890ff;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	transition: all 0.3s ease;
}

.record-button:active {
	transform: scale(0.95);
	background-color: #1470d6;
}

.record-icon {
	width: 60rpx;
	height: 60rpx;
	background-color: #fff;
	border-radius: 50%;
	margin-bottom: 20rpx;
}

.recording-button {
	width: 200rpx;
	height: 200rpx;
	background-color: #ff4d4f;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	animation: pulse 1s infinite;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7);
	}
	70% {
		box-shadow: 0 0 0 30rpx rgba(255, 77, 79, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(255, 77, 79, 0);
	}
}

.recording-icon {
	width: 60rpx;
	height: 60rpx;
	background-color: #fff;
	border-radius: 8rpx;
	margin-bottom: 20rpx;
}

.button-text {
	color: #fff;
	font-size: 28rpx;
	margin-top: 10rpx;
}

.completed-buttons {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.play-button, .re-record-button, .clear-button {
	width: 100%;
	height: 80rpx;
	border-radius: 40rpx;
	font-size: 32rpx;
	border: none;
	transition: all 0.3s ease;
}

.play-button {
	background-color: #52c41a;
	color: #fff;
}

.play-button:active {
	background-color: #389e0d;
}

.re-record-button {
	background-color: #1890ff;
	color: #fff;
}

.re-record-button:active {
	background-color: #1470d6;
}

.clear-button {
	background-color: #f5f5f5;
	color: #666;
	border: 2rpx solid #d9d9d9;
}

.clear-button:active {
	background-color: #e6e6e6;
}

.recording-info {
	width: 100%;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.info-text {
	display: block;
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.info-text:last-child {
	margin-bottom: 0;
}
</style>