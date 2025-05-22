<template>
	<view class="container">
		<view :style="{ paddingTop: statusBarHeight + 'px' }" class="nav-bar">
			<view style="display: flex;justify-content: space-between;padding: 10rpx;align-items: center;">
				<view @click="goBack">
					<image src="../../static/fh.png" style="width: 40rpx;height: 40rpx;margin-top: 18rpx;" mode="">
					</image>
				</view>
				<view style="font-size: 24rpx;">订单详情</view>
				<view class=""></view>
			</view>
		</view>
		<view style="height: 185rpx;"></view>
		<view class="content">
			<view style="text-align: center;">
				<view style="font-size: 36rpx;font-weight: bold;">下单成功</view>
				<view style="color: #999999;font-size: 22rpx;margin-top: 10rpx;margin-bottom: 40rpx;">
					为保证您的用餐体验，建议用餐结束后再支付哦~</view>
			</view>
			<view class="order_num">订单编号:{{orderInfo.id}}</view>
			<view class="label flex alignCenter spaceBetween">
				下单时间
				<text>{{orderInfo.create_time}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				人数
				<text>{{orderInfo.person_number}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				餐位
				<text>{{orderInfo.table_code}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				总价
				<text>￥{{orderInfo.total_price}}</text>
			</view>
			<view class="label flex alignCenter spaceBetween">
				优惠
				<text>￥{{orderInfo.discount_price}}</text>
			</view>
			<view class="label flex spaceBetween" style="margin-bottom: 0;">
				备注
				<text style="width: 70vw;word-break: break-all;color: #999999;display: flex;justify-content: flex-end;">
					{{orderInfo.remark}}
				</text>
			</view>
			<view class="line"></view>

			<view class="item" v-for="(item,index) in orderInfo.goods_list" :key="item.id">
				<view class="title">
					{{item.goods_name}}
					<text style="font-size: 3vw;color: #999999;font-weight: normal;"
						v-if="item.choice_des">（{{item.choice_des}}）</text>
				</view>
				<view class="info flex spaceBetween">
					<image v-if="item.cover_image" :src="item.cover_image" mode=""></image>
					<image v-else src="../../static/cpmrt.png" mode=""></image>
					<view class="concat">
						{{item.introduce}}
					</view>
				</view>
				<view class="price flex alignCenter spaceBetween">
					<text>单价 ￥{{item.price}}</text>
					x{{item.number}}
				</view>
			</view>
			<view style="height: 100rpx;"></view>
		</view>
		<!-- <view style="height: 12.8vw;" v-if="time_status==='a'"></view> -->
		<view style="position: fixed;bottom: 0px;width: 100vw;border: 1px solid #666666;" class="container">
			<view class="bottom flex alignCenter spaceBetween">
				<view class="left flex alignCenter">
					实付￥{{orderInfo.price}}
					<view class="price flex alignCenter flexColumn">
						总价 ￥{{orderInfo.total_price}}
						<text>优惠 ￥{{orderInfo.discount_price}}</text>
						<text v-if="discountList.length" @click="discountShow=true" :style="{color: moneyObj.id?'':'#ff0000'}">{{moneyObj.id?item.name:'选择优惠卷'}}</text>
					</view>
				</view>
				<view class="right flex alignCenter">
					<view class="pay" v-if="orderInfo.price*1==orderInfo.total_price*1&&orderInfo.price>0">已支付</view>
					<view class="" v-else style="display: flex;">
						<view class="addA" @click="addMenu()">加菜</view>
						<view class="payA" @click="goPay()">去结账</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup :show="payShow" mode="bottom" @close="payShow=false" round="5.33vw">
			<view class="payContent">
				<view class="title flex alignCenter spaceBetween">
					支付方式
					<u-icon name="close" size="25" color="#000000" @click="payShow=false"></u-icon>
				</view>

				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(1)">
					<view class="item flex alignCenter">
						<image src="@/static/money.png" mode=""></image>
						<text>余额</text>
						{{userMoney}}
					</view>
					<u-icon name="checkmark-circle-fill" color="#EFA246" size="20" v-if="payType===1"></u-icon>
				</view>
				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(2)">
					<view class="item flex alignCenter">
						<u-icon name="weixin-fill" color="#68BF7B" size="5.33vw"></u-icon>
						<text>微信</text>
					</view>
					<u-icon name="checkmark-circle-fill" color="#EFA246" size="20" v-if="payType===2"></u-icon>
				</view>
				<view style="padding: 60rpx 52rpx 20rpx;">
					<u-checkbox-group v-model="checkValue" shape="circle">
						<u-checkbox activeColor="#EFA246" labelSize="20rpx" labelColor="#999999"
							:label="'当前积分可抵扣:￥'+(orderInfo.integral_price||0)+'，是否抵扣'" :name="1">
						</u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="confirm_two" @click="confirm()">支付</view>
			</view>
		</u-popup>
		<u-popup :show="discountShow" mode="center" round="5.33vw">
			<view class="discountContent" style="width: 85vw;">
				<view class="title flex alignCenter spaceBetween">
					优惠卷
					<u-icon name="close" color="#000000" size="25" @click="discountShow=false"></u-icon>
				</view>
				<scroll-view scroll-y="true"
					:style="!discountList||discountList.length===0?'height:20vh':'height: 50vh;'">
					<u-empty mode="coupon" text="暂无可用的优惠券" v-if="!discountList||discountList.length===0"></u-empty>
					<view class="item_box" v-for="(item) in discountList" :key="item.id">
						<view class="item flex alignCenter">
							<image :src="item.cover_image" alt="" mode="aspectFill"></image>
							<view class="title flex spaceBetween flexColumn">
								{{item.name}}
								<text>{{item.des}}</text>
							</view>
							<view class="content flex spaceBetween flexColumn">
								{{item.discount_type==='a'?'满'+item.top_price.replace('.00','')+'减'+item.data.replace('.00',''):item.data+'折'}}
								<text>有效期至：{{item.end_time}}</text>
							</view>
						</view>
						<view class="type" v-if="item.types">
							可用类型：{{item.types}}
						</view>
						<view class="get flex flexEnd flexColumn" :style="!item.types?'margin-top:2vw':''">
							<view class="charge flex alignCenter justifyCenter" v-if="item.has_status==='N'"
								@click="getCoupon(item)">领取</view>
							<view class="charge flex alignCenter justifyCenter" v-if="item.has_status==='Y'"
								@click="useCouponEven(item)">使用</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				payShow: false,
				payType: 1,
				orderInfo: {},
				userMoney: 0,
				payFlag: true,

				time_status: 'a',
				pay_status: 'a',

				statusBarHeight: '20',

				// 优惠卷
				discountList: [],
				discountShow: false,
				checkValue: [], //是否积分折扣
				shopInfo:{},//门店信息
				coupon_obj:{},//选择的优惠卷
				moneyObj:{},//优惠金额
			};
		},
		onLoad(options) {
			this.time_status = options.time_status;
			this.pay_status = options.pay_status
			this.$request("/food/Order/userGetOrderDetail", {
				order_id: options.id
			}).then(res => {
				this.orderInfo = res
				this.selectCount()//所有可用优惠卷
			})
			const that = this
			// 头部高度
			uni.getSystemInfo({
				success(res) {
					that.statusBarHeight = res.statusBarHeight || 20
				}
			})
		},
		methods: {
			// 计算优惠金额
			changePayData() {
				let goods_list = [];
				if (this.orderInfo.goods_list.length) {
					goods_list = this.orderInfo.goods_list.map(item => {
						return {
							goods_type: item.is_group === 'Y'? 'b' : 'a',
							goods_id: item.goods_id,
							number: item.number,
							choice_des: item.choice_des,
							[item.group_goods ? 'group_goods' : '']: item.group_goods
						}
					})
				}
				this.$request("/food/Order/computePayData", {
					goods_list: goods_list,//商品
					coupon_id: this.coupon_obj.id,//优惠卷id
					pay_type: this.checkValue[0] === 1 ? 'b' : 'a'//是否积分折扣
				}).then(result => {
					this.moneyObj = result;
				})
			},
			// 使用优惠卷
			useCouponEven(item) {
				this.coupon_obj = item;
				this.discountShow = false;//关闭弹窗
				this.changePayData()
			},
			// 领取优惠卷
			getCoupon(item) {
				this.$request("/food/Coupon/hasCoupon", {
					coupon_id: item.id
				}).then(() => {
					this.selectCount();
				})
			},
			// 获取订单可用优惠卷
			selectCount() {
				console.log('订单详情',this.orderInfo);
				let goods_list = [];
				if (this.orderInfo.goods_list.length) {
					goods_list = this.orderInfo.goods_list.map(item => {
						return {
							goods_type: item.is_group === 'Y'? 'b' : 'a',
							goods_id: item.goods_id,
							number: item.number,
							choice_des: item.choice_des,
							[item.group_goods ? 'group_goods' : '']: item.group_goods
						}
					})
				}
				this.$request("/food/Coupon/getOrderCoupon", {
					store_id: this.orderInfo.store_id,
					goods_list
				}).then(res => {
					this.discountList = res.list;
				})
			},
			// 去订单列表
			goBack() {
				uni.switchTab({
					url: "/pages/Order/index"
				})
			},
			changePayType(type) {
				this.payType = type;
			},
			addMenu() {
				this.$nav("/home_packages/shop_detail/index", {
					id: this.orderInfo.store_id,
					type: "add",
					orderId: this.orderInfo.id,
					canwei: this.orderInfo.table_code
				})
			},
			goPay() {
				this.$request("/food/User/getUserInfo").then(res => {
					this.userMoney = res.money;
				})
				this.payShow = true
			},
			confirm() {
				if (!this.payFlag) return;
				this.payFlag = false;
				let pay_type = "";
				if (this.payType === 1) {
					if(this.checkValue[0] === 1){
						pay_type = 'd'
					}else{
						pay_type = 'c'
					}
				} else if (this.payType === 2) {
					if(this.checkValue[0] === 1){
						pay_type = 'b'
					}else{
						pay_type = 'a'
					}
				}
				this.$request("/food/Order/payOrder", {
					order_id: this.orderInfo.id,
					coupon_id: this.coupon_obj.id,
					pay_type
				}).then(res => {
					if (res.result === 1) {
						uni.showToast({
							title: "支付成功",
							icon: "success",
							duration: 2000
						})
						this.payShow = false;
						this.$request("/food/Order/userGetOrderDetail", {
							order_id: this.orderInfo.id
						}).then(res => {
							this.orderInfo = res
						})
						this.payFlag = true;
					} else if (res.result === 3) {
						uni.requestPayment({
							provider: "wxpay",
							...res.pay_data,
							success: res => {
								this.payShow = false;
								this.$request("/food/Order/userGetOrderDetail", {
									order_id: this.orderInfo.id
								}).then(res => {
									this.orderInfo = res
								})
								this.payFlag = true;
							},
							fail: () => {
								uni.showToast({
									title: "用户取消支付",
									icon: "error"
								})
								this.payFlag = true;
							}
						})
					} else {
						this.payFlag = true;
					}
				}).catch(() => {
					this.payFlag = true;
				})
			}
		}
	}
</script>

<style lang="scss">
	
	.payA {
		width: 21.33vw;
		height: 8vw;
		line-height: 8vw;
		text-align: center;
		background: #EFA246;
		border-radius: 6vw;
		font-weight: bold;
		font-size: 4vw;
		color: #FFFFFF;
		margin-left: 2.93vw;
	}
	
	.addA {
		width: 21.33vw;
		height: 8vw;
		line-height: 8vw;
		text-align: center;
		border-radius: 6vw;
		border: 1px solid #EFA246;
		font-weight: bold;
		font-size: 4vw;
		color: #EFA246;
	}
	
	.discount_checkbox {
		background: #FFFFFF;
		margin: -10vw auto 0;
		border-radius: 5.33vw;
		width: calc(100% - 10vw);
		height: 8vw;
		display: flex;
		align-items: center;
		padding: 0 5vw;
	}

	.discountContent {
		padding: 5.33vw 4vw 0;

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
			margin-bottom: 5.33vw;
		}

		.item_box {
			padding: 2.67vw;
			background: #FBFBFB;
			border-radius: 1.33vw;
			border: 0.27vw solid #ED1805;
			margin-bottom: 4vw;

			>.get {
				>.charge {
					width: 21.33vw;
					height: 8vw;
					background: #000000;
					border-radius: 4vw;
					font-weight: 400;
					font-size: 4vw;
					color: rgb(245, 232, 174);
				}
			}

			>.type {
				font-weight: 400;
				font-size: 2.67vw;
				color: #666666;
				margin: 1.33vw 0;
			}

			>.item {
				padding-bottom: 2.67vw;
				border-bottom: solid 1px #F5F5F5;

				>.content {
					font-weight: bold;
					font-size: 4vw;
					color: #ED1805;
					flex: auto;
					align-items: flex-end;

					>text {
						font-weight: 500;
						font-size: 2.67vw;
						color: #666666;
					}
				}

				>.title {
					font-weight: 400;
					font-size: 3.73vw;
					color: #000000;
					flex: auto;

					>text {
						font-weight: 500;
						font-size: 2.67vw;
						color: #666666;
					}
				}

				>image {
					width: 9.6vw;
					height: 9.6vw;
					border-radius: 1.33vw;
					margin-right: 2.67vw;
				}
			}
		}
	}

	.nav-bar {
		background-color: #ffffff;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
	}

	.nav-content {
		height: 44px;
		display: flex;
		align-items: center;
		padding: 0 15px;
		border-bottom: 1px solid #eee;
	}

	.back-btn {
		width: 30px;
		text-align: center;
		font-size: 20px;
	}

	.title {
		flex: 1;
		text-align: center;
		font-size: 18px;
		font-weight: bold;
	}

	.payContent {
		padding: 4.93vw 4vw;

		>.confirm_two {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #EFA246;
			border-radius: 6vw;
			margin: 0 auto 0;
			font-weight: bold;
			font-size: 4vw;
			color: #FFFFFF;
		}

		>.chooseItem {
			margin-top: 8.27vw;
			padding: 0 6.67vw;

			>.item {
				font-weight: 400;
				font-size: 3.2vw;
				color: #666666;

				>image {
					max-width: 5.33vw;
					max-height: 5.33vw;
				}

				>text {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin: 0 2.67vw;
				}
			}
		}

		>.title {
			font-weight: bold;
			font-size: 4.27vw;
			color: #000000;
		}
	}

	.container {
		background: #F5F5F5;

		>.bottom {
			width: calc(100% - 2px - 8vw);
			padding: 2.13vw 4vw 0;
			padding-bottom: constant(safe-area-inset-bottom);
			/*兼容 IOS&gt;11.2*/
			padding-bottom: env(safe-area-inset-bottom);
			/*兼容 IOS&gt;11.2*/
			background: #FFFFFF;
			box-shadow: 0 0.4vw 0.8vw 0.13vw rgba(0, 0, 0, 0.16);
			border-radius: 1.33vw 1.33vw 0 0;
			

			>.right {
				align-items: flex-end;

				>.pay {
					width: 21.33vw;
					height: 8vw;
					line-height: 8vw;
					text-align: center;
					background: #EFA246;
					border-radius: 6vw;
					font-weight: bold;
					font-size: 4vw;
					color: #FFFFFF;
					margin-left: 2.93vw;
				}

				>.add {
					width: 21.33vw;
					height: 8vw;
					line-height: 8vw;
					text-align: center;
					border-radius: 6vw;
					border: 1px solid #EFA246;
					font-weight: bold;
					font-size: 4vw;
					color: #EFA246;
				}
			}

			>.left {
				font-weight: bold;
				font-size: 4vw;
				color: #ED1805;

				>.price {
					font-weight: 500;
					font-size: 2.67vw;
					color: #000000;
					margin-left: 4.4vw;
				}
			}
		}

		>.content {
			padding: 4vw;
			background: #FFFFFF;

			>.item {
				margin-bottom: 5.07vw;

				>.price {
					font-weight: bold;
					font-size: 4.27vw;
					color: #000000;

					>text {
						font-size: 4.8vw;
						color: #ED1805;
					}
				}

				>.info {
					margin-bottom: 4.67vw;

					>.concat {
						width: 66.67vw;
						font-weight: 400;
						font-size: 3.2vw;
						color: #999999;
					}

					>image {
						width: 21.33vw;
						height: 21.33vw;
						border-radius: 2.67vw;
						margin-right: 4vw;
					}
				}

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-bottom: 2.67vw;
				}
			}

			>.line {
				height: 1px;
				background: #999999;
				margin-top: 4vw;
				margin-bottom: 2.67vw;
			}

			>.label {
				font-weight: 500;
				font-size: 3.2vw;
				color: #000000;
				margin-bottom: 2.67vw;
			}

			>.order_num {
				font-weight: 500;
				font-size: 3.2vw;
				color: #000000;
				padding-bottom: 2.67vw;
				border-bottom: solid 1px #999999;
				margin-bottom: 5.33vw;
			}
		}
	}
</style>