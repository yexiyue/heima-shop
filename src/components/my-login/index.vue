<template>
  <view class="login-container">
    <uni-icons type="contact-filled" color="#afafaf" size="100" />
    <!--  @getuserinfo="getUserInfo"-->
    <button class="btn-login" open-type="getUserInfo" @click="getUserProfile">
      一键登录
    </button>
    <text class="tips-text">登录后享受更多权益</text>
  </view>
</template>

<script lang="ts" setup>
import UniIcons from "@/components/uni-icons/uni-icons.vue";
import { showMsg, useLogin, useUserProfile } from "@/utils/hooks";
import { useAddress } from "@/store/address";
import { storeToRefs } from "pinia";
import { postToken } from "@/api/my";
const props = defineProps();
const store = useAddress();
/* type Info={
  [keys:string]:unknown
  detail:UniApp.GetUserInfoRes
}

const getUserInfo=(info:Info)=>{
  if(info.detail.errMsg=='getUserInfo:fail auth deny')return showMsg('您取消了登录授权！')
  store.userInfo=info.detail.userInfo
  store.setUserInfo(info.detail.userInfo)

  getToken(info.detail)
} */
const getUserProfile = async () => {
  const detail = await useUserProfile({
    desc: "登录",
  });
  if (detail.errMsg == "getUserProfile:fail auth deny")
    return showMsg("您取消了登录授权！");
  store.userInfo = detail.userInfo;
  store.setUserInfo(detail.userInfo);
  getToken(detail);
};

const getToken = async (detail: UniApp.GetUserProfileRes) => {
  try {
    const res = await useLogin();
    if (res.errMsg != "login:ok") return showMsg("登录失败！");
    const query = {
      code: res.code,
      encryptedData: detail.encryptedData,
      rawData: detail.rawData,
      iv: detail.iv,
      signature: detail.signature,
    };
    try {
      const data = await postToken(query);
      //if (data.meta.status != 200) return showMsg(data.meta.msg);
      showMsg('登录成功')
      store.token='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      uni.setStorageSync('token',store.token)
      //判断是否有重定向信息，如果有就重定向
      if(store.redirectInfo && store.redirectInfo.openType=='switchTab'){
        uni.switchTab({
          url:store.redirectInfo.from,
          //跳转之后得清除不然下次登录会跳转
          success:(success)=>{
            store.redirectInfo=undefined
          },
        })
      }
   } catch (error) {
      showMsg("出现未知错误");
    }
  } catch (error) {
    showMsg("登录失败！")
  }
};
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  height: 750rpx;
  background-color: #f8f8f8;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  .btn-login {
    background-color: #c00000;
    border-radius: 100px;
    width: 90%;
    margin: 15px 0;
  }
  .tips-text {
    font-size: 12px;
    color: gray;
  }
  //设置末尾半椭圆
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 40px;
    background-color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 100%;
    transform: translate(0, 50%);
  }
}
</style>
