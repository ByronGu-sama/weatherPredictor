<script setup lang="ts">

</script>

<template>
  <div class="tips-main">
    <el-tabs tab-position="left" style="height: 100%" class="tips-tabs">
      <el-tab-pane label="怎么用？">
        <el-scrollbar height="100vh">
          <div class="how-to-use">
            <h3>一般来说，三天内的天气预报值得参考，三天后的预报就是图一乐</h3>

            <h2>怎么看懂页面数据代表的不同含义呢？🧐</h2>
            <h3>小时天气预报</h3>
            <img src="../../assets/tipsPic/1.webp" alt="" style="width: 70%;">
            <div class="tips-wrapper">
              <p>可以看到顶部文字代表着对未来几个小时天气的总结</p>
              <p>第二行的数字显然代表着未来24小时的时间</p>
              <p>第三行则是对应的天气图标</p>
              <p>第四行是对应时间点的气温预测</p>
            </div>
            <br>
            <h3>每日天气预报</h3>
            <img src="../../assets/tipsPic/2.webp" alt="" style="width: 20%;">
            <div class="tips-wrapper">
              <p>每日天气预报中右侧区域可以代表好几个信息</p>
              <p>首先是左边和右边的温度分别意味着这一天的预测最低温和最低温</p>
              <p>中间黄色条状区域有以下含义：</p>
              <p>1、黄色条越长就意味着这一天可能是接下来的10天中温差最大的，反之，黄色条越短就意味着温差越小；</p>
              <p>2、黄色条越靠右则说明这一天的温度可能是未来十天内最高的，反之，越靠左则说明这一天的温度可能是未来十天内相对最低的</p>
            </div>
            <br>
            <h3>紫外线指数</h3>
            <img src="../../assets/tipsPic/3.webp" alt="" style="width: 20%;">
            <div class="tips-wrapper">
              <p>紫外线指数分为1-10级</p>
              <p>底部的文字会跟随紫外线等级作出相应的改变</p>
            </div>
            <br>
            <h3>太阳轨迹</h3>
            <img src="../../assets/tipsPic/4.webp" alt="" style="width: 20%;">
            <div class="tips-wrapper">
              <p>太阳轨迹能较好的模拟出太阳跟随时间变化的运动轨迹，但仅作参考</p>
            </div>
            <br>
            <h3>周均最高温</h3>
            <img src="../../assets/tipsPic/5.webp" alt="" style="width: 20%;">
            <div class="tips-wrapper">
              <p>周均最高温会以包含今天在内的未来十天最高温度为基准，算出今日最高温在未来十天平均最高温上的增减。能一定程度上反应天气变化</p>
            </div>
            <br>
            <h3>体感温度</h3>
            <img src="../../assets/tipsPic/6.webp" alt="" style="width: 20%;">
            <div class="tips-wrapper">
              <p>体感温度的计算受到气温，风速和空气相对湿度的影响，粗略地说就是在高湿度的条件下，冷得更冷、热得更热</p>
            </div>
            <br>
            <h3>台风轨迹</h3>
            <img src="../../assets/tipsPic/7.webp" alt="" style="width: 20%;">
            <div class="tips-wrapper">
              <p>目前只能显示西太平洋区域的台风</p>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane label="终点">
        <span>顾骁俊   2023/10/16</span>
        <br>
        🦊<a href="https://github.com/Hanserr/weatherPredictor" target="_blank" style="font-size: 20px">项目地址（暂时封存中）</a>
      </el-tab-pane>
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
.el-tab-pane{
  text-align: left;
}
.tips-body{
  font-size: 14px;
}
.tips-wrapper{
  width: 1000px;
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(138, 188, 209, 0.3);
}
.how-to-use img{
  border-radius: 10px;
}
.tips-wrapper p{
  color: #606266;
}
</style>