<template>
  <view>
    <my-search bg-color="pink" @myClick="gotoSearch()"></my-search>
    
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view scroll-y :style="{height:height+'px'}">
        <block  v-for="(item,index) in cateList" :key="index">
          <view @click="changeActive(index)" :class="['left-scroll-view-item',index==active?'active':''] ">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y :style="{height:height+'px'}" :scroll-top="scrollTop">
      <!-- 二级 -->
        <view class="cate-lv2" v-for="item2 in cateList2.data" :key="item2.cat_name">
          <view class="cate-lv2-title">/{{item2.cat_name}}/</view>
          <!-- 三级 -->
          <view class="cate-lv3-list">
            <view @click="gotoGoodList(item3)" class="cate-lv3-item" v-for="item3 in item2.children" :key="item3.cat_name">
              <image :src="item3.cat_icon" />
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref ,reactive, onBeforeUpdate} from 'vue';
import {getCateList} from '@/api/category'
import { encapsulateData } from '@/utils/hooks';
import MySearch from '@/components/my-search/index.vue'
//导入设置徽标hooks
import {useSetBadge} from '@/utils/hooks'
useSetBadge()

//设置高度
const height=ref<number>(0)
//设置分类数据容器
const cateList=reactive<CateDate['message']>([])
//设置二级分类
const cateList2=reactive<{data:Message3[]}>({data:[]})

//设置滚动条高度
const scrollTop=ref(0)
//激活选项
const active=ref(0)
//修改激活方法
const changeActive=(index:number)=>{
  active.value=index
  //前后设置相同像素没有效果得不一样才行
  scrollTop.value=scrollTop.value==0?1:0
}
//在每次数据更新时调用
onBeforeUpdate(()=>{
  //下面这段代码放到外面会报错，因为，setup时,还没有请求数据
  
  cateList[active.value].children.forEach((v1)=>{
    if(!v1.children){
      v1.children=[v1]
    }
    v1.children.forEach(v2=>{
      let excludeDomain=v2.cat_icon?.split('.').slice(1)
      v2.cat_icon='https://api-ugo-web.'+excludeDomain?.join('.')
    })
    
  })
  //顺便把数据渲染进二级分类
  cateList2.data=cateList[active.value].children
  
})

onLoad(async ()=>{
  //获取设备屏幕高度信息
  height.value=uni.getSystemInfoSync().windowHeight-50

  //获取分类列表的数据
  await encapsulateData(cateList,getCateList)
})

//点击跳转到三级分类
const gotoGoodList=(item:Message3)=>{
  uni.navigateTo({
    url:'/subpkg/goods_list/index?cid=' + item.cat_id,
  })
}

//点击跳转到搜索页面
const gotoSearch=()=>{
  uni.navigateTo({
    url:'/subpkg/search/index',
  })
}
</script>

<style lang="less" scoped>
  .scroll-view-container{
    display: flex;
    scroll-view{
      &:nth-child(1){
        width: 120px;
        text-align: center;
      }
      .left-scroll-view-item{
        background-color: #f7f7f7;
        line-height: 60px;
        font-size: 12px;

        &.active{
          background-color: white;
          position: relative;
          &::before{
            content: '';
            display: block;
            height: 30px;
            width: 3px;
            background-color: #c00000;
            position: absolute;
            top: 50%;
            left:0;
            transform: translate(0,-50%);
          }
        }
      }
    }
  }

  .cate-lv2-title{
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    padding:15px 0;
  }

  .cate-lv3-list{
    display: flex;
    flex-wrap: wrap;
    
    .cate-lv3-item{
      width: 33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      image{
        width: 60px;
        height: 60px;
      }
      text{
        font-size: 12px;
      }
    }
  }
</style>