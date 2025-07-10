<template>
	<view class="container">
		<view style="background-color: #fff;padding: 30rpx;height: 88vh;overflow: auto;">
			<view class="" v-html="content"></view>
		</view>
		<view @click="back()" style="display: flex;height: 4vh;background-color: #fff;text-align: center;line-height: 4vh;">
			<view style="background-color: #ff0000;color: #fff;width: 50%;">拒绝</view>
			<view style="background-color: green;color: #fff;width: 50%;">同意</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:''
			};
		},
		async onLoad() {
			
			const res = await this.$request("/food/Setting/getRichTextContent", {
				type: "privacy_rich"
			})
			console.log('res',res);
			this.content = res.content
		},
		methods: {
			back(){
				uni.navigateBack()
			}
		},
	}
</script>

<style lang="scss">
	
</style>