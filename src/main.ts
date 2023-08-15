import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
import keys from './keys.ts'
import './style.css'
import App from './App.vue'

axios.defaults.baseURL = "https://geoapi.qweather.com";
axios.interceptors.request.use((config) => {
    config.url+=`${config.url!.slice(-1) === '?'?'':'&'}key=${keys.qweatherAPI_Key}`
    console.log(config.baseURL!+config.url!)
    return config
});
createApp(App)
    .use(ElementPlus)
    .mount('#app')
