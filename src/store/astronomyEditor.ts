import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import requestUtils from "../utils/requestUtils";

export const useAstronomyStore =  defineStore('astronomy',() => {
    const moonPhase = ref<any>()
    const getMoonPhase = computed(():any => moonPhase.value)
    function updateMoonPhase(location:string){
        requestUtils.getMoonPhase(location).then((res:any) => {
            moonPhase.value = res
        }).catch(() => {
            console.log('获取月相数据失败')
        })
    }
    return {
        moonPhase,
        getMoonPhase,
        updateMoonPhase,
    }
})