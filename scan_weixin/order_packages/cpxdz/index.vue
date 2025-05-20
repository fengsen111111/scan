<template>
	<view>
		<view style="text-align: center;padding-top: 200rpx;">
			<image v-if="type==1" style="width: 120rpx;height: 120rpx;margin: 30rpx;" src="../../static/cpxd.png"
				mode=""></image>
			<image v-else style="width: 120rpx;height: 120rpx;margin: 30rpx;" src="../../static/cpzb.png" mode="">
			</image>
			<view v-if="type==1" style="font-size: 36rpx;font-weight: bold;text-align: center;">
				菜品下单中（{{countdown}}S）
			</view>
			<view v-else style="font-size: 36rpx;font-weight: bold;text-align: center;">
				菜品制作中
			</view>
			<view style="color: #999999;font-size: 24rpx;margin: 20rpx 0rpx 80rpx 0rpx;">
				请耐心等候~
			</view>
			<view style="display: flex;justify-content: space-between;">
				<view class=""></view>
				<text
					style="color: #fff; padding: 20rpx 80rpx; border-radius: 60rpx;background-color: #EFA246;font-size: 24rpx;"
					@click="toOrder()">
					查看订单详情
				</text>
				<view class=""></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1,
				option: {},
				countdown: 10,
				timer: null,
			};
		},
		onLoad(options) {
			if (this.option.order_id) {
				this.clearTimer();
			} else {
				this.startCountdown();
			}
			console.log('options', options);
			this.option = options
		},
		methods: {
			// 计时器
			startCountdown() {
				this.clearTimer(); // 先清一次防止重复
				this.countdown = 10;
				this.timer = setInterval(() => {
					this.countdown--;
					if (this.countdown <= 7) {
						this.clearTimer()
						this.type = 2
					}
				}, 1000);
			},
			// 清除计时器
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			// 跳转订单详情
			toOrder() {
				this.clearTimer();
				uni.switchTab({
					url: "/pages/Order/index"
				})
				// this.$nav('/pages/Order/index', {
				// 	order: this.option.order_id
				// })
			}
		},
		onUnload() {
			this.clearTimer(); // 页面卸载时也清除定时器
		}
	}
</script>

<style lang="scss">
</style>