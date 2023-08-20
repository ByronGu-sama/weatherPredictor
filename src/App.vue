<script setup lang="ts">
</script>

<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<style scoped>
  body{
    margin: 0;
    padding: 0;
  }
  .main{
    background:url("./assets/pic/bg.jpg") fixed;
    background-size: cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
