<template>
	<view class="container">
		<view style="background-color: #fff;padding: 30rpx;height: 88vh;overflow: auto;">
			<view class="" v-html="content"></view>
		</view>
		<view style="height: 100rpx;"></view>
		<view class="bottom" @click="back()">
			<!-- <view class="share1">拒绝</view>
			<view class="share2">同意</view> -->
			<view class="" style="color: #40A9FF;text-align: center;">
				我已阅读并同意
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ''
			};
		},
		async onLoad() {

			const res = await this.$request("/food/Setting/getRichTextContent", {
				type: "privacy_rich"
			})
			console.log('res', res);
			this.content = res.content
		},
		methods: {
			back() {
				uni.setStorageSync('isFirstOpen', true);
				uni.navigateBack()
			}
		},
	}
</script>

<style lang="scss">
	.bottom {
		width: 100vw;
		height: 17.07vw;
		background: #FFFFFF;
		border-radius: 1.33vw 1.33vw 0 0;
		border: 0.13vw solid #999999;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		position: fixed;
		bottom: 0;

		>.share1 {
			width: 40%;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			border: 1px solid #ff0000;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: #ff0000;
		}

		>.share2 {
			width: 40%;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #000000;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(254, 232, 174);
		}
	}
</style>