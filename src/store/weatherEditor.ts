import { defineStore } from 'pinia'
import requestUtils from "../utils/requestUtils.ts";
import {ElMessage} from "element-plus";
import {computed, ref} from "vue";

export const useWeatherStore =  defineStore('nowWeather',() => {
    //实时天气
    const weather = ref<any>()
    //未来十天预报
    const daysWeather_10 = ref<any>()
    //24小时预报
    const hourlyWeather_24 = ref<any>()
    //10天历史天气
    const historicalWeather = ref<any>()
    //台风列表
    const typhoonList = ref<any>()

    const getNowWeather = computed(() => weather.value)
    const getDaysWeather_10 = computed(() => daysWeather_10.value)
    const getHourlyWeather_24 = computed(() => hourlyWeather_24.value)
    const getHistoricalWeather = computed(() => historicalWeather.value)
    const getTyphoonList = computed(() => {typhoonList.value})

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

    function updateHistoricalWeather(location:string,num:string[]):void{
        requestUtils.getHistoricalWeather(location,num).then(res => {
            let temp:any = res
            for(let i:number = 0; i++; i<temp.length - 1){
                for (let j:number = 0; j++; j < i - 1) {
                    let t1:Date = new Date(temp[j].date)
                    let t2:Date = new Date(temp[j+1].date)
                    if (t1 < t2){
                        [temp[j],temp[j+1]] = [temp[j+1],temp[j]]
                    }
                }
            }
            historicalWeather.value = temp
        }).catch(():void => {
            ElMessage({
                message:'获取历史天气失败',
                type:'warning'
            })
        })
    }

    function updateTyphoonList():void{
        requestUtils.getTyphoonList().then(res => {
            typhoonList.value = res
        }).catch(():void => {
            ElMessage({
                message:'获取台风列表失败',
                type:'warning'
            })
        })
    }

    return {
        weather,
        daysWeather_10,
        hourlyWeather_24,
        historicalWeather,
        typhoonList,
        getNowWeather,
        getDaysWeather_10,
        getHourlyWeather_24,
        getHistoricalWeather,
        getTyphoonList,
        updateNowWeather,
        update10DaysWeather,
        update24HoursWeather,
        updateHistoricalWeather,
        updateTyphoonList,
    }
})