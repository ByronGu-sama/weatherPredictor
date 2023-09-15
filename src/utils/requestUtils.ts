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

//获取灾害预警
const getWeatherWarning = (location:string) => {
    return new Promise((resolve, reject) => {
        axios.get(`${request.GET_WEATHER_WARNING}location=${location}`).then(res => {
            if(res.data.code == 200){
                resolve(res.data.warning)
            }else{
                reject(new Error('get weather warning failed'))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

//获取历史天气数据
const getHistoricalWeather = (location:string) => {
    let date = new Date(new Date())
    let temp = new Date(date.setDate(date.getDate()-10))
    let year = temp.getFullYear()+''
    let tempMonth = temp.getMonth()+1
    let month = tempMonth<10?'0'+tempMonth:tempMonth
    let day = temp.getDate()+''
    let present = year+month+day
    return new Promise((resolve, reject) => {
        axios.get(`${request.GET_HISTORICAL_WEATHER_10D}location=${location}&date=${present}`).then(res => {
            if(res.data.code == 200){
                resolve(res.data)
            }else{
                reject(new Error('get historical weather failed'))
            }
        }).catch(err => {
            reject(err)
        })
    })
}

//获取月相
const getMoonPhase = (location:string) => {
    let date:Date = new Date(new Date())
    let temp:Date = new Date(date.setDate(date.getDate()))
    let year:string = temp.getFullYear()+''
    let tempMonth:number = temp.getMonth()+1
    let month:string = tempMonth<10?'0'+tempMonth:tempMonth+''
    let day:string = temp.getDate()< 10?'0'+temp.getDate():temp.getDate()+''
    let present:string = year+month+day

    return new Promise((resolve, reject) => {
        axios.get(`${request.GET_MOON_PHASE}location=${location}&date=${present}`).then(res => {
            if(res.data.code == 200){
                resolve(res.data)
            }else{
                reject(new Error('get moon phase failed'))
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
    getWeatherWarning,
    getHistoricalWeather,
    getMoonPhase,
}