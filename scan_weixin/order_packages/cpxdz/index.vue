<template>
	<view >
		<view style="text-align: center;">
			<image v-if="type==1" src="../../static/cpxd.png" mode=""></image>
			<image v-else src="../../static/cpzb.png" mode=""></image>
			<view style="font-size: 36rpx;font-weight: bold;text-align: center;">
				菜品下单中（19S）
			</view>
			<view style="color: #999999;font-size: 24rpx;">
				请耐心等候~
			</view>
			<view style="color: #fff; padding: 10rpx 30rpx; border-radius: 20rpx;background-color: aquamarine;" @click="toOrder()">
				查看订单详情
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:1
			};
		},
		onLoad(options) {
			// this.$request("/food/Order/userGetOrderDetail", {
			// 	order_id: options.id
			// }).then(res => {
			// 	this.orderInfo = res
			// uni.showToast({
			// 	title: "支付成功",
			// 	icon: "success",
			// 	duration: 2000
			// })
			// })
		},
		methods: {
			// 跳转订单详情
			toOrder(){
				uni.switchTab({
					url: "/pages/Order/index"
				})
			}
		}
	}
</script>

<style lang="scss">
</style>