<template>
	<view class="container">
		<view class="head flex alignCenter">
			<view class="item" :class="active===1?'active':''" @click="changeType(1)">鍝佺墝</view>
			<view class="item" :class="active===2?'active':''" @click="changeType(2)">闂ㄥ簵</view>
		</view>
		<view class="list flex flexWrap spaceBetween" v-if="active === 1">
			<image :src="item" mode="" v-for="(item,index) in shopInfo.brand_images" :key="index"
				@click="previewImg(shopInfo.brand_images,index)"></image>
		</view>
		<view class="list flex flexWrap spaceBetween" v-else-if="active === 2">
			<image :src="item" mode="" v-for="(item,index) in shopInfo.store_images" :key="index"
				@click="previewImg(shopInfo.store_images,index)"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				active: 1,
				shopInfo: {}
			};
		},
		onLoad(option) {
			const _this = this
			uni.getLocation({
				type: 'wgs84',
				success: async res => {
					if(!option.id){
						uni.showToast({
							title: "网络错误，请联系工作人员",
							icon: "none",
							duration:3000
						})
						return false
					}
					_this.shopInfo = await _this.$request("/food/Store/getStoreDetail", {
						location: res.longitude + "," + res.latitude,
						store_id: option.id
					})
				}
			})
		},
		methods: {
			changeType(type) {
				this.active = type;
			},
			previewImg(imgs, index) {
				uni.previewImage({
					urls: imgs,
					current: index,
					loop: true
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;

		>.list {
			padding: 0 4vw;

			>image {
				width: 44.53vw;
				height: 28.27vw;
				border-radius: 1.33vw;
				object-fit: cover;
				margin-bottom: 2.67vw;
			}
		}

		>.head {
			padding: 6.53vw 4vw;

			>.item {
				width: 24.27vw;
				height: 8vw;
				line-height: 8vw;
				text-align: center;
				border-radius: 5.33vw;
				border: 0.27vw solid #999999;
				font-weight: bold;
				font-size: 4vw;
				color: #999999;
				margin-right: 8vw;
			}

			>.active {
				color: #EFA246;
				border: 0.27vw solid #EFA246;
			}
		}
	}
</style>