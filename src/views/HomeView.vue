<template>
  <div class="main">
    <!-- <div class="Title">峰会</div> -->
    <div class="userInfo" v-if="state.logon">
      <!-- <div class="user-avatar">
        <img src="../image/hs/hsavatar.jpg" alt="" />
      </div> -->
      <div class="user-name">
        <div>{{ state.userInfo.name }}</div>
        <div>{{ state.userInfo.phone }}</div>
      </div>
    </div>
    <div v-else class="Nlogon">
      <div>请您登录</div>
      <div class="user-avatar" style="margin-top: 10px">
        <!-- <img src="../image/hs/hsavatar.jpg" alt="" /> -->
      </div>
    </div>

    <div class="bottom">
      <div class="listCard">
        <div class="card" @click="openRealCard">
          <img class="card-img" src="../image/hs/name10@1x.png" mode="" />
          <div class="card-text">实名认证</div>
        </div>
        <div class="card" @click="goPrivacy">
          <img class="card-img" src="../image/hs/privacy11@1x.png" mode="" />
          <div class="card-text">隐私政策</div>
        </div>
        <div class="card" @click="accountCancel">
          <img class="card-img" src="../image/hs/account13@1x.png" mode="" />
          <div class="card-text">账号注销</div>
        </div>
      </div>
      <div class="qrCode">
        <div class="qr-text">参会码</div>
        <div
          style="
            padding: 10px;
            background-color: white;
            border-radius: 10px;
            width: 280px;
            height: 280px;
          "
        >
          <a-qrcode v-if="showQrcode" :value="qrcodeUrl" :size="size" />
          <!-- <div class="qrCode" id="qrcode"></div> -->
        </div>
        <div
          v-if="state.checkinStatus"
          class="qr-sign"
          style="background: rgba(58, 140, 247, 0.1)"
        >
          已签到
        </div>
        <div
          v-else
          class="qr-sign"
          style="background: rgba(45, 46, 46, 0.1); color: #8a8585"
        >
          未签到
        </div>
      </div>
    </div>
    <!-- 实名认证 popup -->
    <van-popup
      v-model:show="showCenter"
      round
      :close-on-click-overlay="false"
      :style="{ height: '300px' }"
    >
      <div class="bottom-title">实名认证</div>
      <div class="real-text">
        <text>真实姓名</text>
        <van-field
          style="width: 75%; font-size: 16px"
          v-model="realName"
          type="text"
          placeholder="请输入真实姓名"
        />
      </div>
      <div class="real-text">
        <text>身份证号</text>
        <van-field
          style="width: 75%; font-size: 16px"
          v-model="realNumber"
          placeholder="请输入身份证号"
        />
      </div>
      <div style="line-height: 40px" class="confirm" @click="closeReal">
        确认
      </div>
    </van-popup>
    <!-- 展示实名认证 -->
    <van-popup
      v-model:show="showReal"
      round
      closeable
      :close-on-click-overlay="false"
      :style="{ height: '220px' }"
    >
      <div class="bottom-title">实名认证</div>
      <div class="real-text">
        <text>真实姓名</text>
        <van-field
          style="width: 75%; font-size: 16px"
          v-model="realName"
          type="text"
          placeholder="请输入真实姓名"
        />
      </div>
      <div class="real-text">
        <text>身份证号</text>
        <van-field
          style="width: 75%; font-size: 16px"
          v-model="realNumber"
          placeholder="请输入身份证号"
        />
      </div>
    </van-popup>
    <!-- 手机号登录 -->
    <van-popup
      v-model:show="showLogin"
      round
      :close-on-click-overlay="false"
      :style="{ height: '300px' }"
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
        />
      </div>
      <Button
        :disabled="loginButton"
        :loading="loginLoading"
        class="confirm"
        @click="Login"
        >登录</Button
      >
    </van-popup>
    <!-- 温馨提示 -->
    <van-popup
      v-model:show="showTip"
      round
      :close-on-click-overlay="false"
      :style="{ height: '440px' }"
    >
      <div class="bottom-title">温馨提示</div>
      <div class="tipText" style="margin-top: 20px">
        尊敬的嘉宾，期待您的莅临！
      </div>
      <div class="tipText">
        1、根据国家政策相关规定及公安部门要求，注册需采用实名制方式，请您如实填写本人姓名与证件号码。
      </div>
      <div class="tipText">
        2、完成认证后，领取参会二维码可现场换领卡证在场内通行。
      </div>
      <div class="tipText">
        3、为提升客户体验和入场效率，在闸机处请刷身份证或进行人脸识别入场。
      </div>

      <Button
        style="margin-top: 20px; width: 88%"
        :disabled="!yschecked"
        class="confirm"
        @click="understand"
        >已了解</Button
      >
      <div style="display: flex; margin-left: 22px; margin-top: 20px">
        <van-checkbox
          v-model="authFaceRecognition"
          shape="square"
          checked-color="#bd271e"
        >
          <div style="font-size: 14px">是否授权人脸数据</div>
        </van-checkbox>
      </div>
      <div style="display: flex; margin-left: 22px; margin-top: 10px">
        <van-checkbox
          v-model="yschecked"
          shape="square"
          checked-color="#bd271e"
        >
          <div style="font-size: 14px">
            我理解并同意
            <a @click.stop="goPrivacy" style="color: red">《隐私协议》</a
            >相关规定和说明
          </div>
        </van-checkbox>
      </div>
    </van-popup>
    <!-- 账号注销 -->
    <van-popup
      v-model:show="showlogout"
      round
      closeable
      :close-on-click-overlay="false"
      :style="{ height: '270px' }"
    >
      <div
        class="bottom-title"
        style="
          margin-top: 35px;
          text-align: left;
          margin-left: 22px;
          font-size: 18px;
        "
      >
        <van-icon
          name="warning"
          color="#bd271e"
          size="20px"
          style="margin-right: 10px"
        />账号注销
      </div>
      <div class="tipText" style="margin-top: 20px">
        您是否确认注销，账号注销后进入H5将需要重新完成实名认证。
      </div>
      <div
        style="line-height: 40px; margin-top: 40px"
        class="confirm"
        @click="confirmLogout"
      >
        确认注销
      </div>
    </van-popup>
    <!-- 未注册 -->
    <van-popup
      v-model:show="showsign"
      round
      :close-on-click-overlay="false"
      :style="{ height: '230px' }"
    >
      <div
        class="bottom-title"
        style="
          margin-top: 35px;
          display: flex;
          flex-direction: column;
          font-size: 20px;
        "
      >
        <van-icon
          name="warning"
          color="#bd271e"
          size="40px"
          style="margin-right: 10px; margin-bottom: 20px"
        />未查询到您的信息
      </div>
      <div class="tipText" style="margin-top: 20px; text-align: center">
        请先联系管理员注册后再使用小程序
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import QRCode from "qrcodejs2";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Button, message } from "ant-design-vue";
import { showSuccessToast, showFailToast } from "vant";
import { getCode, login, realCard, account, certificate } from "@/api/index.js";
const store = useStore();
const router = useRouter();
const qrcodeUrl = ref("");
const size = ref(260);
// 登录按钮loading
const loginLoading = ref();
// 登录按钮禁用
const loginButton = ref(false);
// 登录
const showLogin = ref(false);
const phone = ref("");
const phoneCode = ref("");
const yschecked = ref(false);
// 未注册
const showsign = ref(false);
// 展示实名认证
const showReal = ref(false);
// 温馨提示
const showTip = ref(false);
// 账号注销
const showlogout = ref(false);
// 实名认证
const showCenter = ref(false);
const realNumber = ref("");
const realName = ref("");
const number = ref("number");
// 显示二维码
const showQrcode = ref(false);
// 授权人脸识别
const authFaceRecognition = ref(false);

const state = reactive({
  logon: false,
  avatar: "111.png",
  userInfo: { name: "", phone: "" },
  checkinStatus: false,
  codetext: "获取验证码",
  codeButton: false,
});
// 登录按钮
const Login = () => {
  // console.log("denglu");
  if (phone.value.length != 11 || phoneCode.value.length < 1) {
    showFailToast("请输入正确的手机号和验证码");
    return;
  }
  loginLoading.value = true;
  loginButton.value = true;
  login({
    phone: phone.value,
    code: phoneCode.value,
    authFaceRecognition: authFaceRecognition.value,
  }).then((res) => {
    console.log(res);
    if (res.code == 0) {
      loginLoading.value = false;
      showQrcode.value = true;
      state.logon = true;
      state.userInfo.name = res.data.memberName;
      state.userInfo.phone = res.data.phone;
      showLogin.value = false;
      if (!res.data.isRegistered) {
        showsign.value = true;
      } else {
        showSuccessToast("登录成功");
        // showTip.value = true;
        if (!res.data.isCertificated) {
          showCenter.value = true;
        } else {
          showCenter.value = false;
        }
        qrcodeUrl.value = res.data.qrcode;
        localStorage.setItem("token", res.data.token);
        state.checkinStatus = res.data.checkinStatus;
      }
    } else {
      showFailToast(res.message);
      loginButton.value = false;
      loginLoading.value = false;
    }
  });
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
  getCode({
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

// 打开实名认证
const openRealCard = () => {
  showReal.value = true;
  realCard().then((res) => {
    console.log(res);
    if (res.code == 0) {
      realName.value = res.data.realName;
      realNumber.value = res.data.idcard;
    }
  });
};
// 打开隐私协议
const goPrivacy = () => {
  router.push({
    name: "privacy",
  });
};
// 打开账号注销
const accountCancel = () => {
  showlogout.value = true;
};
// 确认注销
const confirmLogout = () => {
  console.log("zhuxiao");
  account().then((res) => {
    console.log(res);
    if (res.code == 0) {
      showlogout.value = false;
      showQrcode.value = false;
      state.logon = false;
      showLogin.value = true;
      realName.value = "";
      realNumber.value = "";
    }
  });
};
// 关闭实名
const closeReal = () => {
  if (realName.value.length < 1 || realNumber.value.length != 18) {
    showFailToast("请输入正确的身份信息");
    return;
  }
  certificate({
    name: realName.value,
    idcard: realNumber.value,
    authFaceRecognition: authFaceRecognition.value,
  }).then((res) => {
    console.log(res);
    if (res.code == 0) {
      showSuccessToast("认证成功");
      showCenter.value = false;
    } else {
      showFailToast(res.message);
    }
  });
};
// 关闭温馨提示
const understand = () => {
  showTip.value = false;
  showLogin.value = true;
  console.log(authFaceRecognition.value);
};
onMounted(() => {
  realCard().then((res) => {
    console.log(res);
    if (res.code == 0) {
      realName.value = res.data.realName;
      realNumber.value = res.data.idcard;
      state.logon = true;
      state.userInfo.name = res.data.memberName;
      state.userInfo.phone = res.data.phone;
      showQrcode.value = true;
      qrcodeUrl.value = res.data.qrcode;
      showLogin.value = false;
      state.checkinStatus = res.data.checkinStatus;
      if (!res.data.idcard) {
        showCenter.value = true;
        console.log(11111);
      }
    } else {
      // console.log(11111);
      state.logon = false;
      showTip.value = true;
    }
  });
});
</script>
<style>
.Nlogon {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
}
.tipText {
  padding: 0 22px;
  text-align: left;
  font-size: 16px;
  font-weight: 350;
  line-height: 27px;
}
:where(.css-dev-only-do-not-override-1dgrbo1).ant-btn-default:not(
    :disabled
  ):hover {
  color: #ffffff !important;
  background: #bd271e !important;
  border: none !important;
}
.confirm {
  width: 80%;
  height: 40px;
  margin: 0 auto;
  border-radius: 4px;
  background: #bd271e;
  color: #ffffff !important;
  /* margin-top: 20px; */
}
.confirm:hover {
  background-color: #bd271e;
  border: none;
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
.van-popup--center.van-popup--round {
  width: 340px;
}
.qr-sign {
  height: 25px;
  line-height: 25px;
  padding: 0 25px;
  background: rgba(68, 69, 70, 0.1);
  border-radius: 100px;
  color: #3f90fc;
}
:where(.css-dev-only-do-not-override-1dgrbo1).ant-qrcode {
  /* width: 200px !important; */
  /* height: 200px !important; */
  background-color: #ffffff !important;
}
.qr-text {
  font-size: 18px;
  font-weight: bold;
  height: 50px;
  line-height: 50px;
}
.qrCode {
  background-image: url("../image/hs/qrbag.jpg");
  background-size: 100% 100%;
  margin: 30px auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bottom {
  /* height: 100%; */
  border-radius: 8px;
  background: #ffffff;
  width: 100%;
  margin-top: 40px;
}
.Title {
  line-height: 50px;
  height: 50px;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}
.userInfo {
  display: flex;
  margin-top: 30px;
  align-items: center;
}
.user-avatar {
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.user-name {
  text-align: left;
}
.main {
  width: 100vw;
  height: 100vh;
  background-image: url("../image/hs/bagImg.jpg");
  background-size: 100% 100%;
  padding: 20px;
}
.listCard {
  display: flex;
  padding: 20px 0 5px;
  justify-content: space-evenly;
}
.listCard > div:nth-of-type(1) {
  background: #fff4f5;
}

.listCard > div:nth-of-type(2) {
  background: #fdf2f8;
}

.listCard > div:nth-of-type(3) {
  background: #f3faff;
}

.card {
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.card .card-img {
  width: 55%;
  height: 55%;
  /* margin-bottom: 10rpx; */
}

.card-text {
  font-size: 14px;
  padding-bottom: 10rpx;
}
</style>
