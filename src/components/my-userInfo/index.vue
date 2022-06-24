<template>
  <view class="my-userInfo-container">
    <!-- 头像和昵称区域 -->
    <view class="top-box">
      <image :src="userInfo!.avatarUrl" class="avatar" />
      <view class="nickname">{{ userInfo!.nickName }}</view>
    </view>

    <!-- 面板区域 -->
    <view class="panel-list">
      <!-- 第一个面板 -->
      <view class="panel">
        <view class="panel-body">
          <view class="panel-item">
            <text>8</text>
            <text>收藏的店铺</text>
          </view>
          <view class="panel-item">
            <text>14</text>
            <text>收藏的商品</text>
          </view>
          <view class="panel-item">
            <text>18</text>
            <text>关注的商品</text>
          </view>
          <view class="panel-item">
            <text>84</text>
            <text>足迹</text>
          </view>
        </view>
      </view>
      <!-- 第二个面板 -->
      <view class="panel">
        <view class="panel-title">
          我的订单
        </view>
        <view class="panel-body">
          <view class="panel-item">
            <image src="/static/my-icons/icon1.png" class="icon"/>
            <text>代付款</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon2.png" class="icon"/>
            <text>待收货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon3.png" class="icon"/>
            <text>退款/退货</text>
          </view>
          <view class="panel-item">
            <image src="/static/my-icons/icon4.png" class="icon"/>
            <text>全部订单</text>
          </view>
        </view>
      </view>

      <!-- 第三个面板 -->
      <view class="panel">
        <view class="panel-list-item">
          <text>收货地址</text>
          <uni-icons
            type="arrowright"
            size="15"
          />
        </view>
        <view class="panel-list-item">
          <text>联系客服</text>
          <uni-icons
            type="arrowright"
            size="15"
          />
        </view>
        <view class="panel-list-item" @click="logout">
          <text>退出登录</text>
          <uni-icons
            type="arrowright"
            size="15"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useAddress } from "@/store/address";
import { storeToRefs } from "pinia";
import {showMsg, useShowModal} from '@/utils/hooks'
import UniIcons from '@/components/uni-icons/uni-icons.vue'

const store=useAddress()
const { userInfo } = storeToRefs(store);

//退出功能
const logout=async ()=>{
  try {
    const res=await useShowModal({
      title:'提示',
      content:'确认退出登录吗？'
    })
    if(res.cancel)return showMsg('取消退出成功！')
    if(res.confirm){
      //重置数据
      store.token=''
      store.userInfo={} as any
      store.setUserInfo({} as any)
      store.address={} as any
      store.setAddressStorage({} as any)
      uni.setStorageSync('token','')
    }
  } catch (error) {
    showMsg('出现未知错误')
  }
}
</script>

<style lang="less" scoped>
.my-userInfo-container {
  height: 100vh;
  background-color: #f4f4fe;
  .top-box {
    height: 400rpx;
    background-color: #c00000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 45px;
      border: 2px solid #fff;
      box-shadow: 0 1px 5px black;
    }
    .nickname {
      font-size: 16px;
      color: #fff;
      font-weight: bold;
      margin-top: 10px;
    }
  }
  .panel-list {
    padding: 0 10px;
    position: relative;
    top: -10px;
    .panel {
      background-color: white;
      border-radius: 3px;
      margin-bottom: 8px;
      .panel-title{
          line-height: 45px;
          padding-left: 10px;
          font-size: 15px;
          border-bottom: 1px solid #f4f4f4;
        }
      .panel-body {
        display: flex;
        justify-content: space-around;
        .panel-item {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          font-size: 13px;
          padding: 10px 0;

          .icon{
            width: 35px;
            height: 35px;
          }
        }
      }
    }
    
  }
}
.panel-list-item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  padding: 0 10px;
  line-height: 45px;
}
</style>
