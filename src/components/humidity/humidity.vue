<script setup lang="ts">
import {ref, watch, onMounted} from "vue";
import utils from "../../utils/requestUtils";
import {ElMessage} from "element-plus";

let props = defineProps(['code','locationName'])
let nowWeather = ref()

watch(() => [props.code,props.locationName],() => {
  let now:any = localStorage.getItem('nowWeather')
  nowWeather.value = JSON.parse(now)
})

onMounted(() => {
  utils.judgeIfHasNowWeather().then(res => {
    nowWeather.value = res
  }).catch(() => {
    ElMessage({
      message:"获取数据失败",
      type:"warning"
    })
  })
})
</script>

<template>
  <div class="module-main" v-if="nowWeather">
    <div class="module-title">
      <img src="../../assets/icons/humidity.svg" style="width: 13px;height: 13px">&nbsp;湿度
    </div>
    <div class="humidity-body" v-if="nowWeather.humidity">
      {{nowWeather.humidity}}%
    </div>
    <div class="bottom-tips" v-if="nowWeather.dew">
      目前露点温度为{{nowWeather.dew}}˚
    </div>
  </div>
</template>

<style scoped>
.humidity-body{
  width: 100%;
  height: calc(100% - 60px);
  font-size: 30px;
  color: white;
  margin-left: 5%;
  text-align: left;
  font-weight: bold;
}
</style>