<script setup lang="ts">
import {ref, watch} from "vue";
import axios from "axios";
import request from '../../request/Url'
import {ElMessage} from "element-plus";
let props = defineProps(['code','locationName'])
let uviInfo = ref<any>()
let barWrap = ref<HTMLElement>()

//获取uvi数据
const getUvi = (location:string) => {
  axios.get(`${request.GET_UVI_24H}location=${location}&type=5`).then(res => {
    if(res.data.code == 200){
      uviInfo.value = res.data.daily[0]
    }else{
      ElMessage({
        message:'获取紫外线指数失败',
        type:"error"
      })
    }
  })
}

//根据紫外线强度返回防护建议
const defenseTip = (level:string) => {
  switch (level){
    case '1':
      return '紫外线较弱,做好基础防晒'
    case '2':
      return '紫外线弱,做好一般防晒'
    case '3':
      return '紫外线强度中等,减少户外活动'
    case '4':
      return '紫外线较强,做好物理防晒'
    case '5':
      return '紫外线强,避免户外活动'
  }
}

//计算指示点左边距
const calcMargin = (level:string) => {
  let barWidth = barWrap.value?.clientWidth
  return 25*(parseInt(level)-1)/100*(barWidth-6)+'px'
}

watch(() => [props.code,props.locationName],(n) => {
  getUvi(n[0])
})
</script>

<template>
  <div class="uviMain" v-if="uviInfo">
    <div class="uviBody-top">
      <i class="qi-100"></i>&nbsp;紫外线指数
    </div>
    <div class="uviBody-middle">
      <div class="uviBody-middle-top">
        <span style="font-size: 20px;margin-left: 15px">{{uviInfo.level*2}}</span>
        <br>
        <span style="font-size: 25px;margin-left: 10px">{{uviInfo.category}}</span>
      </div>
      <div class="uviBody-middle-bottom">
        <div class="uviBody-middle-bar" ref="barWrap">
          <div class="uviIndicator" :style="{marginLeft:calcMargin(uviInfo.level)}"></div>
        </div>
      </div>
    </div>
    <div class="uviBody-bottom">
      <span>{{defenseTip(uviInfo.level)}}</span>
    </div>
  </div>
</template>

<style scoped>
.uviMain{
  width: 100%;
  height: 100%;
  color: white;
}
.uviBody-top{
  height: 30px;
  width: 100%;
  text-align: left;
  margin-left: 5%;
  font-size: 13px;
  line-height: 30px;
}
.uviBody-middle{
  width: 100%;
  height: calc(100% - 60px);
}
.uviBody-bottom{
  height: 30px;
  width: 100%;
  font-size: 12px;
  text-align: left;
  margin-left: 5%;
  font-weight: bold;
}
.uviBody-middle-top{
  width: 100%;
  height: 70%;
  text-align: left;
  font-weight: bold;
}
.uviBody-middle-bottom{
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.uviBody-middle-bar{
  width: 90%;
  height: 6px;
  border-radius: 3px;
  background: -webkit-linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  background: -moz-linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  background: -o-linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  background: linear-gradient(to right,rgb(110,212,94),rgb(247,205,71),rgb(240,148,60),rgb(235,85,90),rgb(185,93,217));
  display: flex;
  align-items: center;
}
.uviIndicator{
  background-color: white;
  width: 6px;
  height: 6px;
  border-radius: 3px;
  transition: 0.1s linear;
}
</style>