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
      <img src="../../assets/icons/thermometer.svg" style="width: 13px;height: 13px"/>&nbsp;体感温度
    </div>
    <div class="apparentTemp-body">
      {{nowWeather.feelsLike}}˚
    </div>
    <div class="bottom-tips">
      潮湿使人感觉更热
    </div>
  </div>
</template>

<style scoped>
.apparentTemp-body{
  width: 100%;
  height: calc(100% - 60px);
  font-size: 30px;
  text-align: left;
  text-indent: 5%;
  font-weight: bold;
}
</style>