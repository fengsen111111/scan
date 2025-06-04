import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css' // ✅ 正确样式引入
import { message } from 'ant-design-vue'
window.message = message

const app = createApp(App)
app.use(Antd)
app.use(router)

app.mount('#app')
