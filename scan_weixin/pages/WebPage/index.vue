<template>
	<view class="container">
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ""
			};
		},
		onLoad(option) {
			this.url = option.url
		}
	}
</script>

<style lang="scss">
	.container {}
</style>