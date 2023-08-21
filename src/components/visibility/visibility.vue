<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import utils from "../../utils/requestUtils";
import {ElMessage} from "element-plus";

let nowWeather = ref()
let props = defineProps(['code','locationName'])

//判断能见度
const determineVisibility = (vis:any) => {
  vis = parseInt(vis)
  switch (vis){
    case vis < 1:
      return '能见度几乎为零'
    case vis < 10:
      return '能见度差'
    case vis < 15:
      return '能见度较差'
    case vis < 20:
      return '能见度一般'
    case vis < 25:
      return '能见度好'
    default:
      return '能见度极好'
  }
}
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
      <img src="../../assets/icons/visibility.svg" style="width: 13px;height: 13px">&nbsp;能见度
    </div>
    <div class="visibility-middle">
      {{nowWeather.vis}}公里
    </div>
    <div class="visibility-bottom">
      {{determineVisibility(nowWeather.vis)}}
    </div>
  </div>
</template>

<style scoped>
.visibility-middle{
  width: 100%;
  height: calc(100% - 60px);
  color: white;
  font-weight: bold;
  font-size: 30px;
  text-align: left;
  margin-left: 5%;
}
.visibility-bottom{
  width: 100%;
  height: 30px;
  font-size: 13px;
  color: white;
  text-align: left;
  margin-left: 5%;
}
</style>