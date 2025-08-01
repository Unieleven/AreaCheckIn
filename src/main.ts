import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import 'ant-design-vue/dist/reset.css';
import '@/assets/app.css'

createApp(App).use(store).use(router).use(Antd).use(Vant).mount('#app')
