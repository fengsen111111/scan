<script setup>
  import { ref, createVNode } from 'vue'
  import { Modal } from 'ant-design-vue';
  import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import router from '@/router' // 需要你使用 vue-router，并配置 login 页面
  import { geSeatList, overOrder, printOrderAgain, changeSeat } from '@/api'

  const code = ref('')//餐位号
  const status = ref('c')//状态

  const list = ref([])
  // 餐位列表
  function _geSeatList() {
    geSeatList({
      post_params: {
        help_user_order: '',
        handle_type: 'b',
        status: status.value == 'c' ? '' : status.value,
        code: code.value,
        currentPage: 1,
        perPage: 100
      }
    }).then((res) => {
      console.log('餐位列表', res.data.list);

      list.value = res.data.list
      // list.value = res.data.list.sort((a, b) => {
      //   if (a.work_status === 'b' && b.work_status !== 'b') return -1
      //   if (a.work_status !== 'b' && b.work_status === 'b') return 1
      //   return 0
      // })
    }).catch((err) => {
      console.log('err', err);
    })
  }

  // 结束
  function _overOrder(item) {
    Modal.confirm({
      title: '您确定要结束当前餐位用餐吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: '请确认客户用餐已结束,再执行该操作',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('确定');
        overOrder({
          post_params: {
            handle_type: 'b',
            order_id: item.order_id
          }
        }).then((res) => {
          console.log('结果', res.data);
          message.success('操作成功')
          _geSeatList()
        })
      },
      onCancel() {
        console.log('取消');
      },
    });
  }
  // 补打
  function print(item) {
    printOrderAgain({
      handle_type: 'a',
      order_id: item.order_id
    }).then(res => {
      message.success('打印成功')
    })
  }
  const visZd = ref(false)
  const itemZd = ref({})
  const seat_id = ref()
  // 转单
  function zhuandan(item) {
    itemZd.value = item
    visZd.value = true

  }
  function handleOk() {
    changeSeat({
      seat_id: seat_id.value,
      order_id: itemZd.value.order_id
    }).then(res => {
      message.success('转单成功')
      seat_id.value = null
      visZd.value = false
      _geSeatList()
    })
  }

  const store_name = ref('')
  store_name.value = localStorage.getItem('store_name')
  // 退出登陆
  function outLogin() {
    Modal.confirm({
      title: '您确定要退出当前页面吗?',
      icon: createVNode(ExclamationCircleOutlined),
      content: '退出后需重新登陆，才可进入当前页面',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('确定');
        stopPolling()//关闭轮询
        localStorage.removeItem('Authorization')
        localStorage.removeItem('store_name')
        router.push('/login')
      },
      onCancel() {
        console.log('取消');
      },
    });
  };

  function onChange() {
    console.log('status', status.value);
    _geSeatList()
  }


  // 轮询订单
  let timer = null // 全局变量，避免重复轮询
  // 启动轮询
  function startPolling() {
    // 避免重复设置定时器
    if (timer) return
    _geSeatList() // 第一次立即执行
    timer = setInterval(() => {
      _geSeatList()
    }, 5000)
  }
  // 停止轮询（如退出登录时可调用）
  function stopPolling() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  startPolling()


</script>

<template>
  <div class="flex">
    <div class="left">
      <img src="@/assets/homeLogo.png" style="width: 100%;" alt="">
      <div style="margin-top: 84px;text-align: center;">
        <img src="@/assets/homeIcon.png" class="a1" alt="">
        <div class="a2">餐位</div>
      </div>
    </div>
    <div class="right">
      <div class="a3">
        <div class="flex items-center">
          <a-input v-model:value="code" placeholder="输入餐位号" class="a4" @change="_geSeatList()">
            <template #prefix>
              <search-outlined class="a5" />
            </template>
          </a-input>
          <!-- <div class="flex items-center" style="margin-left: 60px;">
            <span>状态筛选</span>
            <div class="a6">
              <a-select ref="select" v-model:value="status" class="a12" @change="onChange()">
                <a-select-option value="c">全部</a-select-option>
                <a-select-option value="a">空闲</a-select-option>
                <a-select-option value="b">有客</a-select-option>
              </a-select>
            </div>
          </div> -->
        </div>
        <div class="flex items-center">
          <span>{{store_name}}</span>
          <div class="a7" @click="outLogin">退出
          </div>
        </div>
      </div>
      <!-- content -->
      <div class="scroll-box">
        <div v-if="list.length==0">
          <a-empty description="暂无数据" style="margin-top: 10%;" />
        </div>
        <a-row :gutter="[20, 20]">
          <template v-for="item in list" :key="item.id">
            <a-col :xl="6" :lg="8">
              <div class="a8">
                <div :class="item.pay_status=='Y'?'a92':'a9'">
                <!-- <div class="a92"> -->
                  <span style="font-size: 28px;">{{item.code}}</span>
                  <!-- <span>{{item.work_status=='a'?'空闲':'有客（'+item.person_number+'人）'}}</span> -->
                </div>
                <div style="padding: 20px;">
                  <div class="flex between">
                    <span style="color: #666666;">订单ID</span>
                    <span>{{item.order_id}}</span>
                  </div>
                  <div class="flex between mt20">
                    <span style="color: #666666;">开台时间</span>
                    <span>{{item.open_time}}</span>
                  </div>
                  <div class="flex between mt20">
                    <span style="color: #666666;">商品数量</span>
                    <div>
                      <span>x{{item.goods_number}}</span>
                      <!-- <span style="color: #0EB1F2;margin-left: 20px;cursor: pointer;">详情</span> -->
                    </div>
                  </div>
                  <div class="between flex mt20">
                    <span style="color: #666666;">实付金额</span>
                    <span style="color: #ED1805;">{{item.price}}</span>
                  </div>

                  <div v-if="item.order_id>0">
                    <div class="a10"></div>
                    <div style="display: grid;grid-template-columns: repeat(3, minmax(0, 1fr));grid-column-gap: 10px">
                      <view class="patchwork" @click="print(item)">补 打</view>
                      <!-- 转台-->
                      <view class="end" v-if="item.pay_status !='Y'" @click="zhuandan(item)">转 台
                      </view>
                      <!-- 结束 -->
                      <div class="a11" v-if="item.pay_status != 'Y'" @click="_overOrder(item)">
                        <span>结 束</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a-col>
          </template>
        </a-row>
      </div>
    </div>
    <a-modal v-model:visible="visZd" title="转单" @ok="handleOk" okText="确定" cancelText="取消">
      <div style="display: flex;">
        <div style="display: flex;align-items: center;margin: 10px auto;">
          <span>选择餐位</span>
          <a-select ref="select" v-model:value="seat_id" style="width: 360px;margin-left: 20px;" placeholder="请选择餐位">
            <a-select-option v-for="item in list" :key="item.id" :value="item.id">{{item.code}}</a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<style scoped>
  .end {
    background-color: rgb(245, 232, 174);
    color: #000000;
    padding: 10px 0px;
    text-align: center;
    border-radius: 40px;
    margin-top: 20px;
    cursor: pointer;
  }

  .patchwork {
    background-color: #000000;
    color: #fff;
    padding: 10px 0px;
    text-align: center;
    border-radius: 40px;
    margin-top: 20px;
    cursor: pointer;
  }

  .a12 {
    width: 120px;
    background-color: #f5f5f5;
    border: none;
  }

  .a1 {
    width: 42px;
    height: 42px;
  }

  .a2 {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
  }

  .a3 {
    padding: 25px 40px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
  }

  .a4 {
    width: 25vw;
    background-color: #f5f5f5;
    border: none;
  }

  .a5 {
    color: #999999;
    font-size: 20px;
  }

  .a6 {
    margin-left: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
  }

  .a7 {
    border: 1px solid #0EB1F2;
    border-radius: 10px;
    color: #0EB1F2;
    padding: 8px 40px;
    margin-left: 40px;
    cursor: pointer;
  }

  .a8 {
    overflow: hidden;
    border-radius: 10px;
    background-color: #fff;
    font-size: 20px;
  }

  .a9 {
    background-color: #ED1805;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding: 6px 20px;
  }

  .a92 {
    background-color: #80CF40;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding: 6px 20px;
  }

  .a10 {
    margin-top: 20px;
    background-color: #999999;
    height: 1px;
  }

  .a11 {
    background-color: #ED1805;
    color: #fff;
    padding: 10px 0px;
    text-align: center;
    border-radius: 40px;
    margin-top: 20px;
    cursor: pointer;
  }

  .scroll-box {
    padding: 20px 44px;
    overflow: auto;
    height: 89vh;
  }

  .scroll-box::-webkit-scrollbar {
    width: 6px;
  }

  .scroll-box::-webkit-scrollbar-thumb {
    background: #bbb;
    border-radius: 4px;
  }

  .scroll-box::-webkit-scrollbar-thumb:hover {
    background: #999;
  }

  .mt20 {
    margin-top: 20px;
  }

  .between {
    justify-content: space-between;
  }

  ::v-deep(.ant-select-selector) {
    background-color: #f5f5f5 !important;
    border: none !important;
    /* font-size: 18px !important; */
  }

  .items-center {
    align-items: center;
  }

  ::v-deep(.ant-input-affix-wrapper) {
    padding: 5px 11px !important;
  }

  ::v-deep(.ant-input) {
    background-color: #f5f5f5 !important;
    border: none !important;
    /* font-size: 18px !important; */
  }

  .flex {
    display: flex;
  }

  .left {
    width: 130px;
    height: 100vh;
    padding: 66px 15px;
    background-color: #172234;
  }

  .right {
    width: calc(100vw - 130px);
    height: 100vh;
    background-color: #f5f5f5;
  }
</style>