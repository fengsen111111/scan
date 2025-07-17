<template>
	<view class="container">
		<view style="height: 1.33vw;"></view>
		<view class="info" v-if="!addType">
			<view class="label">基本信息</view>
			<view class="option flex alignCenter spaceBetween">
				<view class="left flex alignCenter" @click="selectTable()">
					餐位
					<text>{{table_code||"请选择"}}</text>
					<view class="scanCode" @click.stop="scanCode()">扫桌码</view>
				</view>
				<view class="right flex alignCenter">
					<text style="margin-right: 4vw;">人数</text>
					<text v-if="!numberShow">{{orderForm.person_number}}</text>
					<view class="number flex alignCenter" v-else>
						<view class="add flex alignCenter justifyCenter" @click="changePeopleNum('min')">
							<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">
							{{orderForm.person_number}}
						</view>
						<view class="min flex alignCenter justifyCenter" @click="changePeopleNum('add')">
							<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="label">备注</view>
			<view class="textarea">
				<textarea auto-height maxlength="-1" style="min-height: 18.67vw;max-height: 18.67vw;"
					placeholder="输入备注（选填）" placeholder-class="input_placeholder" v-model="orderForm.remark"></textarea>
			</view>
		</view>
		<view class="shopInfo">
			<view class="label">商品信息</view>
			<view class="item" v-for="(item,index) in goodsList" :key="index">
				<view class="title flex alignCenter spaceBetween">
					<view>
						{{item.info.name}}
						<text style="font-size: 3vw;color: #999999;font-weight: normal;"
							v-if="item.choice_des">（{{item.choice_des}}）</text>
					</view>
					<u-icon name="trash" color="#000000" size="20" @click="trash(index)"></u-icon>
				</view>
				<view class="content flex spaceBetween">
					<image v-if="item.info.cover_image" :src="item.info.cover_image" mode=""></image>
					<image v-else src="../../static/cpmrt.png" mode=""></image>
					<view class="con">{{item.info.introduce}}</view>
				</view>
				<view class="price flex alignCenter spaceBetween">
					单价 ￥{{item.info.price}}
					<view class="number flex alignCenter">
						<view class="add flex alignCenter justifyCenter" @click="changeCarNum(item,'min',index)">
							<u-icon name="minus" color="rgb(245,232,174)"></u-icon>
						</view>
						<view class="num flex alignCenter justifyCenter">
							{{item.num}}
						</view>
						<view class="min flex alignCenter justifyCenter" @click="changeCarNum(item,'add',index)">
							<u-icon name="plus" color="rgb(245,232,174)"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom flex alignCenter spaceBetween">
			<view class="left">
				<view class="top flex alignCenter spaceBetween">
					<view class="left flex alignCenter">
						总计￥{{moneyObj.price||0}}
						<!-- <text v-if="moneyObj.discount_price">已优惠 ￥{{moneyObj.discount_price||0}}</text> -->
					</view>
					<!-- <view class="right" v-if="useCoupon===false&&!workerType" @click="selectCount()">选择优惠卷</view> -->
				</view>
				<view class="bottom flex alignCenter spaceBetween" v-if="!workerType">
					获得积分:{{moneyObj.reward_integral||0}}
					<!-- <u-checkbox-group v-model="checkValue" shape="circle" @change="checkboxChange">
						<u-checkbox activeColor="#EFA246" labelSize="2.67vw" labelColor="#999999"
							:label="'使用积分抵扣:￥'+(moneyObj.integral_price||0)" :name="1">
						</u-checkbox>
					</u-checkbox-group> -->
				</view>
			</view>
			<view class="right flex alignCenter">
				<view class="gotIt" @click.stop="order()">{{addType?'加菜':'菜品下单'}}</view>
			</view>
		</view>
		<u-popup :show="discountShow" :mode="discountFirst?'center':'bottom'" round="5.33vw" @close="discountClose()">
			<view class="discount_checkbox" v-if="discountFirst">
				<u-checkbox-group v-model="checkValue1" shape="circle">
					<u-checkbox activeColor="#EFA246" labelSize="2.67vw" labelColor="#999999"
						:label="'当前积分可抵扣:￥'+(moneyObj.integral_price||0)+'，是否抵扣'" :name="1">
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<view class="discountContent" :style="discountFirst?'width: 85vw;':''">
				<view class="title flex alignCenter spaceBetween">
					优惠卷
					<u-icon name="close" color="#000000" size="25" @click="discountClose()"></u-icon>
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

		<u-popup :show="payShow" mode="bottom" @close="payShow=false" round="5.33vw">
			<view class="payContent">
				<view class="title flex alignCenter spaceBetween">
					支付方式
					<u-icon name="close" size="25" color="#000000" @click="payShow=false"></u-icon>
				</view>

				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(2)">
					<view class="item flex alignCenter">
						<u-icon name="weixin-fill" color="#68BF7B" size="5.33vw"></u-icon>
						<text>微信</text>
					</view>
					<u-icon name="checkmark-circle-fill" color="black" size="20" v-if="payType===2"></u-icon>
				</view>
				<view class="chooseItem flex alignCenter spaceBetween" @click="changePayType(1)">
					<view class="item flex alignCenter">
						<image src="@/static/money.png" mode=""></image>
						<text>余额</text>
						{{userMoney}}
					</view>
					<u-icon name="checkmark-circle-fill" color="black" size="20" v-if="payType===1"></u-icon>
				</view>
				<view class="confirm" @click="confirm()">{{addType?'加菜':'菜品下单'}}</view>
			</view>
		</u-popup>
		<cityPicker :mask-close-able="true" @confirm="tableConfirm()" @cancel="tableShow=false" :visible="tableShow"
			:dataList="tableList" />
		<!-- <u-picker :show="tableShow" :columns="[tableList]" keyName="code" @confirm="tableConfirm" title="餐位"
			@cancel="tableShow=false" closeOnClickOverlay @close="tableShow=false"></u-picker> -->
	</view>
</template>

<script>
	import cityPicker from '@/uni_modules/piaoyi-cityPicker/components/piaoyi-cityPicker/piaoyi-cityPicker'
	import {
		baseUrl
	} from "@/utils/config.js"
	export default {
		components: {
			cityPicker
		},
		data() {
			return {
				defaultValue: '',

				store_id: "",
				table_code: "",
				tableList: [],
				tableShow: false,
				formData: {
					goods_list: []
				},
				numberShow: true,
				orderForm: {
					store_id: "",
					coupon_id: "",
					table_id: "",
					person_number: 1,
					remark: "",
					goods_list: [],
					order_id: "", //
				},
				goodsList: [],
				discountShow: false,
				discountFirst: false,
				discountList: [],
				status: {
					a: "平台通用",
					b: "品牌通用",
					c: "门店通用",
					d: "分类通用",
					e: "菜品限定",
					f: "套餐限定"
				},
				moneyObj: {},
				confirmFlag: true,

				addType: false,
				useCoupon: false,
				orderId: "",

				orderResult: false,

				checkValue: [1],
				checkValue1: [],
				payShow: false,
				payType: 2,
				payFlag: true,

				userMoney: 0,

				workerType: false,

				option: {},

				is_request_ok: true //是否请求完了
			};
		},
		onLoad(options) {
			console.log('options', options);
			if(options.rk=='shopping'){
				// 商品详情进入
			}else{
				uni.showToast({
					title: "请通过店铺详情进入",
					icon: "none",
					duration: 2000
				})
				setTimeout(()=>{
					// uni.switchTab({
					// 	url:'/pages/Home/index'
					// })
					uni.navigateBack()
				},1000)
			}
			// 获取门店餐位列表
			this.$request("/food/Seat/geSeatList2", {
				store_id: options.id
			}).then(res => {
				this.tableList = res.list;
				// if (options.scanType) {
				// 	this.orderForm.table_id = options.seat_id;
				// 	this.table_code = options.table_code
				// }
				//  else {
				// 	this.orderForm.table_id = options.seat_id;
				// 	this.table_code = options.table_code
				// }
				// 传了餐位id就匹配出来对应餐位
				if (options.seat_id) {
					let obj = res.list.filter((item) => item.id == options.seat_id)
					this.orderForm.table_id = obj[0].id;
					this.table_code = obj[0].code
					console.log('obj', obj);
				}
			})
			
			this.option = options
			this.workerType = true //不进入支付，直接下单  第一单需要支付
			if (options.addType) {
				// this.workerType = true //不进入支付，直接下单
				// 点击加菜进来的
				this.table_code = options.canwei //餐位code
				this.orderForm.order_id = options.orderId //订单id
				console.log(options.useCoupon)
				setTimeout(() => {
					let arr = this.tableList.filter((item) => item.code == options.canwei) //餐位号
					console.log('arr',arr);
					this.orderForm.table_id = arr[0].id //餐位id
				}, 2000)
				this.addType = true;
				this.useCoupon = options.useCoupon !== 'false';
				this.orderId = options.orderId
			}
			if (uni.getStorageSync("person_number")) {
				this.orderForm.person_number = uni.getStorageSync("person_number").person_number;
				this.numberShow = false;
			}
			if (options.workerType) {
				this.workerType = true
			}
			this.goodsList = uni.getStorageSync("shop" + options.id) || [];
			this.orderForm.store_id = options.id;
			
			this.store_id = options.id;
			this.changePayData();
			this.selectCount("first");
			// 
		},
		methods: {
			// 删除购物车缓存
			clearShopDel() {
				const keys = uni.getStorageInfoSync().keys;
				keys.forEach(key => {
					if (key.startsWith('shop') && /^\d+$/.test(key.slice(4))) {
						// 如果 key 是以 shop 开头，后面是纯数字
						uni.removeStorageSync(key);
						console.log(`已删除本地缓存：${key}`);
					}
				});
			},
			// 优惠卷
			discountClose() {
				this.discountShow = false;
				if (this.checkValue1[0] !== 1) {
					this.checkValue = [];
				}
			},
			scanCode() {
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
						this.orderForm.table_id = obj.seat_id;
						this.table_code = obj.seat_code

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
							}
						})
					}
				})
			},
			selectTable() {
				console.log('baseUrl', baseUrl);
				if (baseUrl == 'https://test.api.xzddd.com') {
					console.log('测试地址');
					this.tableShow = true;
				} else {
					// 正式地址
					return false
				}
			},
			tableConfirm(e) {
				// return false
				// const info = e.value[0];
				const info = this.tableList[e]
				console.log('确定', info.code);
				if (info) {
					this.orderForm.table_id = info.id;
					this.table_code = info.code;
				}
				this.tableShow = false;
			},
			changePayData() {
				if (this.goodsList.length) {
					this.formData.goods_list = this.goodsList.map(item => {
						return {
							goods_type: item.type === 1 ? 'b' : 'a',
							goods_id: item.info.id,
							number: item.num,
							choice_des: item.choice_des,
							[item.info.group_goods ? 'group_goods' : '']: item.info.group_goods
						}
					})
				} else {
					this.formData.goods_list = [];
				}
				this.$request("/food/Order/computePayData", {
					goods_list: this.formData.goods_list,
					coupon_id: this.orderForm.coupon_id,
					pay_type: this.checkValue[0] === 1 ? 'b' : 'a'
				}).then(result => {
					this.moneyObj = result;
				})
			},
			changePeopleNum(type) {
				if (type === "add") {
					this.orderForm.person_number += 1;
				} else {
					if (this.orderForm.person_number === 1) return;
					this.orderForm.person_number -= 1;
				}
			},
			trash(index) {
				uni.showModal({
					title: "温馨提示",
					content: "确认删除吗？",
					success: res => {
						if (res.confirm) {
							this.goodsList.splice(index, 1);
							uni.setStorageSync("shop" + this.store_id, this.goodsList);
							this.changePayData();
						}
					}
				})

			},
			changeCarNum(obj, type, index) {
				if (type === "add") {
					obj.num += 1
				} else if (type === "min") {
					if (obj.num === 1) {
						this.goodsList.splice(index, 1);
					} else {
						obj.num -= 1
					}
				}
				uni.setStorageSync("shop" + this.store_id, this.goodsList);
				this.changePayData();
			},
			selectCount(type) {
				let goods_list = [];
				if (this.goodsList.length) {
					goods_list = this.goodsList.map(item => {
						return {
							goods_type: item.type === 1 ? 'b' : 'a',
							goods_id: item.info.id,
							number: item.num,
							choice_des: item.choice_des,
							[item.group_goods ? 'group_goods' : '']: item.group_goods
						}
					})
				}
				this.$request("/food/Coupon/getOrderCoupon", {
					store_id: this.store_id,
					goods_list
				}).then(res => {
					this.discountList = res.list;
					if (this.workerType) {
						return;
					}
					if (type === "first") {
						this.discountFirst = true;
					} else {
						this.discountFirst = false;
					}
					if (type === "first" && this.discountList.length === 0) {
						this.discountShow = false;
					} else {
						this.discountShow = true;
					}
				})
			},
			changePayType(type) {
				this.payType = type;
			},
			getCoupon(item) {
				this.$request("/food/Coupon/hasCoupon", {
					coupon_id: item.id
				}).then(() => {
					this.selectCount();
				})
			},
			useCouponEven(item) {
				this.orderForm.coupon_id = item.id;
				this.discountShow = false;
				this.changePayData()
			},
			checkboxChange(e) {
				this.checkValue = e;
				this.changePayData()
			},
			// 下单 
			order() {
				if (!this.table_code||!this.orderForm.table_id) {
					uni.showToast({
						title: "请先选择餐位号",
						icon: "error"
					})
					return;
				}
				if (this.goodsList.length === 0) {
					uni.showToast({
						title: "商品为空",
						icon: "error"
					})
					return;
				}

				if (this.workerType) {
					uni.showLoading({
						title: "请稍后……"
					})
					let orderForm = {
						...this.orderForm,
						...this.formData,
						// ...uni.getStorageSync("workerOrder"),
						location: '',
					}
					if (this.option.help_user_order) {
						orderForm.help_user_order = this.option.help_user_order
					}
					if (this.option.help_user_coupon) {
						orderForm.help_user_coupon = this.option.help_user_coupon
					}
					if (this.option.help_user_platform) {
						orderForm.help_user_platform = this.option.help_user_platform
					}

					// console.log('orderForm', orderForm);
					const that = this
					uni.getLocation({
						type: 'wgs84', // 返回 GPS 坐标，也可以使用 'gcj02'（适用于高德、微信地图）
						success: function(res) {
							console.log('经度：' + res.longitude);
							console.log('纬度：' + res.latitude);
							orderForm.location = res.longitude + ',' + res.latitude
							// orderForm.location = '91.129157,29.653201'//测试用经纬度写死，测完注释
							// orderForm.help_user_coupon = orderForm.help_user_coupon ? orderForm.help_user_coupon * 1 : 0
							// 默认是true 可以请求  发起了请求 就变成false,不允许请求
							if (that.is_request_ok) {
								that.is_request_ok = false //不可以请求了
							} else {
								uni.hideLoading();
								uni.showToast({
									title: "请耐心等待...",
									icon: "none",
									duration: 2000
								})
								return false //阻止请求
							}
							console.log('pay_time', that.option.pay_time); // a稍后支付  b立即支付
							if (that.option.pay_time == 'a') {
								that.$request("/food/Order/createOrder", orderForm).then(res => {
									console.log('结果', res);
									setTimeout(() => {
										uni.hideLoading();
									}, 2000)
									if (res.result === 1) {
										that.clearShopDel()//删除购物车缓存
										uni.removeStorageSync("shop" + that.store_id);
										uni.removeStorageSync("workerOrder"); //下单结束后清除代金卷
										uni.reLaunch({
											url: '/order_packages/cpxdz/index?order=' + res
												.order_id
										})
									} else {
										uni.showToast({
											title: "下单失败",
											icon: "error",
											duration: 2000
										})
									}
									setTimeout(() => {
										that.is_request_ok = true //请求结束了
									}, 4000)
								})
								return;
							} else if (that.option.pay_time == 'b') {
								that.$request("/food/User/getUserInfo").then(res => {
									that.userMoney = res.money;
									that.payShow = true;
									that.is_request_ok = true //请求结束了
								})
							}
						},
						fail: function(err) {
							console.log('获取位置失败：', err);
						}
					});
					setTimeout(() => {
						if (orderForm.location.length > 0) {
							// 以获取到定位
						} else {
							// 未获取到定位
							orderForm.location = uni.getStorageSync('mr_location')?uni.getStorageSync('mr_location'):''
							if (that.is_request_ok) {
								that.is_request_ok = false //不可以请求了
							} else {
								uni.hideLoading();
								uni.showToast({
									title: "请耐心等待...",
									icon: "none",
									duration: 2000
								})
								return false //阻止请求
							}
							console.log('pay_time', that.option.pay_time); // a稍后支付  b立即支付
							if (that.option.pay_time == 'a') {
								that.$request("/food/Order/createOrder", orderForm).then(res => {
									console.log('结果', res);
									setTimeout(() => {
										uni.hideLoading();
									}, 2000)
									if (res.result === 1) {
										that.clearShopDel()//删除购物车缓存
										uni.removeStorageSync("shop" + that.store_id);
										uni.removeStorageSync("workerOrder"); //下单结束后清除代金卷
										uni.reLaunch({
											url: '/order_packages/cpxdz/index?order=' + res
												.order_id
										})
									} else {
										uni.showToast({
											title: "下单失败",
											icon: "error",
											duration: 2000
										})
									}
									setTimeout(() => {
										that.is_request_ok = true //请求结束了
									}, 4000)
								})
								return;
							} else if (that.option.pay_time == 'b') {
								that.$request("/food/User/getUserInfo").then(res => {
									that.userMoney = res.money;
									that.payShow = true;
									that.is_request_ok = true //请求结束了
								})
							}
						}
					}, 3000)
					return false
				}
				this.$request("/food/User/getUserInfo").then(res => {
					this.userMoney = res.money;
					this.payShow = true;
				})
			},
			confirm() {
				if (!this.payFlag) return;
				this.payFlag = false
				let pay_type = ""
				if (this.checkValue[0] === 1) {
					if (this.payType === 1) {
						pay_type = 'd'
					} else if (this.payType === 2) {
						pay_type = 'b'
					}
				} else if (this.checkValue.length === 0) {
					if (this.payType === 1) {
						pay_type = 'c'
					} else if (this.payType === 2) {
						pay_type = 'a'
					}
				}
				let orderForm = {
					...this.orderForm,
					...this.formData,
					location: ''
				}
				console.log(orderForm)

				// if (this.addType) {
				// 	orderForm = {
				// 		order_id: this.orderId,
				// 		goods_list: this.formData.goods_list
				// 	}
				// }

				this.$request("/food/Order/createOrder", orderForm).then(res => {
					if (res.result === 1) {
						this.clearShopDel()//删除购物车缓存
						uni.removeStorageSync("shop" + this.store_id);
						this.$request("/food/Order/payOrder", {
							order_id: res.order_id,
							coupon_id: this.orderForm.coupon_id,
							pay_type
						}).then(pay => {
							if (pay.result === 1) {
								uni.showToast({
									title: "支付成功",
									icon: "success",
									duration: 2000
								})
								setTimeout(() => {
									if (this.addType) {
										// 加菜
										uni.reLaunch({
											url: '/order_packages/cpxdz/index?order=' + res
												.order_id
										})
									} else {
										uni.switchTab({
											url: "/pages/Order/index"
										})
									}

								}, 2000)

							} else if (pay.result === 3) {
								uni.requestPayment({
									provider: "wxpay",
									...pay.pay_data,
									success: res => {
										uni.showToast({
											title: "支付成功",
											icon: "success",
											duration: 2000
										})
										setTimeout(() => {
											if (this.addType) {
												// 加菜
												uni.reLaunch({
													url: '/order_packages/cpxdz/index?order=' +
														res.order_id
												})
											} else {
												uni.switchTab({
													url: "/pages/Order/index"
												})
											}

										}, 2000)
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
								uni.showToast({
									title: "支付失败",
									icon: "error",
									duration: 2000
								})
							}
						}).catch(() => {
							this.payFlag = true;
						})
					} else {
						this.payFlag = true;
						uni.showToast({
							title: "下单失败",
							icon: "error",
							duration: 1000
						})
					}
				}).catch(() => {
					this.payFlag = true;
				})
			}
		}
	}
</script>

<style lang="scss">
	.payContent {
		padding: 4.93vw 4vw;

		>.confirm {
			width: 80vw;
			height: 12vw;
			line-height: 12vw;
			text-align: center;
			background: #000000;
			border-radius: 6vw;
			margin: 10vw auto 0;
			font-weight: bold;
			font-size: 4vw;
			color: rgb(245, 232, 174);
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

	.container {
		height: 100%;
		min-height: calc(100vh - 13vw - constant(safe-area-inset-bottom));
		min-height: calc(100vh - 13vw - env(safe-area-inset-bottom));
		background: #F5F5F5;
		padding-bottom: calc(13vw + constant(safe-area-inset-bottom));
		/*兼容 IOS&gt;11.2*/
		padding-bottom: calc(13vw + env(safe-area-inset-bottom));
		/*兼容 IOS&gt;11.2*/

		>.bottom {
			width: calc(100% - 8vw - 2px);
			position: fixed;
			bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			padding-left: 4vw;
			padding-right: 4vw;
			left: 0;
			height: 12.8vw;
			background: #FFFFFF;
			border-radius: 1.33vw 1.33vw 0 0;
			border: 1px solid #999999;
			padding-top: 2.67vw;

			>.right {
				font-weight: 500;
				font-size: 2.67vw;
				color: #FA4741;

				>.gotIt {
					width: 26.67vw;
					height: 8vw;
					line-height: 8vw;
					text-align: center;
					background: #000000;
					border-radius: 6vw;
					font-weight: bold;
					font-size: 4vw;
					color: rgb(245, 232, 174);
					margin-left: 4vw;
				}
			}

			>.left {
				font-weight: bold;
				font-size: 4vw;
				color: #ED1805;
				flex: auto;

				>.bottom {
					font-weight: 500;
					font-size: 2.67vw;
					color: #999999;
				}

				>.top {
					margin-bottom: 1.73vw;

					>.left {
						>text {
							font-weight: 500;
							font-size: 2.67vw;
							color: #999999;
							margin-left: 1.33vw;
						}
					}

					>.right {
						font-weight: 500;
						font-size: 2.67vw;
						color: #FA4741;
					}
				}


			}
		}

		>.shopInfo {
			background: #FFFFFF;
			padding: 4vw;

			>.item {
				border-bottom: solid 1px #999999;

				>.title {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
					margin-top: 5.33vw;
					margin-bottom: 2.67vw;
				}

				>.content {
					>image {
						width: 21.33vw;
						height: 21.33vw;
						border-radius: 2.67vw;
					}

					>.con {
						width: 67vw;
						font-weight: 400;
						font-size: 3.2vw;
						color: #999999;
					}
				}

				>.price {
					font-weight: bold;
					font-size: 4.8vw;
					color: #ED1805;
					margin-top: 4vw;
					margin-bottom: 4vw;
				}
			}

			>.label {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
			}
		}

		>.info {
			background: #FFFFFF;
			padding: 4vw;
			margin-bottom: 1.33vw;

			>.textarea {
				background: #F5F5F5;
				border-radius: 1.33vw;
				margin-top: 1.73vw;
				padding: 2vw;

				>textarea {
					width: 100%;
				}
			}

			>.option {
				margin: 4.13vw 0;

				>.right {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;
				}

				>.left {
					font-weight: bold;
					font-size: 4vw;
					color: #000000;

					>.scanCode {
						width: 15.2vw;
						height: 6.67vw;
						line-height: 6.67vw;
						text-align: center;
						background: #000000;
						border-radius: 4vw;
						font-size: 3.2vw;
						color: rgb(245, 232, 174);
						margin-left: 2vw;
					}

					>text {
						font-weight: 500;
						font-size: 3.2vw;
						color: #999999;
						margin-left: 4vw;
					}
				}
			}

			>.label {
				font-weight: bold;
				font-size: 3.2vw;
				color: #000000;
			}
		}

		.number {
			width: 34.67vw;
			height: 8vw;
			border-radius: 4vw;
			overflow: hidden;

			>.min {
				width: 10.67vw;
				height: 100%;
				background: #000000;
			}

			>.num {
				width: 13.33vw;
				height: 100%;
				background: #F5F5F5;
				font-weight: bold;
				font-size: 4.27vw;
				color: #000000;
			}

			>.add {
				width: 10.67vw;
				height: 100%;
				background: #000000;
			}
		}
	}
</style>