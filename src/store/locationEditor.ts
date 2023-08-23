import {defineStore} from 'pinia'
import {computed, ref} from "vue";

export const useLocationStore =  defineStore('location',() => {
    const locationVal = ref<string>('')
    const getLocation = computed(():string => locationVal.value)
    function updateLocation(location:string){
        locationVal.value = location
    }
    return {location, getLocation, updateLocation}
})