<script setup lang="ts">
import request from '../../request/Url'
import axios from "axios";
import {onMounted, ref, watch} from "vue";
import {ElMessage} from "element-plus";

let nowWeather = ref()
let props = defineProps(['code','locationName'])

watch(() => [props.code,props.locationName],(n) => {
  console.log(n)
  let now:any = localStorage.getItem('nowWeather')
  nowWeather.value = JSON.parse(now)
})

</script>

<template>
  <div class="pressure-main">
    <div class="pressure-title">
      <img src="../../assets/icons/pressure.svg">&nbsp;气压
    </div>
    <div class="pressure-body">
      <div class="pressure-ring"></div>

    </div>
  </div>
</template>

<style scoped>
.pressure-main{
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.pressure-title{
  text-align: left;
  margin-left: 5%;
  height: 30px;
  width: 100%;
  line-height: 30px;
  font-size: 13px;
  display: flex;
  align-items: center;
  color: white;
}
.pressure-title img{
  width: 13px;
  height: 13px;
}
.pressure-body{
  width: calc(100% - 50px);

  height: calc(100% - 50px);
}
.pressure-ring{
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(rgba(91, 92, 116, 0.4) 0 3deg, transparent 0deg 8deg);
  border-radius: 50%;
  -webkit-mask-image: radial-gradient(transparent 55%, black 0);
  mask-image: radial-gradient(transparent 55%, black 0);
  -webkit-clip-path:polygon(0 0%, 0% 83%, 50% 50%, 100% 83%,100% 0);
}
</style>