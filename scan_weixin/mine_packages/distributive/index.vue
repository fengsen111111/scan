<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="share flex alignCenter" v-if="shareShow">
			<view class="arrow" :style="{right:arrowPostion+'px'}"></view>
			<u-icon name="close" color="rgb(254, 232, 174)" @click="shareShow = false"></u-icon>
			<view class="line"></view>
			<text>点击分享给好友</text>
		</view>
		<view class="head flex alignCenter spaceBetween">
			<view class="left">
				总收益
				<text>{{userInfo.all_share_money||0}}</text>
			</view>
			<view class="right flex alignCenter">
				可提现&nbsp;&nbsp;{{userInfo.share_money||0}}
				<view class="cash_out" @click="cashOutShow=true">提现</view>
			</view>
		</view>
		<view class="label flex alignCenter spaceBetween">
			团队列表（{{list.length}}人）
			<text @click="$nav('/mine_packages/record/index')">收益记录</text>
		</view>
		<image v-if="list.length==0" src="@/static/empty.jpg" style="width: 100%;" mode=""></image>
		<view class="item flex alignCenter spaceBetween" v-for="(item) in list" :key="item.id">
			<view class="left flex alignCenter" @click="$nav('/mine_packages/distribute/index',{id:item.id})">
				<image :src="item.head_image||require('@/static/avatar.png')" mode=""></image>
				<view class="info flex flexColumn">
					<view class="flex alignCenter">
						{{item.nickname}}
						<view class="showDetail">查看下级</view>
					</view>
					{{item.join_time}}
				</view>
			</view>
			<view class="right">
				<view class="top flex alignCenter spaceBetween">
					消费金额<text>{{item.order_money}}</text>
				</view>
				<view class="bottom flex alignCenter spaceBetween">
					收益金额<text>{{item.share_money}}</text>
				</view>
			</view>
		</view>

		<view class="blank"></view>
		<view class="bottom">
			<view class="share" @click="canvasShow = true">分享成为分销</view>
		</view>

		<u-popup :show="cashOutShow" mode="bottom" @close="cashOutShow=false" round="5.33vw">
			<view class="cashOutContent">
				<view class="title flex alignCenter spaceBetween">
					提现
					<u-icon name="close" color="#000000" size="25" @click="cashOutShow=false"></u-icon>
				</view>
				<view class="label flex alignCenter spaceBetween">
					输入金额
					<view class="tips">可提现&nbsp;&nbsp;{{userInfo.share_money||0}}</view>
				</view>
				<view class="inputBox flex alignCenter spaceBetween">
					<input type="digit" v-model="money" placeholder="输入提现金额" placeholder-class="input_placeholder"
						@input="changeInput()" />
					<view class="error" v-if="errorText">{{errorText}}</view>
				</view>
				<view class="cash_out" @click="cashOut()">申请到微信钱包</view>
			</view>
		</u-popup>
		<CanvasImage :show="canvasShow" :qrCode="userInfo.share_image" @close="canvasShow = false" :tabFlag="false">
		</CanvasImage>
	</view>
</template>

<script>
	import CanvasImage from '@/components/CanvasImage.vue';
	export default {
		components: {
			CanvasImage
		},
		data() {
			return {
				cashOutShow: false,
				money: null,
				errorText: "",
				formData: {
					currentPage: 1,
					perPage: 10
				},
				total: 0,
				list: [],
				userInfo: {},
				canvasShow: false,

				arrowPostion: "54",
				shareShow: true
			};
		},
		//1.配置发送给朋友
		onShareAppMessage() {
			return {
				title: '雪域惠生活', //分享的标题
				path: 'pages/Mine/index?scene=' + encodeURIComponent("?zysk=1&pid=" + this.userInfo.id), //点击分享链接之后进入的页面路径
			};
		},
		//2.配置分享到朋友圈
		onShareTimeline() {
			return {
				title: '雪域惠生活', //分享的标题
				path: 'pages/Mine/index?scene=' + encodeURIComponent("?zysk=1&pid=" + this.userInfo.id), //点击分享链接之后进入的页面路径
			}
		},
		async mounted() {
			this.netWork();
			this.userInfo = await this.$request("/food/User/getUserInfo")
			const menu = uni.getMenuButtonBoundingClientRect();
			const screen = uni.getSystemInfoSync();
			this.arrowPostion = screen.screenWidth - menu.right + menu.width - 40;
		},
		methods: {
			netWork() {
				uni.showLoading({
					title: "请稍后"
				})
				this.$request("/food/User/getUserTeamerList", this.formData).then(res => {
					uni.hideLoading();
					this.total = res.count;
					if (this.formData.currentPage === 1) {
						this.list = res.list;
					} else {
						this.list = this.list.concat(res.list);
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			changeInput() {
				if (parseFloat(this.money) > parseFloat(this.userInfo.share_money)) {
					this.errorText = "输入金额大于可提现金额"
				} else {
					this.errorText = ""
				}
			},
			cashOut() {
				if (this.errorText) {
					uni.showToast({
						title: "输入金额大于可提现金额",
						icon: "none",
						duration: 2000
					})
					return;
				}
				this.cashOutShow = false;
				uni.showLoading({
					title: "请稍后"
				})
				this.$request("/food/Withdrawal/submitWithdrawal", {
					type: "a",
					money: this.money
				}).then(res => {
					this.money = null;
					uni.hideLoading();
					if (uni.canIUse("requestMerchantTransfer")) {
						uni.requestMerchantTransfer({
							mchId: res.mchId,
							appId: res.appId,
							package: res.package_info,
							complete: async complete => {
								if (complete.result === "success") {
									this.userInfo = await this.$request("/food/User/getUserInfo")
								}
							}
						})
					}
				}).catch(() => {
					uni.hideLoading();
				})
			}
		},
		onReachBottom() {
			if (this.formData.currentPage <= Math.ceil(this.total / this.formData.perPage)) {
				this.formData.currentPage++;
				this.netWork();
			}
		}
	}
</script>

<style lang="scss">
	.blank {
		height: 18vw;
	}

	.bottom {
		width: 100vw;
		height: 17.07vw;
		background: #FFFFFF;
		border-radius: 1.33vw 1.33vw 0 0;
		border: 0.13vw solid #999999;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;

		>.share {
			width: 80vw;
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

	.cashOutContent {
		padding: 4vw;

		>.cash_out {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #000000;
			border-radius: 6vw;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(254, 232, 174);
			margin: 15vw auto 0;
		}

		>.inputBox {
			height: 8vw;
			background: #F5F5F5;
			border-radius: 1.33vw;
			padding: 0 2.67vw;

			>.error {
				flex: 1;
				font-weight: 500;
				font-size: 2.67vw;
				color: #ED1805;
				text-align: right;
			}

			>input {
				flex: 1
			}
		}

		>.label {
			font-weight: 500;
			font-size: 4vw;
			color: #000000;
			margin-bottom: 1.2vw;

			>.tips {
				font-weight: bold;
				font-size: 3.2vw;
			}
		}

		.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 4vw;
		}
	}

	.container {
		height: 100%;
		min-height: 100vh;
		background: #F5F5F5;

		>.share {
			background: #000000;
			position: fixed;
			right: 3vw;
			top: 3vw;
			padding: 1vw 3vw;
			border-radius: 5vw;
			color: rgb(254, 232, 174);
			font-size: 3.25vw;

			>.line {
				width: 1px;
				height: 3vw;
				background: rgb(254, 232, 174);
				margin: 0 2vw;
			}

			>.arrow {
				width: 0;
				height: 0;
				border-left: 6px solid transparent;
				border-right: 6px solid transparent;
				border-bottom: 10px solid #000000;
				position: absolute;
				top: -10px;
			}
		}

		>.item {
			padding: 2.67vw 4vw;
			background: #FFFFFF;
			margin-bottom: 1.33vw;

			>.right {
				width: 20vw;
				font-weight: 500;
				font-size: 2.67vw;
				color: #000000;

				>.bottom {
					margin-top: .8vw;

					>text {
						font-weight: bold;
						color: #ED1805;
					}
				}
			}

			>.left {
				>.info {
					font-weight: 500;
					font-size: 2.67vw;
					color: #000000;
					margin-left: 2.67vw;

					.showDetail {
						padding: 1vw;
						background-color: #000000;
						border-radius: 5px;
						font-size: 2vw;
						margin-left: 2vw;
						color: rgb(254, 232, 174);
					}

					>text {
						font-weight: bold;
						font-size: 3.2vw;
					}
				}

				>image {
					width: 8vw;
					height: 8vw;
					border-radius: 50%;
				}
			}
		}

		>.label {
			font-weight: bold;
			font-size: 3.2vw;
			color: #000000;
			padding: 4vw 4vw 1.33vw;

			>text {
				font-weight: 500;
				font-size: 2.67vw;
				color: #ED1805;
			}
		}

		>.head {
			padding: 0 4vw;
			height: 10.93vw;
			background: #FFFFFF;

			>.right {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;

				>.cash_out {
					width: 13.33vw;
					height: 5.33vw;
					line-height: 5.33vw;
					text-align: center;
					background: #000000;
					border-radius: 6vw;
					margin-left: 4vw;
					font-weight: bold;
					font-size: 3.2vw;
					color: rgb(254, 232, 174);
				}
			}

			>.left {
				font-weight: bold;
				font-size: 4vw;
				color: #000000;

				>text {
					color: #ED1805;
					margin-left: 3.47vw;
				}
			}
		}
	}
</style>