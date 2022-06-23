<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="store.FullCheckOrNo(!isFullCheck)">
      <radio :checked="isFullCheck" color="#c00000" /> <text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle">
      结算({{checkCount}})
    </view>
  </view>
</template>

<script lang="ts" setup>
import {useStore} from '@/store/store'
import {storeToRefs} from 'pinia'
import { computed } from 'vue';
const store=useStore()
//果然会丢失响应式
/* const {checkCount,checkGoodsAmount} =store */
const {checkCount,checkGoodsAmount} =storeToRefs(store)
const isFullCheck=computed(()=>{
  return store.goodsTotal==store.checkCount
})
</script>

<style lang="less" scoped>
.my-settle-container{
  position: fixed;
  bottom: 0;
  left: 0;
  //必须设置宽高，因为设置为position为fixed盒子变为了浮动
  height: 50px;
  width: 100%;
  background-color: white;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  .radio{
    display: flex;
    align-items: center;
  }
  .amount-box{
    .amount{
      color:#c00000;
      font-weight: bold;
    }
  }
  .btn-settle{
    background-color: #c00000;
    color: white;
    height: 100%;
    line-height: 50px;
    padding: 0 10px;
    min-width: 100px;
    text-align: center;
  }
}
</style>