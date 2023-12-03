<script setup lang="ts">
  import {onMounted} from "vue";
  import router from "../../router";

  const rain = () => {
    let cloud = document.querySelector('.cloud')
    let e = document.createElement('div')
    let left = Math.floor(Math.random()*310)
    let width = Math.random()*5
    let height = Math.random()*50
    let duration = Math.random*0.5
    e.classList.add('drop')
    cloud!.appendChild(e)
    e.style.left = left+'px'
    e.style.width = 0.5+width+'px'
    e.style.height = 0.5+height+'px'
    e.style.animationDuration = 1+duration+'s'

    setTimeout(() => {
      cloud!.removeChild(e)
    },2000)
  }

  const toHome = () => {
    router.push('/')
  }

  onMounted(() => {
    setInterval(() => {
      rain()
    },20)
  })
</script>

<template>
<div class="notFoundMain">
  <span class="title-404">404 Not Found</span>
  <button @click="toHome">返回首页</button>
  <div class="container">
    <div class="cloud"></div>
  </div>
</div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.notFoundMain{
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: #1b1b1b;
}
.container{
  position: relative;
  height: 400px;
  width: 100%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.container .cloud{
  position: relative;
  width: 320px;
  height: 100px;
  border-radius: 100px;
  background-color: #fff;
  filter: drop-shadow(8px 8px 0 #0005);
  animation: animateCloud 2s steps(1) infinite;
}
@keyframes animateCloud {
  0%{
    filter: drop-shadow(8px 8px 0 #0001) drop-shadow(0 0 0 #fff) brightness(1);
  }
  95%{
    filter: drop-shadow(8px 8px 0 #0001) drop-shadow(0 0 50px #fff5) brightness(10);
  }
}
.container .cloud::before{
  content: '';
  position: absolute;
  top: -50px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-color: #484f59;
  left: 40px;
  box-shadow: 90px -10px 0 30px #484f59;
}
.container .cloud::after{
  z-index:1000;
  content: '';
  position: absolute;
  inset: 0;
  background: #484F59;
  border-radius: 100px ;
}
.drop{
  position: absolute;
  top: 40px;
  background-color: #05a2eb;
  width: 2px;
  height: 10px;
  transform-origin: bottom;
  animation: animate 2s linear infinite;
}
@keyframes animate {
  0%{
    transform: translateY(0) scaleY(1);
  }
  70%{
    transform: translateY(360px) scaleY(1);
  }
  80%{
    transform: translateY(360px) scaleY(0.2);
  }
  100%{
    transform: translateY(360px) scaleY(0) scaleX(15);
  }
}
.title-404{
  font-size: 70px;
  position: absolute;
  top: 30px;
  left: 50px;
  color: #484F59;
  text-shadow: 3px 3px 3px 3px  white;
}
.notFoundMain > button{
  width: 120px;
  height: 40px;
  background-color: transparent;
  color: #484F59;
  border-radius: 10px;
  border: 1px solid #484F59;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  top: 130px;
  left: 50px;
  transition: linear 100ms;
}
.notFoundMain > button:hover {
  box-shadow: 1px 1px 10px 1px #8f8e8e;
}
</style>