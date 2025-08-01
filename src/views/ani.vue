<template>
  <div
    class="scroll-container"
    ref="scrollContainer"
    @scroll="handleScroll"
    :class="{ rotated: isPortrait }"
  >
    <!-- 第一部分：普通图片 -->
    <div class="section image-section">
      <img src="../image/H5long/信号塔弹出图.png" class="full-image" />
    </div>

    <!-- 第二部分：文字内容 -->
    <div class="section text-section">
      <h1>到动画页面</h1>
      <p>向右滚动，进入逐帧播放区域。</p>
    </div>

    <!-- 第三部分：逐帧播放的 IMG -->
    <div ref="animationSection" class="section frame-section">
      <img :src="currentFrame" class="frame" alt="animation frame" />
    </div>

    <!-- 第四部分：普通内容 -->
    <div class="section normal-content">
      <h2>普通内容部分</h2>
      <p>这里是普通内容，这里是普通内容这里是普通内容。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 逐帧动画相关
const startFrame = 2625;
const endFrame = 2861;
const totalFrames = endFrame - startFrame + 1;
const frames = Array.from(
  { length: totalFrames },
  (_, i) => `/framdemo/帧-${(startFrame + i).toString().padStart(6, "0")}.jpg`
);

const currentFrame = ref(frames[0]);
const animationSection = ref(null);
const scrollContainer = ref(null);
const isPlaying = ref(false);
const isPortrait = ref(window.innerHeight > window.innerWidth);

// **监听屏幕旋转**
const checkOrientation = () => {
  isPortrait.value = window.innerHeight > window.innerWidth;
  // 旋转时重设滚动方向
  if (isPortrait.value) {
    scrollContainer.value.style.flexDirection = "column";
    scrollContainer.value.scrollTop = scrollContainer.value.scrollLeft;
  } else {
    scrollContainer.value.style.flexDirection = "row";
    scrollContainer.value.scrollLeft = scrollContainer.value.scrollTop;
  }
};

// **滚动事件：控制帧动画**
const handleScroll = () => {
  if (!isPlaying.value) return;

  const scrollPos = isPortrait.value
    ? scrollContainer.value.scrollTop
    : scrollContainer.value.scrollLeft;
  const maxScroll = isPortrait.value
    ? scrollContainer.value.scrollHeight - window.innerHeight
    : scrollContainer.value.scrollWidth - window.innerWidth;

  // 计算当前帧索引
  const frameIndex = Math.min(
    totalFrames - 1,
    Math.floor((scrollPos / maxScroll) * totalFrames)
  );
  currentFrame.value = frames[frameIndex];
};

// **监听动画盒子进入视口，控制播放**
const observer = new IntersectionObserver(
  (entries) => {
    isPlaying.value = entries[0].isIntersecting;
  },
  { threshold: 0.3 }
);

const preloadImages = (
  basePath,
  startFrame,
  endFrame,
  prefix = "帧-",
  extension = "jpg"
) => {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const images = [];
    const frameCount = endFrame - startFrame + 1; // 计算帧数

    for (let i = startFrame; i <= endFrame; i++) {
      const img = new Image();
      img.src = `${basePath}/${prefix}${i
        .toString()
        .padStart(6, "0")}.${extension}`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          resolve(images);
        }
      };

      images.push(img);
    }
  });
};

onMounted(() => {
  const basePath = "/framdemo"; // 你的图片存放路径
  const startFrame = 2625; // 起始帧
  const endFrame = 2861; // 结束帧
  preloadImages(basePath, startFrame, endFrame).then((images) => {
    console.log("所有图片预加载完成！", images);
  });
  observer.observe(animationSection.value);
  scrollContainer.value.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", checkOrientation); 
  checkOrientation();
});

onUnmounted(() => {
  observer.disconnect();
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
  window.removeEventListener("resize", checkOrientation);
});
</script>

<style scoped>
/* 横屏默认样式 */
.scroll-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
}

/* 竖屏时旋转 90 度 */
.scroll-container.rotated {
  width: 100vw;
  /* transform: rotate(90deg); */
  overflow-y: auto;
  overflow-x: hidden;
}

/* 每个部分 */
.section {
  /* width: 100vw; */
  height: 100vh;
  flex-shrink: 0;
}

/* 适配旋转内容 */
.scroll-container.rotated .section {
  width: 100vw;
  height: 50vh;
}

/* 其他样式 */
.image-section {
  background: #eee;
}

.full-image {
  width: 80%;
  max-width: 600px;
  height: auto;
}

.text-section {
  background: #ddd;
  flex-direction: column;
  text-align: center;
  padding: 20px;
}
.scroll-container.rotated .frame-section {
  aspect-ratio: 16 / 9;
  width: 100vw;
  height: auto;
}
.frame-section {
  aspect-ratio: 16 / 9;
  /* background: black; */
}

.frame {
  width: 100%;
  max-height: 100%;
  height: 100%;
}

.normal-content {
  background: #ccc;
  text-align: center;
  padding: 40px;
}
</style>
