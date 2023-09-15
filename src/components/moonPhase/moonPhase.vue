<script setup lang="ts">
import {useAstronomyStore} from "../../store/astronomyEditor";

const astronomyStore = useAstronomyStore()

const getSpecificMoonPhase = () => {
  let temp = new Date()
  let hour = temp.getHours()
  return [astronomyStore.moonPhase.moonPhase[hour].icon,astronomyStore.moonPhase.moonPhase[hour].name]
}

</script>

<template>
  <div class="module-main" v-if="astronomyStore.moonPhase">
    <div class="module-title">
      <img src="../../assets/icons/moon.svg" style="width: 13px;height: 13px">&nbsp;{{getSpecificMoonPhase()[1]}}
    </div>
    <div class="moon-middle">
      <i :class='`qi-${getSpecificMoonPhase()[0]}`'></i>
    </div>
  </div>
</template>

<style scoped>
.moon-middle{
  width: 100%;
  height: calc(100% - 30px);
  color: white;
}
</style>