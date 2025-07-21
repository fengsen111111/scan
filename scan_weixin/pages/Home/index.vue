<template>
	<view class="container">
		<!-- <image src="@/static/head_bg.png" alt="" class="head_bg"></image> -->
		<view class="head" :style="{paddingTop:statusBarHeight+'px',height:navigationBarHeight+'px'}">
			<image src="@/static/logo1.png" alt="" />
		</view>
		<scroll-view :scroll-y="!screenFlag" refresher-enabled
			:style="{height:'calc(100% - '+navHeight+'px - 1.67vw)',position:'relation'}"
			:refresher-triggered="freshFlag" @refresherrefresh="refresh()" @scrolltolower="reachBottom()">
			<view class="search">
				<view class="input_box">
					<u-icon name="search" size="20" color="#000000"></u-icon>
					<input type="text" placeholder="输入关键词搜索门店" v-model="keyWords" placeholder-class="input_placeholder"
						confirm-type="search" @confirm="search()" />
				</view>
				<view class="scan" @click="scanCode()">
					<image src="@/static/scan.png" alt="" />
					<!-- <u-icon name="/static/scan.png" size="5vw" color="#999999"></u-icon> -->
					扫一扫
				</view>
			</view>
			<view class="swiper">
				<swiper class="swiper" circular autoplay :interval="2000">
					<swiper-item v-for="(item) in bannerList" :key="item.id">
						<image :src="item.image" mode="" @click="jump(item)"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="content">
				<view class="screen" :style="{zIndex:screenFlag?'99':'3'}">
					<view class="item" @click="openScreen('distance')"
						:style="{color:screenKey==='distance'&&screenFlag?'#FA4741':''}">
						<image
							:src="screenKey==='distance'&&screenFlag?require('@/static/icon1_active.png'):require('@/static/icon1.png')"
							alt="" />
						附近
					</view>
					<view class="item" @click="openScreen('type_id')"
						:style="{color:screenKey==='type_id'&&screenFlag?'#FA4741':''}">
						<image
							:src="screenKey==='type_id'&&screenFlag?require('@/static/icon2_active.png'):require('@/static/icon2.png')"
							alt="" />
						分类
					</view>

					<view class="list" v-if="screenFlag">
						<view class="item flex alignCenter spaceBetween" v-for="(item,index) in screen" :key="index"
							@click="confirmScreen(item)"
							:style="{color:formData[screenKey]===item.id||formData[screenKey] === item?'#FA4741':''}">
							{{item.name}}
							<text>{{item.store_number||""}}</text>
						</view>
					</view>
					<!-- 针对筛选的遮罩层 -->
					<view class="box">
						<view class="mask" v-if="screenFlag" @click="screenFlag=false"></view>
					</view>
				</view>
				<FoodItem v-for="(item,index) in list" :key="index" :item="item" :index="index"></FoodItem>
			</view>
		</scroll-view>

		<u-popup :show="isFirstOpen" mode="center" @close="isFirstOpen=false">
			<view class="" style="width: 80vw;padding: 40rpx;">
				<view style="display: flex;justify-content: space-between;">
					<view class=""></view>
					<view class="">隐私协议</view>
					<view class=""></view>
					<!-- <u-icon name="close" color="#000000" size="25" @click="isFirstOpen=false"></u-icon> -->
				</view>
				<view class="" style="margin-top: 20rpx;">
					我们非常重视您的隐私。在使用本小程序前，请您阅读并同意<text style="color: #40A9FF;"
						@click="()=>{isFirstOpen=false;$nav('/mine_packages/yszc/index')}">《隐私政策》</text>内容。
				</view>
				<view style="display: flex;justify-content: space-evenly;;margin-top: 40rpx;text-align: center;"
					@click="setPup()">
					<!-- <view class="" style="width: 35%;background-color: #999999;border-radius: 40rpx;color: black;padding: 20rpx;">取消</view> -->
					<view class=""
						style="width: 80%;background-color: #40A9FF;border-radius: 40rpx;color: #fff;padding: 20rpx;">确定
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import FoodItem from '@/components/FoodItem.vue';
	export default {
		components: {
			FoodItem
		},
		data() {
			return {
				statusBarHeight: 0,
				navHeight: 0,
				navigationBarHeight: 0,
				keyWords: "",
				formData: {
					distance: "",
					type_id: "",
					location: "",
					currentPage: 1,
					perPage: 10
				},
				freshFlag: false,

				screenFlag: false,
				screenKey: "",
				screen: [],

				bannerList: [],
				total: 0,
				list: [],
				isFirstOpen: false

			};
		},
		onLoad() {
			const app = getApp().globalData;
			this.statusBarHeight = app.statusBarHeight;
			this.navigationBarHeight = app.navigationBarHeight;
			this.navHeight = app.navHeight;

			this.$request("/food/Banner/getBannerList").then(res => {
				this.bannerList = res.list
			})
			this.netWork();
			const that = this
			const isFirstOpen = uni.getStorageSync('isFirstOpen');
			if (!isFirstOpen) {
				setTimeout(() => {
					console.log('准备弹窗');
					that.isFirstOpen = true
				}, 1000); // 1秒后触发，确保页面加载完成
			}
		},
		onShow(){
			if (this.formData.location.length > 0) {
				// 以获取到定位
			} else {
				// 未获取到定位
				this.formData.location = uni.getStorageSync('mr_location')?uni.getStorageSync('mr_location'):'';
				this.modw()
			}
		},
		methods: {
			setPup() {
				uni.setStorageSync('isFirstOpen', true);
				this.isFirstOpen = false
			},

			async scanCode() {
				uni.scanCode({
					scanType: ["qrCode"],
					success: res => {
						console.log('res', res);
						let str = res.result.split("?")[1];
						let obj = {};
						let arr = str.split('&');
						for (let i = 0; i < arr.length; i++) {
							obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
						}

						this.$request("/food/Order/userGetOrderDetailByTableID", {
							// id: obj.id
							table_id: obj.seat_id
						}).then((resule) => {
							// 有订单号就跳转订单详情
							if (resule.order_id) {
								this.$nav('/order_packages/detail/index', {
									id: resule.order_id,
									time_status: '',
									pay_status: ''
								})
							} else {
								if (obj.store_id) {
									uni.setStorageSync("scanInfo", {
										seat_code: obj.seat_code,
										seat_id: obj.seat_id,
										store_id: obj.store_id,
										type: "scan"
									})
									this.$nav("/home_packages/shop_detail/index")
								}
								console.log(obj)
							}
						})

					}
				})
			},
			search() {
				this.$nav("/home_packages/search/index", {
					keyWords: this.keyWords
				})
			},
			netWork() {
				uni.showLoading({
					title: "获取定位中...",
					mask: true
				})
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						this.formData.location = res.longitude + "," + res.latitude;
						this.$request("/food/Store/getStoreList", this.formData).then(res => {
							uni.hideLoading();
							this.total = res.count;
							if (this.formData.currentPage === 1) {
								this.list = res.list;
							} else {
								this.list = this.list.concat(res.list);
							}
							this.freshFlag = false
						}).catch(() => {
							uni.hideLoading();
							this.freshFlag = false
						})
					},
					fail: () => {
						uni.hideLoading();
						uni.authorize({
							scope: "scope.userLocation",
							fail() {
								uni.showModal({
									title: '温馨提示',
									content: '此功能需要获取您的地理位置，请确认授权已获得更好的服务',
									success: function(modalRes) {
										if (modalRes.confirm) {
											// 引导用户到设置页
											uni.openSetting();
										}
									}
								});
							}
						})
					}
				})
			},
			// 为获取到定位使用默认定位
			modw() {
				this.$request("/food/Store/getStoreList", this.formData).then(res => {
					uni.hideLoading();
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.list = res.list;
					} else {
						this.list = this.list.concat(res.list);
					}
					this.freshFlag = false
				}).catch(() => {
					uni.hideLoading();
					this.freshFlag = false
				})
			},
			async refresh() {
				this.formData = {
					distance: "",
					type_id: "",
					location: "",
					currentPage: 1,
					perPage: 10
				}
				this.freshFlag = true;
				this.netWork();
			},
			reachBottom() {
				if (this.formData.currentPage < Math.ceil(this.total / this.formData.perPage)) {
					this.formData.currentPage++;
					this.netWork();
				}
			},
			jump(obj) {
				console.log('obj',obj);
				if (obj.jump_type === 'a') {
					this.$nav("/pages/RichText/index", {
						title: "详情",
						url: "/food/Banner/getBannerContent",
						id: obj.id
					})
				} else if (obj.jump_type === 'b') {
					this.$nav('/home_packages/shop_detail/index', {
						id: obj.jump_data
					})
				} else if (obj.jump_type === 'c') {
					this.$nav("/mine_packages/points/index")
				} else if (obj.jump_type === 'd') {
					this.$nav("/mine_packages/distributive/index")
				} else if (obj.jump_type === 'e') {
					this.$nav("/mine_packages/wallet/index")
				}
			},
			openScreen(key) {
				this.screen = [];
				this.screenFlag = true;
				this.screenKey = key;
				if (key === "distance") {
					this.$request("/food/Setting/getSetting").then(res => {
						this.screen = res.distances.map(item => {
							return {
								id: item,
								name: item + '米'
							}
						})
						this.screen.unshift({
							id: "",
							name: "附近"
						})
					})
				} else {
					this.$request("/food/Type/getTypeList").then(res => {
						this.screen = res.list;
						this.screen.unshift({
							id: "",
							name: "全部"
						})
					})
				}
			},
			confirmScreen(obj) {
				if (typeof obj === "string") {
					this.formData[this.screenKey] = obj === "-1" ? '' : obj
				} else {
					this.formData[this.screenKey] = obj.id;
				}
				this.screenFlag = false;
				this.formData.currentPage = 1;
				this.netWork();
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100vh;
		background: #FFFFFF;

		.content {
			background: #F5F5F5;

			.screen {
				display: flex;
				align-items: center;
				justify-content: space-around;
				height: 16.53vw;
				background: #FFFFFF;
				padding-top: 1.33vw;
				margin-bottom: 1.33vw;
				position: sticky;
				top: -1px;

				>.box {
					width: 100%;
					position: absolute;
					left: 0;
					top: 100%;
					z-index: -1;

					>.mask {
						width: 100%;
						height: 100vh;
						background: rgba(0, 0, 0, .5);
					}
				}

				>.list {
					position: absolute;
					top: 100%;
					width: 100%;
					background: #F5F5F5;

					>.item {
						margin-bottom: 4vw;
						padding: 0 8vw;
						font-weight: 400;
						font-size: 3.2vw;
						color: #000000;

						&:first-child {
							margin-top: 4vw;
						}
					}
				}

				>.item {
					display: flex;
					align-items: center;
					flex-direction: column;
					font-weight: bold;
					font-size: 3.2vw;
					color: #000000;

					>image {
						width: 5.33vw;
						height: 5.33vw;
						margin-bottom: 1.33vw;
					}
				}
			}
		}

		.swiper {
			width: 92vw;
			height: 39.47vw;
			border-radius: 2.67vw;
			background: #FFFFFF;
			margin: 0 auto;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.search {
			margin-bottom: 1.67vw;
			padding: 0 4vw;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.scan {
				font-size: 2.67vw;
				color: #999999;
				display: flex;
				flex-direction: column;
				align-items: center;

				>image {
					width: 5.33vw;
					height: 5.33vw;
				}
			}

			>.input_box {
				display: flex;
				align-items: center;
				width: 72vw;
				padding: 0 4vw;
				height: 8.33vw;
				background: #F5F5F5;
				border-radius: 4.67vw;

				>input {
					margin-left: 2.93vw;
					flex: auto;
				}
			}
		}

		.head_bg {
			width: 100%;
			height: 74.8vw;
			position: fixed;
			inset: 0;
		}

		.head {
			display: flex;
			align-items: center;
			// justify-content: center;
			padding-left: 3.33vw;
			padding-right: 3.33vw;
			position: relative;
			margin-bottom: 1.67vw;

			>image {
				width: 16.93vw;
				height: 8.53vw;
			}
		}
	}
</style>