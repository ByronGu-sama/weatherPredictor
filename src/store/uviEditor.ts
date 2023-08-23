import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import requestUtils from "../utils/requestUtils";
import {ElMessage} from "element-plus";

export const useUviStore =  defineStore('uvi',() => {
    const uvi:any = ref('')
    const getUvi = computed(() => uvi.value)
    function updateUvi(location:string){
        requestUtils.getUvi(location).then(res => {
            uvi.value = res
        }).catch(() => {
            ElMessage({
                message:'获取uvi数据失败',
                type:'error'
            })
        })
    }
    return {uvi, getUvi, updateUvi}
})