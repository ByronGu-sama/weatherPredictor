import { defineStore } from 'pinia'
import requestUtils from "../utils/requestUtils.ts";
import {ElMessage} from "element-plus";
import {computed, ref} from "vue";

export const useWeatherStore =  defineStore('nowWeather',() => {
    const weather = ref<any>()
    const daysWeather_10 = ref<any>()
    const hourlyWeather_24 = ref<any>()
    const getNowWeather = computed(() => weather.value)
    const getDaysWeather_10 = computed(() => daysWeather_10.value)
    const getHourlyWeather_24 = computed(() => hourlyWeather_24.value)
    function updateNowWeather(location:string):void{
        requestUtils.getNowWeather(location).then(res => {
            weather.value = res
        }).catch(():void => {
            ElMessage({
                message:'获取实时天气数据失败',
                type:'warning'
            })
        })
    }
    function update10DaysWeather(location:string):void{
        requestUtils.get10DaysWeatherPredictor(location).then(res => {
            daysWeather_10.value = res
        }).catch(():void => {
            ElMessage({
                message:'获取10日天气预报失败',
                type:'warning'
            })
        })
    }
    function update24HoursWeather(location:string):void{
        requestUtils.get24HWeatherPredictor(location).then(res => {
            hourlyWeather_24.value = res
        }).catch(():void => {
            ElMessage({
                message:'获取24小时天气预报失败',
                type:'warning'
            })
        })
    }
    return {
        weather,
        daysWeather_10,
        hourlyWeather_24,
        getNowWeather,
        getDaysWeather_10,
        getHourlyWeather_24,
        updateNowWeather,
        update10DaysWeather,
        update24HoursWeather,

    }
})