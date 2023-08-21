import {ElMessage} from "element-plus";
import request from "../request/Url";
import axios from "axios";

//判断浏览器本地缓存中是否存在nowWeather数据
const judgeIfHasNowWeather = () => {
    return new Promise((resolve, reject) => {
        let now:any = localStorage.getItem('nowWeather')
        if(!now){
            let location:any = localStorage.getItem('qwLocation')
            if(location){
                getNowWeather(JSON.parse(location).value).then(res => {
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
            }else{
                reject(new Error("location param is null"))
            }
        }else{
            resolve(JSON.parse(now))
        }
    })
    }

//获取实时天气数据
const getNowWeather = (value:string) => {
    return new Promise((resolve, reject) => {
        axios.get(`${request.GET_NOW_WEATHER}location=${value}`).then(res => {
            if(res.data.code == 200){
                localStorage.setItem('nowWeather',JSON.stringify(res.data.now))
                resolve(res.data.now)
            }else{
                ElMessage({
                    message:'获取实时天气信息失败',
                    type:'error'
                })
                reject(new Error("get weather data failed"))
            }
        }).catch((err) => {
            ElMessage({
                message:'获取数据时发生错误',
                type:'error'
            })
            reject(err)
        })
    })
}

export default {
    judgeIfHasNowWeather,
    getNowWeather
}