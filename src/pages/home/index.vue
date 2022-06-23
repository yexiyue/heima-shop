<template>
  <!-- 顶部搜索吸顶 -->
  <view class="search-box">
    <my-search bg-color="pink" @my-click="gotoSearch()"></my-search>
  </view>

  <!-- 渲染轮播图 -->
  <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000"  :duration="1000" :circular="true">
    <swiper-item v-for="(item) in swiperList" :key="item.goods_id">
      <navigator :url="'/subpkg/goods_detail/index?goods_id='+item.goods_id" class="swiper-item" >
        <image :src="item.image_src" />
      </navigator>
    </swiper-item>
  </swiper>

  <!-- 分类导航区 -->
  <view class="nav-list">
    <view v-for="(item) in navList" :key="item.name" @click="navClickHandel(item)">
      <image :src="item.image_src" class="nav-image"/>
    </view>
  </view>

  <!-- 渲染楼层 -->
  <view class="floor-list">
    <!-- 楼层item项 -->
    <view class="floor-item" v-for="item in floorList" :key="item.floor_title.name">
      <!-- 楼层标题 -->
      <image :src="item.floor_title.image_src" class="floor-title"/>
      <!-- 楼层图片 -->
      <view class="floor-img-box">
        <navigator :url="item.product_list[0].navigator_url" class="left-img-box">
          <image  mode="widthFix" :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width+'rpx'}"/>
        </navigator>
        <view class="right-img-box">
          <navigator :url="item2.navigator_url" class="right-img-item" v-for="item2 in item.product_list.slice(1)" :key="item2.name">  
            <image mode="widthFix" :src="item2.image_src" :style="{width:item2.image_width+'rpx'}"/>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { reactive } from 'vue';
import { getSwiperList ,getNavList,getFloorList} from '@/api/home';
import {encapsulateData} from '@/utils/hooks'
import MySearch from '@/components/my-search/index.vue'
//设置购物车徽标
import {useSetBadge} from '@/utils/hooks'
useSetBadge()

//定义轮播图的数据列表
const swiperList=reactive<SwiperData['message']>([])
const navList=reactive<NavData['message']>([])
const floorList=reactive<FloorData['message']>([])
onLoad(async ()=>{
  //获取请求数据
  await encapsulateData(swiperList,getSwiperList)

  //获取导航栏数据
  await encapsulateData(navList,getNavList)

  //获取楼层数据
  await encapsulateData(floorList,getFloorList)

})

//定义导航栏点击事件
const navClickHandel=(item:Message1)=>{
  if(item.name=='分类'){
    uni.switchTab({
      url:"/pages/cate/index",
    })
  }
}

//点击跳转到搜索
const gotoSearch=()=>{
  uni.navigateTo({
    url:'/subpkg/search/index',
  })
}
</script>

<style lang="less" scoped>
  swiper{
    height: 330rpx;
    .swiper-item,image{
      width:100%;
      height: 100%;
    }
  }

  .nav-list{
    display: flex;
    justify-content: space-around;
    margin:15rpx 0;
    .nav-image{
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor-title{
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  
  .right-img-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .floor-img-box{
    display: flex;
    padding-left: 10rpx;
  }

  .search-box{
    position:sticky;
    top:0;
    z-index: 999;
  }
</style>