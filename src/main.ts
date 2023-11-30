import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import keys from './keys';
import axios from "axios";
import router from './router/index';
import './style.css';
import 'qweather-icons/font/qweather-icons.css';
import App from './App.vue';
import BaiduMap from 'vue-baidu-map-3x'
import key from './keys'
import {createPinia} from "pinia";

axios.interceptors.request.use((config) => {
    config.url+=`${config.url!.slice(-1) === '?'?'':'&'}key=${keys.qweatherAPI_Key}`
    return config
});

createApp(App)
    .use(ElementPlus)
    .use(router)
    .use(createPinia())
    .use(BaiduMap,{
        ak:key.bMap
    })
    .mount('#app')
