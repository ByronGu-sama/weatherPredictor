<script setup lang="ts">
import {ref, watch} from "vue";
import commonUtils from "../../utils/commonUtils.ts";
import {alert} from "/src/utils/testDataList.ts"

let notification = ref(false);

const pushAlert = () => {
  let temp = []
  for(let i of alert.warning){
    temp.push({
      title:i.title,
      content:i.text,
      type:'warning',
    })
  }
  commonUtils.pushNotification(temp,8000)
}

watch(notification,(n) => {
  if(n){
    pushAlert()
  }
})

</script>

<template>
  <div class="controller-body">
    天气预警测试&emsp;<el-switch size="small" v-model="notification" />
  </div>
</template>

<style scoped>
.controller-body{
  width: 125px;
  height: 24px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  border-radius: 10px;
  border: 1px solid rgba(227, 227, 227, 0.39);
  font-size: 12px;
}
</style>