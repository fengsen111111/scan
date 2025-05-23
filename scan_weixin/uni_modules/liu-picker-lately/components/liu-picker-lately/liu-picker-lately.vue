<template>
	<view>
		<picker mode="selector" :range="timeRange" range-key="name" @change="onChange">
			<slot />
		</picker>
	</view>
</template>

<script>
	export default {
		props: {
			//展示的时间数据源（传入示例：[1, 3, 5, 7, 15, 30]）
			timeList: {
				type: Array,
				default: () => {
					return [1, 3, 5, 7, 15, 30]
				}
			}
		},
		data() {
			return {
				timeRange: [],
				selectedTime: ''
			}
		},
		mounted() {
			this.timeList.forEach(res => {
				let obj = {
					id: res,
					name: '近' + res + '天'
				}
				this.timeRange.push(obj)
			})
		},
		methods: {
			onChange(e) {
				const index = e.detail.value
				const pkId = this.timeRange[index].id
				let startDate, endDate
				startDate = this.agoTodayData(pkId)
				endDate = this.curentData()
				this.$emit('change', {
					startDate: startDate,
					endDate: endDate
				})
			},
			agoTodayData(day) {
				var day1 = new Date()
				day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000 * day)
				var clock = day1.getFullYear() + "-"
				var month = day1.getMonth() + 1
				if (month < 10)
					clock += "0"
				clock += month + "-"
				var day = day1.getDate()
				if (day < 10)
					clock += "0"
				clock += day
				return clock
			},
			curentData() {
				var now = new Date()
				var year = now.getFullYear()
				var month = now.getMonth() + 1
				var day = now.getDate()
				var clock = year + "-"
				if (month < 10)
					clock += "0"
				clock += month + "-"
				if (day < 10)
					clock += "0"
				clock += day
				return clock
			}
		}
	}
</script>
