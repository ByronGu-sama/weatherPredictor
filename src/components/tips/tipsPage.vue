<script setup lang="ts">

</script>

<template>
  <div class="tips-main">
    <el-tabs tab-position="left" style="height: 100%" class="tips-tabs">
      <el-tab-pane label="a">User</el-tab-pane>
      <el-tab-pane label="Config">Config</el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.tips-main{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.tips-tabs{
  width: 100%;
  height: 100%;
}
</style>