<template>
  <div :class="isHor ? 'yContent' : 'xContent'">
    <div :class="isHor ? 'yMain' : 'xMain'">
      <div class="viewIndex">
        <!-- <img src="../image/H5long/长图.jpg" alt="" /> -->
        <div ref="button1" class="button button-o" @click="showInfo('info-1')">
          了解信号塔
        </div>
        <div id="info-1" class="info">
          <img
            @click="showVideo(videoArr[0], 'info-1')"
            src="../image/H5long/信号塔弹出图.png"
            alt=""
          />
        </div>
        <div id="info-2" class="info">
          <img
            @click="showVideo(videoArr[0])"
            src="../image/H5long/信号塔弹出图.png"
            alt=""
          />
        </div>
        <div id="info-3" class="info">
          <img src="../image/H5long/信号塔弹出图.png" alt="" />
        </div>
        <div ref="button2" class="button button-t" @click="showInfo('info-2')">
          了解信号塔
        </div>
        <div ref="button3" class="button button-d" @click="showInfo('info-3')">
          了解信号塔
        </div>
      </div>
    </div>
    <!-- 视频 -->
    <div
      v-show="playVideo"
      :class="isHor ? 'videoModal yVideo' : 'videoModal xVideo'"
      @touchmove.prevent
      @wheel.prevent
    >
      <video
        controls
        :src="videoSrc"
        class="video"
        poster="../image/H5long/framdemo/帧-002625.jpg"
      ></video>
      <div>
        <CloseCircleOutlined
          style="color: #ffffff; margin-top: 15px; font-size: 25px"
          @click="close"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { CloseCircleOutlined } from "@ant-design/icons-vue";
const isHor = ref(false);
const button1 = ref(null);
const button2 = ref(null);
const button3 = ref(null);
const playVideo = ref(false);
const videoSrc = ref("");
const videoArr = ref([
  "https://uat.issmart.com.cn/%E9%A3%9E%E6%9C%BA%E8%A7%86%E9%A2%91demo%E7%9F%AD%E7%89%88%E8%A7%86%E9%A2%91.mov",
]);
const showVideo = (val, id) => {
  console.log(val, id);
  const element = document.getElementById(id);
  if (element.classList.contains("active")) {
    playVideo.value = true;
    videoSrc.value = val;
  }
};
const close = () => {
  playVideo.value = false;
};
// 已经显示过的按钮集合
const showInfo = (val) => {
  // 获取类名是info的元素
  const infoElements = document.getElementById(val);
  infoElements.classList.add("active");
};
const checkVisibility = () => {
  const buttons = [button1.value, button2.value, button3.value];
  buttons.forEach((button) => {
    if (!button) return;
    const rect = button.getBoundingClientRect();
    if (isHor.value) {
      // 横屏
      // console.log(rect.left, window.innerWidth * 0.9);
      if (rect.left < window.innerWidth * 0.9) {
        button.classList.add("active");
      }
    } else {
      // console.log(rect.top, window.innerHeight * 0.9);
      // 竖屏
      if (rect.top < window.innerHeight * 0.9) {
        button.classList.add("active");
      }
    }
  });
  const infoElements = document.getElementsByClassName("info");
  // 为每个元素移除 'active' 类
  for (let i = 0; i < infoElements.length; i++) {
    const infoElement = infoElements[i];
    infoElement.classList.remove("active");
  }
};
const handleResize = () => {
  if (window.innerHeight > window.innerWidth) {
    isHor.value = false;
  } else {
    isHor.value = true;
  }
};
onMounted(() => {
  console.log(isHor.value);
  handleResize();
  // checkVisibility();
  window.addEventListener("scroll", checkVisibility);
  window.addEventListener("resize", handleResize);
});
onUnmounted(() => {
  // 移除滚动事件监听器
  window.removeEventListener("scroll", checkVisibility);
  window.removeEventListener("resize", handleResize);
});
</script>
<style lang="less" scoped>
.videoModal {
  padding: 20px 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.yVideo {
  width: 100vw;
}
.xVideo {
  width: 105vh;
  height: 105vw;
  transform-origin: center;
  transform: rotate(90deg) translate(21%, 44%);
}
.video {
  width: 60%;
  height: 80%;
  margin: 0 auto;
  object-fit: cover;
}
.button {
  position: absolute;
  width: 163px;
  height: 51px;
  line-height: 51px;
  background-color: rgb(255, 246, 5);
  opacity: 0;
  transition: all 1s ease-in-out;
  transform: scale(0);
}
.info {
  opacity: 0;
  position: absolute;
  width: 270px;
  transition: all 0.5s ease-in-out;
}
#info-1 {
  top: 90px;
  left: 26.3%;
}
#info-2 {
  height: 150px;
  top: 90px;
  left: 61.5%;
}
#info-3 {
  height: 150px;
  top: 28px;
  right: 0;
}
.active {
  opacity: 1;
  transform: scale(1);
}
.button-o {
  top: 72%;
  left: 28.2%;
}
.button-t {
  top: 66%;
  left: 63%;
}
.button-d {
  top: 48%;
  right: 1.5%;
}
.xContent {
  min-height: 100vh;
  position: relative;
  // overflow-x: auto;
  .xMain {
    transform: rotate(90deg);
    .viewIndex {
      position: relative;
      width: 3167px;
      height: 100vw;
      background-image: url("../image/H5long/长图.jpg");
      background-size: 100% 100%;
      img {
        width: auto;
        height: 100%;
        display: block;
      }
    }
  }
}

.yMain {
  .viewIndex {
    overflow-x: auto;
    position: relative;
    width: 3167px;
    height: 100vh;
    background-image: url("../image/H5long/长图.jpg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    img {
      width: auto;
      height: 100%;
      display: block;
    }
  }
}
.info {
  img {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
  }
}
</style>
