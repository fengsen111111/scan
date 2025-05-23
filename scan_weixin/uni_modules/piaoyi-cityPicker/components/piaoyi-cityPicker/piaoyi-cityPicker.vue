<template>
	<view class="pupop">
		<view class="popup-box" :animation="animationData">
			<view class="pupop-btn">
				<view @tap="cancel">取消</view>
				<view @tap="confirm" style="color: #2979ff;">确定</view>
			</view>
			<picker-view :value="value" :indicator-style="indicatorStyle" @change="bindChange" class="picker-view">
				<picker-view-column>
					<view class="item" v-for="(item,index) in dataList" :key="index">{{item.code}}</view>
				</picker-view-column>
			</picker-view>
		</view>
		<view @tap="close" @touchmove.stop.prevent :class="visible ? 'pupop-model' : 'pupop-models'"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: [],
				cityList: [],
				areaList: [],
				indicatorStyle: `height: 50px;`,
				provinceIndex: 0,
				cityIndex: 0,
				areaIndex: 0,
				animationData: {},
				
				checkIndex:0//选中的对象下标
			}
		},
		props: {
			dataList:{
				type:Array,
				default: ()=>[]
			},
			visible: {
				type: Boolean,
				default: () => false
			},
			maskCloseAble: {
				type: Boolean,
				default: () => true
			},
		},
		watch: {
			visible (val) {
				this.changeActive()
			},
		},
		methods: {
			confirm () {
				console.log('回传参数',this.checkIndex);
				setTimeout(()=>{
					this.$emit('confirm', this.checkIndex)
				},1000)
			},
			cancel () {
				this.$emit('cancel')
			},
			// 动画
			changeActive () {
				var active = '-415px'
				if (this.visible) {
					active = 0
				}
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'linear'
				})
				animation.bottom(active).step()
				this.animationData = animation.export()
			},
			bindChange(e) {
				// console.log('数据变化',e.detail.value[0],this.value);
				this.checkIndex = e.detail.value[0]
				// console.log('数据变化',this.checkObj);
			},
			// 点击模态框
			close () {
				if (this.maskCloseAble) {
					this.cancel()
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.pupop {
		.popup-box {
			position: fixed;
			left: 0;
			bottom: -315px;
			z-index: 99999;
			background: #fff;
			padding-bottom: 50px;
			.pupop-btn{
				height: 40px;
				display: flex;
				align-items: center;
				padding: 0 30upx;
				justify-content: space-between;
			}
		}
		.pupop-model {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 9999;
			background: rgba(0, 0, 0, .5);
		}
		.pupop-models{
			display: none;
		}
		.picker-view {
			width: 750rpx;
			height: 225px;
			margin-top: 20rpx;
		}
		.item {
			height: 50px;
			align-items: center;
			justify-content: center;
			text-align: center;
			line-height: 50px;
		}
	}
</style>
