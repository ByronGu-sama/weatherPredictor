<script setup lang="ts">
  import {onMounted} from "vue";
  import {ElMessage} from "element-plus";

  onMounted(() => {
    getLocation()
  })
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
    },
        err => {
          switch (err.code){
            case 1:
              ElMessage({
                message:'无法获取定位权限，请手动选择城市',
                type:'warning'
              })
              break;
            case 2:
              ElMessage({
                message:'获取定位失败，请手动选择城市',
                type:'warning'
              })
              break;
            case 3:
              ElMessage({
                message:'获取位置超时，请手动选择城市',
                type:'warning'
              })
              break;
          }
      }
    )
  }
</script>

<template>
</template>

<style scoped>
</style>
