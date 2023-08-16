import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
import keys from './keys'
import router from './router/index'
import './style.css'
import 'qweather-icons/font/qweather-icons.css'
import App from './App.vue'

axios.interceptors.request.use((config) => {
    config.url+=`${config.url.slice(-1) === '?'?'':'&'}key=${keys.qweatherAPI_Key}`
    console.log(config.baseURL+config.url)
    return config
});

createApp(App)
    .use(ElementPlus)
    .use(router)
    .mount('#app')
