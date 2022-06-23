<template>
  <view>
    <!-- 选择收货地址盒子 -->
    
    <view class="address-choose-box" v-if="JSON.stringify(addStore.address)==='{}'">
      <button size="mini" @click="chooseClickHandle" class="btnChooseAddress">选择收货地址+</button>
    </view>
    <!-- 渲染收货地址的盒子 -->
    <!-- 给盒子绑定点击事件重新选择收货地址 -->
    <view class="address-info-box" v-else @click="chooseClickHandle">
      <view class="row1">
        <view class="row1-left">
          <view class="username"
            >收货人：<text>{{ addStore.address.userName}}</text></view
          >
        </view>
        <view class="row1-right">
          <view class="phone"
            >电话：<text>{{ addStore.address.telNumber }}</text></view
          >
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{ addStore.addstr }}</view>
      </view>
    </view>
    <!-- 底部边框线 -->
    <image src="@/static/cart_border@2x.png" class="address-border" />
  </view>
</template>

<script lang="ts" setup>
import UniIcons from "@/components/uni-icons/uni-icons.vue";
import { computed, reactive } from "vue";
import {showMsg, useChooseAddress,useShowModal} from '@/utils/hooks'
import {useAddress} from '@/store/address'
import { onReady } from "@dcloudio/uni-app";

const addStore=useAddress()
/* const data=reactive({
  address:<UniApp.ChooseAddressRes>{}
}) */
//解决授权问题
//重新授权函数
const reAuth=async ()=>{
  try {
    const res=await useShowModal({
      content:'检测到您没打开地址权限，是否去设置打开？',    
      confirmText:'确认',
      cancelText:'取消'
    })
    //如果取消直接弹提示
    if(res.cancel)return showMsg('您取消了地址授权')
    // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
    if (res.confirm) return uni.openSetting({
    // 3.4.1 授权结束，需要对授权的结果做进一步判断
    success: (settingResult) => {
      // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
      if (settingResult.authSetting['scope.address']) return showMsg('授权成功！请选择地址')
      // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
      if (!settingResult.authSetting['scope.address']) return showMsg('您取消了地址授权！')
    }
  })

  } catch (error) {
    //检测异常直接退出
    return
  }
}
//点击添加收货地址响应函数
const chooseClickHandle=async ()=>{
  try {
    const res=await useChooseAddress()
    if(res.errMsg=='chooseAddress:ok'){
      /* data.address=res */
      addStore.address=res
    }else{
      //重新获取权限
      reAuth()
    }
  } catch (error) {
    uni.showToast({
      title:'取消成功',
      icon:'none'
    })
  }
  
} 

//计算属性拼接地址
/* const addstr=computed(():string=>{
  if(!addStore.address.provinceName)return ''
  return addStore.address.provinceName+addStore.address.cityName+addStore.address.countyName+addStore.address.detailInfo
}) */

//监听变化持久化存储
addStore.$subscribe(()=>{
  addStore.setAddressStorage(addStore.address)
},{detached:true})



</script>

<style lang="less" scoped>
.address-border {
  display: block;
  height: 5px;
  width: 100%;
}
.btnChooseAddress {
  background-color: rgb(26, 172, 23);
  color: white;
}
.address-choose-box {
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}

// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>
