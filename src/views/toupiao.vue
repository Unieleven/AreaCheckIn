<template>
  <div></div>
  <div class="toupiaoPage">
    <div class="listBox">
      <div class="listBox-title">
        <div>请选择你心目中的TOP10</div>
        <div>剩余票数：{{ remainingVotes }}</div>
      </div>
      <div class="list-bg">
        <div class="list">
          <div v-for="(item, index) in optionsList" :key="index" class="item">
            <img :src="item.imageUrl" alt="" @click="handleDetail(item)" />
            <div class="item-name">{{ item.title }}</div>
            <Button
              type="primary"
              :class="item.isSelect ? 'item-btn-selected' : 'item-btn'"
              @click="handleVote(item)"
              >{{ item.isSelect ? "已选择" : "选择" }}</Button
            >
          </div>
        </div>
      </div>
      <Button class="submit-btn" type="primary" @click="voteOption"
        >确认投票</Button
      >
    </div>
  </div>
  <!-- 手机号登录 -->
  <van-popup
    v-model:show="showLogin"
    round
    :close-on-click-overlay="false"
    :style="{ height: '270px', width: '90%', maxWidth: '350px' }"
  >
    <div class="bottom-title">登录</div>
    <div class="real-text">
      <text style="width: 20%">手机号</text>
      <van-field
        v-model="phone"
        center
        clearable
        placeholder="请输入手机号"
        type="number"
        style="width: 80%"
      >
        <template #button>
          <van-button
            color="#bd271e"
            size="small"
            type="primary"
            @click="sendCode"
            :disabled="state.codeButton"
            >{{ state.codetext }}</van-button
          >
        </template>
      </van-field>
    </div>
    <div class="real-text">
      <text style="width: 20%">验证码</text>
      <van-field
        style="width: 80%"
        v-model="phoneCode"
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
      />
    </div>
    <Button
      :disabled="!phone || !phoneCode"
      :loading="loginLoading"
      class="confirm"
      @click="verifyCode"
      >登录</Button
    >
  </van-popup>
  <!-- 奖品详情 -->
  <van-popup
    v-model:show="showDetail"
    round
    :close-on-click-overlay="true"
    closeable
    :style="{
      height: '425px',
      width: '90%',
      maxWidth: '320px',
    }"
  >
    <div class="detailBox">
      <div class="imgBox">
        <img :src="detailInfo.imageUrl" alt="" />
      </div>
      <div class="detail-title">{{ detailInfo.title }}</div>
      <div class="detail-manufacturer">{{ detailInfo.company }}</div>
      <div class="detail-description">
        {{ detailInfo.description }}
      </div>
    </div>
  </van-popup>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { Button, message } from "ant-design-vue";
import {
  sendVerifyCode,
  codeVerify,
  options,
  optionsApp,
  vote,
  voteApp,
} from "@/api/toupiao.js";
import { showSuccessToast, showFailToast } from "vant";
import { useRoute, useRouter } from "vue-router";
import transform from "ant-design-vue/es/_util/cssinjs/transformers/px2rem";
const route = useRoute();
// 登录按钮loading
const loginLoading = ref();
// 登录按钮禁用
const loginButton = ref(true);
// 显示登录窗口
const showLogin = ref(false);
// 显示奖品详情
const showDetail = ref(false);
// 投票项图片
const detailInfo = ref({});
const phone = ref("");
const phoneCode = ref("");
const remainingVotes = ref("");
const arrayVoteIds = ref([]);
const optionsList = ref([]);
const state = reactive({
  codeButton: false, // 是否禁用验证码按钮
  codetext: "获取验证码", // 验证码按钮文本
});
// 展示奖品详情
const handleDetail = (item) => {
  showDetail.value = true; // 打开详情弹窗
  detailInfo.value = item;
};
// 切换选中状态
const handleVote = (item) => {
  if (remainingVotes.value == 0 && !item.isSelect) {
    showFailToast("已超出投票数量限制");
    return;
  }
  item.isSelect = !item.isSelect; // 切换选中状态
  if (item.isSelect) {
    arrayVoteIds.value.push(item.id); // 添加到投票数组
  } else {
    const index = arrayVoteIds.value.indexOf(item.id);
    if (index > -1) {
      arrayVoteIds.value.splice(index, 1); // 从投票数组中移除
    }
  }
  remainingVotes.value = 10 - arrayVoteIds.value.length; // 更新剩余票数
  console.log(arrayVoteIds.value);
};
// 发送验证码
const sendCode = () => {
  console.log("发送验证码");
  console.log(phone.value.length);
  const phoneReg = /^1\d{10}$/;
  if (!phoneReg.test(phone.value)) {
    showFailToast("请输入正确的手机号");
    return;
  }
  sendVerifyCode({
    phone: phone.value,
  }).then((res) => {
    console.log(res);
  });
  state.codeButton = true;
  state.codetext = "60s";
  let countdownInterval;
  countdownInterval = setInterval(() => {
    let seconds = parseInt(state.codetext, 10); // 将倒计时文本转换为整数
    if (seconds > 0) {
      seconds--;
      state.codetext = `${seconds}s`; // 更新倒计时文本
    } else {
      clearInterval(countdownInterval); // 清除定时器
      state.codeButton = false; // 启用按钮
      state.codetext = "获取验证码"; // 清空倒计时文本
    }
  }, 1000); // 每秒更新一次
};
// 检验验证码
const verifyCode = () => {
  codeVerify({
    phone: phone.value,
    code: phoneCode.value,
  }).then((res) => {
    console.log(res);
    if (res.data) {
      localStorage.setItem("code", phoneCode.value);
      localStorage.setItem("phone", phone.value);
      showSuccessToast("登录成功");
      showLogin.value = false; // 关闭登录弹窗
      getList(); // 获取投票列表
    }
  });
};
// 获取列表
const getList = async () => {
  let code = localStorage.getItem("code");
  let phone = localStorage.getItem("phone");
  let token = localStorage.getItem("token");
  let res;
  if (token) {
    res = await optionsApp();
  } else {
    res = await options({
      phone,
      code,
    });
  }
  if (res.code == 400) {
    showLogin.value = true;
  } else {
    optionsList.value = res.data.voteOptionList || [];
    res.data.voteOptionList.forEach((item) => {
      if (item.isSelect) {
        arrayVoteIds.value.push(item.id); // 将选中的ID添加到数组
      }
    });
    remainingVotes.value = res.data.remainChance;
  }
};
// 投票
const voteOption = async () => {
  if (arrayVoteIds.value.length == 0) {
    showFailToast("请选择投票选项");
    return;
  }
  let code = localStorage.getItem("code");
  let phone = localStorage.getItem("phone");
  let voteIds = arrayVoteIds.value;
  let token = localStorage.getItem("token");
  let res;
  if (token) {
    res = await voteApp({
      voteIds,
    });
  } else {
    res = await vote({
      code,
      phone,
      voteIds,
    });
  }
  console.log(res);
  if (res.code == 0) {
    showSuccessToast("投票成功");
    arrayVoteIds.value = [];
    getList();
  }
};
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get("token");
  if (route.query.token || urlToken) {
    localStorage.setItem("token", route.query.token || urlToken);
  }
  setTimeout(() => {
    showLogin.value = !localStorage.getItem("token");
    getList();
  }, 0);
});
</script>
<style>
@media screen and (min-width: 768px) {
  body {
    max-width: 375px;
    margin: 0 auto;
  }
  .toupiaoPage {
    position: relative;
    padding: 0 15px;
    width: 100%;
    aspect-ratio: 250 / 483;
  }
}
.list-bg {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
}
.item {
  padding: 10px;
  width: calc((100% - 10px) / 2);
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .item-name {
    /* text-align: left; */
    font-size: 14px;
    width: 80%;
    margin: 5px auto;
  }

  .item-btn-disabled {
    background: #f0f0f0;
    color: black;
  }
}
.item img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}
div {
  box-sizing: border-box;
}
.toupiaoPage {
  padding: 0 15px;
  width: 100%;
  aspect-ratio: 250 / 483;
  /* height: 100vh; */
  background-image: url("../image/hs/toupiao.png");
  background-size: 100% 100%;
  padding-top: 220px;
}
.listBox {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  border: 3px solid #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 15px 10px 0;
  overflow: hidden;
  /* position: relative; */
}
.listBox-title {
  font-size: 16px;
  margin-left: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list-bg {
  width: 100%;
  height: calc(100% - 60px);
  /* height: 100%; */
  background: linear-gradient(
    180deg,
    #fec4bf 0%,
    rgba(254, 196, 191, 0.1) 100%
  );
  border: 3px solid #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 15px 10px 50px;
  overflow-y: auto;
  scrollbar-width: none;
}
.list {
  display: flex;
  gap: 10px;
  height: fit-content;
  flex-wrap: wrap;
}
.real-text {
  width: 90%;
  margin: 0 auto;
  display: flex;
  border-bottom: 2px solid #e7e7e7;
  margin: 20px auto;
  align-items: center;
}
.bottom-title {
  margin-top: 20px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: #3d3d3d;
}
.submit-btn {
  width: 80%;
  background-color: #c7000b !important;
  position: absolute;
  left: 10%;
  bottom: 40px;
}
.item-btn-selected {
  margin-top: auto;
  width: 60px;
  background-color: #c7000b !important;
  color: #fff !important;
  border: none;
  padding: 0px;
  height: 28px;
  box-shadow: none;
}
.item-btn {
  margin-top: auto;
  width: 60px;
  background-color: #f0f0f0 !important;
  color: black;
  padding: 0px;
  height: 28px;
  box-shadow: none;
  &:hover {
    background-color: #f0f0f0 !important;
    color: black !important;
  }
  &:disabled {
    background-color: #c7000b !important;
    color: #fff !important;
    border: none;
  }
}
.detailBox {
  padding: 45px 15px 10px;
  height: 100%;
  text-align: left;
  background-color: #f7e4e2;
  overflow-y: auto;
}
.imgBox {
  background-color: #fff;
  border-radius: 10px;
  width: 100%;
  height: auto;
  margin: 0 auto;
  img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    display: block;
  }
}
.detail-title {
  font-size: 14px;
  font-weight: 500;
  margin: 20px 0 10px;
}
.detail-manufacturer {
  font-size: 14px;
  color: #999;
}
.detail-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-top: 10px;
  height: 105px;
  overflow: auto;
  scrollbar-width: none;
}
</style>
