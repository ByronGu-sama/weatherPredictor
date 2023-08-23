import request from "../request/Url";
import axios from "axios";

//获取实时天气数据
const getNowWeather = (value:string) => {
    return new Promise((resolve, reject) => {
        axios.get(`${request.GET_NOW_WEATHER}location=${value}`).then(res => {
            if(res.data.code == 200){
                resolve(res.data.now)
            }else{
                reject(new Error("get weather data failed"))
            }
        }).catch((err) => {
            reject(err)
        })
    })
}

//获取24小时uvi数据
const getUvi = (location:string) => {
    return new Promise((resolve, reject) => {
        axios.get(`${request.GET_UVI_24H}location=${location}&type=5`).then(res => {
            if(res.data.code == 200){
                resolve(res.data.daily[0])
            }else{
                reject(new Error('get uvi data failed'))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

//获取10日天气预报
const get10DaysWeatherPredictor = (location:string) => {
    return new Promise((resolve,reject) => {
        axios.get(`${request.GET_WEATHER_PREDICTOR_10D}location=${location}`).then(res => {
            if(res.data.code == 200){
                resolve(res.data.daily)
            }else{
                reject(new Error('get 10 days weather predictor failed'))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

//获取未来24小时天气预报
const get24HWeatherPredictor = (location:string) => {
    return new Promise((resolve, reject) => {
        axios.get(`${request.GET_WEATHER_PREDICTOR_24H}location=${location}`).then(res => {
            if(res.data.code == 200){
                resolve(res.data.hourly)
            }else{
                reject(new Error('get 24 hours weather failed'))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

export default {
    getNowWeather,
    getUvi,
    get10DaysWeatherPredictor,
    get24HWeatherPredictor,
}