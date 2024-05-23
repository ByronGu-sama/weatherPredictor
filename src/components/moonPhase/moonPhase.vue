<script setup lang="ts">
import {useAstronomyStore} from "../../store/astronomyEditor";
import commonUtils from "../../utils/commonUtils";

const astronomyStore = useAstronomyStore()

const getSpecificMoonPhase = () => {
  let temp = new Date()
  let hour = temp.getHours()
  return ["@/assets/pic/moonPhase/"+astronomyStore.moonPhase.moonPhase[hour].icon+".webp",astronomyStore.moonPhase.moonPhase[hour].name]
}

</script>

<template>
  <div class="module-main" v-if="astronomyStore.moonPhase">
    <div class="module-title">
      <img src="../../assets/icons/moon.svg" style="width: 13px;height: 13px" alt="">&nbsp;{{getSpecificMoonPhase()[1]}}
    </div>
    <div class="moon-middle">
      <img :src="commonUtils.require(getSpecificMoonPhase()[0])" class="moon" alt="">
    </div>
  </div>
</template>

<style scoped>
.moon-middle{
  width: 100%;
  height: calc(100% - 30px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.moon{
  width: 120px;
  height: 120px;

}
</style>