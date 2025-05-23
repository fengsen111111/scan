### liu-customize-scroll适用于uni-app项目的多类地址选择器
### 本组件兼容小程序、H5
### 介绍：地址选择器，常用于，省市县，小区选择，自带动画效果，脱离uni-popup，可在任何地方直接应用，自带省市区，同时支持2种布局，开启Grid布局后会变得非常整齐，但是字会变省略号，请结合自身需求灵活选择，同时本组件灵活度高，可自由diy
# --- 扫码预览、关注我们 ---

## 扫码关注公众号，查看更多插件信息，预览插件效果！ 

![](https://uni.ckapi.pro/uniapp/publicize.png)

### 使用方式
``` html
<liu-picker-lately :timeList="timeList" @change='pickerDate'>
	<view class="btn">时间选择</view>
</liu-picker-lately>
<view class="time">选择的时间：{{ selectedTime }}</view>
```
``` javascript
export default {
	data() {
		return {
			selectedTime: '',
			timeList: [1, 3, 5, 7, 10, 15, 30]
		},
	methods: {
		//时间选择
		pickerDate(e) {
			console.log('所选择的时间：', e)
			this.selectedTime = `${e.startDate} ～ ${e.endDate}`;
		}
	}
}
```

### 属性说明
| 名称                         | 类型            | 默认值                  | 描述             |
| ----------------------------|---------------- | ---------------------- | ---------------|
| timeList                    | Array           | [1, 3, 5, 7, 15, 30]   | 展示的时间数据源
