import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import requestUtils from "../utils/requestUtils";
import {ElMessage} from "element-plus";

export const useWeatherIndicesStore =  defineStore('weatherIndices',() => {
    const uviIndex:any = ref('')
    const clothIndex:any = ref('')

    const getUviIndex = computed(() => uviIndex.value)
    const getClothIndex = computed(() => clothIndex.value)

    function updateUvi(location:string):void{
        requestUtils.getUvi(location).then(res => {
            uviIndex.value = res
        }).catch(() => {
            ElMessage({
                message:'获取uvi数据失败',
                type:'error'
            })
        })
    }

    function updateClothIndex(location:string):void{
        requestUtils.getClothIndex(location).then(res => {
            clothIndex.value = res
        }).catch(() => {
            ElMessage({
                message:'获取穿衣指数失败',
                type:'error'
            })
        })
    }
    return {
        uviIndex,
        clothIndex,
        getUviIndex,
        getClothIndex,
        updateUvi,
        updateClothIndex,
    }
})