<template>
	<view class="container">
		<view style="background-color: #fff;padding: 30rpx;height: 92vh;overflow: auto;">
			<view class="" v-html="content"></view>
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
		},
	}
</script>

<style lang="scss">
	
</style>