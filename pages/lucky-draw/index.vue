<template>
  <view class="lucky-draw-container">
    <view class="title">抽奖活动</view>
    
    <!-- 奖品列表 -->
    <view class="prizes-container">
      <!-- 上半部分奖品 -->
      <view class="prizes-row top-row">
        <view 
          v-for="(prize, index) in prizes.slice(0, 5)" 
          :key="index"
          class="prize-item"
          :class="{
            'highlighted': currentHighlight === index,
            'selected': prize.selected
          }"
        >
          <text class="prize-name">{{ prize.name }}</text>
        </view>
      </view>
      
      <!-- 中间开始按钮 -->
      <view class="middle-row">
        <view class="start-button-container">
          <button 
            class="start-button"
            :disabled="isDrawing || selectedCount >= prizes.length"
            @click="startDrawing"
          >
            {{ isDrawing ? '抽奖中...' : '开始抽奖' }}
          </button>
          <text class="selected-count">已抽中{{ selectedCount }}个奖品</text>
        </view>
      </view>
      
      <!-- 下半部分奖品 -->
      <view class="prizes-row bottom-row">
        <view 
          v-for="(prize, index) in prizes.slice(5, 10)" 
          :key="index + 5"
          class="prize-item"
          :class="{
            'highlighted': currentHighlight === index + 5,
            'selected': prize.selected
          }"
        >
          <text class="prize-name">{{ prize.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 已抽中奖品列表 -->
    <view class="selected-prizes" v-if="selectedCount > 0">
      <text class="selected-title">已抽中奖品：</text>
      <view class="selected-list">
        <text 
          v-for="(prize, index) in prizes.filter(p => p.selected)" 
          :key="index"
          class="selected-item"
        >
          {{ prize.name }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      prizes: [
        { name: '奖品1', selected: false },
        { name: '奖品2', selected: false },
        { name: '奖品3', selected: false },
        { name: '奖品4', selected: false },
        { name: '奖品5', selected: false },
        { name: '奖品6', selected: false },
        { name: '奖品7', selected: false },
        { name: '奖品8', selected: false },
        { name: '奖品9', selected: false },
        { name: '奖品10', selected: false }
      ],
      currentHighlight: -1,
      isDrawing: false,
      drawingInterval: null,
      selectedCount: 0
    }
  },
  methods: {
    startDrawing() {
      if (this.isDrawing || this.selectedCount >= this.prizes.length) {
        return;
      }
      
      this.isDrawing = true;
      let drawCount = 0;
      const maxDraws = 30; // 抽奖动画次数
      
      // 开始抽奖动画
      this.drawingInterval = setInterval(() => {
        // 随机选择一个未被选中的奖品
        let availablePrizes = this.prizes
          .map((prize, index) => ({ prize, index }))
          .filter(item => !item.prize.selected);
        
        if (availablePrizes.length === 0) {
          this.stopDrawing();
          return;
        }
        
        const randomIndex = Math.floor(Math.random() * availablePrizes.length);
        this.currentHighlight = availablePrizes[randomIndex].index;
        
        drawCount++;
        
        // 抽奖次数达到上限，停止抽奖
        if (drawCount >= maxDraws) {
          this.stopDrawing();
        }
      }, 100);
    },
    
    stopDrawing() {
      if (this.drawingInterval) {
        clearInterval(this.drawingInterval);
        this.drawingInterval = null;
      }
      
      // 选中当前高亮的奖品
      if (this.currentHighlight !== -1) {
        this.prizes[this.currentHighlight].selected = true;
        this.selectedCount++;
      }
      
      this.isDrawing = false;
      
      // 显示中奖提示
      setTimeout(() => {
        if (this.currentHighlight !== -1) {
          uni.showToast({
            title: `恭喜获得：${this.prizes[this.currentHighlight].name}`,
            icon: 'success',
            duration: 2000
          });
        }
        this.currentHighlight = -1;
      }, 500);
    },
    
    resetDrawing() {
      this.prizes.forEach(prize => {
        prize.selected = false;
      });
      this.currentHighlight = -1;
      this.selectedCount = 0;
    }
  },
  onUnload() {
    // 页面卸载时清除定时器
    if (this.drawingInterval) {
      clearInterval(this.drawingInterval);
    }
  }
}
</script>

<style scoped>
.lucky-draw-container {
  min-height: 100vh;
  background-color: #ff4444;
  padding: 20rpx;
  box-sizing: border-box;
}

.title {
  font-size: 48rpx;
  color: #ffffff;
  text-align: center;
  margin: 40rpx 0;
  font-weight: bold;
}

.prizes-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 60rpx 0;
}

.prizes-row {
  display: flex;
  justify-content: center;
  margin: 20rpx 0;
}

.prize-item {
  width: 160rpx;
  height: 120rpx;
  background-color: #ffffff;
  border-radius: 10rpx;
  margin: 0 15rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #333333;
  font-weight: bold;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 1;
}

.prize-item.highlighted {
  background-color: #ffff00;
  transform: scale(1.1);
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
}

.prize-item.selected {
  background-color: #cccccc;
  color: #666666;
  opacity: 0.6;
  cursor: not-allowed;
}

.middle-row {
  margin: 40rpx 0;
}

.start-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-button {
  width: 240rpx;
  height: 100rpx;
  background-color: #ffff00;
  color: #ff4444;
  border: none;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.start-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
}

.start-button:disabled {
  background-color: #cccccc;
  color: #666666;
  opacity: 0.6;
}

.selected-count {
  font-size: 24rpx;
  color: #ffffff;
}

.selected-prizes {
  margin-top: 60rpx;
  padding: 30rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
}

.selected-title {
  font-size: 32rpx;
  color: #ffffff;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
}

.selected-item {
  background-color: rgba(255, 255, 255, 0.3);
  color: #ffffff;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  margin: 10rpx;
  font-size: 24rpx;
}
</style>