<script setup lang="ts">
import {useWeatherStore} from "../../store/weatherEditor";

const weatherStore = useWeatherStore()

</script>

<template>
  <div class="module-main" v-if="weatherStore.historicalWeather_10d">
    <div class="module-title">
      <img src="../../assets/icons/trend.svg">&emsp;趋势
    </div>
    <div class="visibility-middle">

    </div>
  </div>
</template>

<style scoped>

</style>