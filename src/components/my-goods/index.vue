<template>
  <!-- goods-item项 -->
    <view class="goods-item">
      <!-- 左侧盒子 -->
      <view class="goods-item-left">
        <image :src="good.goods_small_logo || defaultPic" class="goods-pic"/>
      </view>
      <!-- 右侧盒子 -->
      <view class="goods-item-right">
        <view class="goods-name">{{good.goods_name}}</view>
        <view class="goods-info-box">￥{{toFixed(good.goods_price)}}</view>
      </view>
    </view>
</template>

<script lang="ts" setup>
const defaultPic='https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
  const props = defineProps<{
    good:Good
}>();

//声明价格处理函数
const toFixed=(num:number)=>{
  return num.toFixed(2)
}
</script>

<style lang="less" scoped>

.goods-item{
  display: flex;
  margin:10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left{
    margin-right: 5px;
    .goods-pic{
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      font-size: 13px;
    }
    .goods-info-box{
      font-size: 16px;
      color: #c00000;
    } 
  }
}
</style>