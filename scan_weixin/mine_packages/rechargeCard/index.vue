<template>
	<view class="page" style="background-image: url(../../static/czkbj.png);background-size: 100% 100%;">
		<!-- 自定义导航栏 -->
		<view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="navbar-inner">
				<view class="back-btn" @click="goBack">
					<image src="@/static/fh.png" class="back-icon" />
				</view>
				<view class="title">兑换充值卡</view>
			</view>
		</view>

		<!-- 页面内容 -->
		<view class="content">
			<view class="card" style="background-image: url(../../static/czkcard.png);background-size: 100% 100%;">
				<view class="title-tip">
					输入兑换码或扫描二维码兑换
				</view>
				<view class="input-box">
					<input type="text" v-model="dh_code" placeholder="请输入兑换码" />
					<view @click="scanCode">
						<image src="@/static/scan.png" style="width: 40rpx;height: 40rpx;" />
					</view>
				</view>
				<view class="submit-btn">立即兑换</view>

				<view class="tips">
					<view class="tip-title">温馨提示：</view>
					<view class="tip-list">
						<view>1、请在有效期内兑换，逾期兑换码将失效;</view>
						<view>2、请在登录状态下，于个人中心“兑换充值卡”进行兑换;</view>
						<view>3、您也可点击“扫码”进行兑换;</view>
						<view>4、每张充值卡仅限兑换一次，兑换成功后金额将立即充入您当前账户的通用余额。</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dh_code: '',
				statusBarHeight: 20, // 默认状态栏高度
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync();
			this.statusBarHeight = sysInfo.statusBarHeight;
		},
		methods: {
			goBack() {
				uni.switchTab({
					url: '/pages/Mine/index'
				})
			},
			scanCode() {
				uni.scanCode({
					scanType: ["qrCode"],
					success: res => {
						console.log('扫码结果', res);
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.custom-navbar {
		// background-color: #ffffff;
		width: 100%;
		// box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	}

	.navbar-inner {
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.title {
		font-size: 34rpx;
		font-weight: bold;
		color: #000000;
	}

	.back-btn {
		position: absolute;
		left: 20rpx;
		display: flex;
		align-items: center;
		height: 100%;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	/* 页面内容样式 */
	.content {
		padding: 30rpx;
	}

	.card {
		// background-color: #fff;
		border-radius: 10rpx;
		padding: 50rpx 30rpx;
		// border: 1px solid #f5f5f5;
	}

	.title-tip {
		color: #666666;
		text-align: center;
		// margin: 60rpx 0;
		margin-bottom: 30rpx;
		font-size: 24rpx;
		font-weight: bold;
	}

	.input-box {
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		justify-content: space-between;
		padding: 20rpx;
		border-radius: 10rpx;
	}

	.submit-btn {
		text-align: center;
		background: #000000;
		font-weight: bold;
		color: rgb(245, 232, 174);
		padding: 20rpx;
		border-radius: 10rpx;
		margin-top: 30rpx;
	}

	.tips {
		font-size: 24rpx;
	}

	.tip-title {
		font-weight: bold;
		margin: 90rpx 0px 20rpx 0rpx;
	}

	.tip-list {
		color: #999999;
		padding-right: 70rpx;
	}
</style>