<script setup lang="ts">
  import {onMounted,ref} from "vue";
  import {ElMessage} from "element-plus";
  import url from "./request/Url.ts";
  import axios from "axios";

  interface ListItem {
    value: string
    label: string
  }
  let locationOptions = ref<ListItem[]>([])   //模糊搜索返回的地址信息
  let locationVal = ref<string[]>([])         //用户选中的地址
  let loadingLocation = ref<boolean>(false)   //是否正在获取地址模糊搜索信息

  onMounted(() => {
    getLocation()
  })

  //获取定位
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
    },
        err => {
          ElMessage({
            message:err.code == 1?'无法获取定位权限，请手动选择城市':err.code == 2?'获取定位失败，请手动选择城市':'获取位置超时，请手动选择城市',
            type:'warning'
          })
      }
    )
  }

  //获取模糊搜索定位
  const getRemoteLocation = (val:string) => {
    axios.get(`${url.LOCATION_FUZZY_SEARCH}location=${val}&range=cn`).then((res) => {
      if(res.data.code == 200){
        loadingLocation.value = true
        let temp = []
        for(let i of res.data.location){
          temp.push({
            value:i.id,
            label:i.name
          })
        }
        locationOptions.value = temp
        loadingLocation.value = false
      }
    })
  }
</script>

<template>
  <div class="main">
    <el-select
        v-model="locationVal"
        filterable
        remote
        reserve-keyword
        placeholder="选取所在地区"
        :remote-method="getRemoteLocation"
        :loading="loadingLocation"
    >
      <el-option
          v-for="item in locationOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
  </div>
</template>

<style scoped>
</style>
