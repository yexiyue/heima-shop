<template>
  <!-- goods-item项 -->
    <!-- <view class="goods-item" @click="testHandel()"> -->
    <view class="goods-item" >
      <!-- 左侧盒子 -->
      <view class="goods-item-left">
        <!-- 添加勾选状态 -->
        <radio :checked="props.good.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandle"></radio>
        <image :src="good.goods_small_logo || defaultPic" class="goods-pic"/>
      </view>
      <!-- 右侧盒子 -->
      <view class="goods-item-right">
        <view class="goods-name">{{good.goods_name}}</view>
        <view class="goods-info-box">
          <view>￥{{toFixed(good.goods_price as number)}}</view>
          <uni-number-box @change="numChangeHandle" :min="1" :value="good.goods_count" v-if="showNum"></uni-number-box>
        </view>
        
      </view>
    </view>
</template>

<script lang="ts" setup>
import UniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
//定义工具类型融合两个接口相当于求并集
type MyFuse<T,U>={
  [P in (keyof T|keyof U)]:T[P & keyof T]
}&{
  [K in (keyof T|keyof U)]:U[K & keyof U]
}
const defaultPic='https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
  const props = withDefaults(defineProps<{
    good: MyFuse<Good,CartShop>|CartShop,
    showRadio?:boolean,
    showNum?:boolean
}>(),{
  showRadio:false,
  showNum:false
});

//声明价格处理函数
const toFixed=(num:number)=>{
  return num.toFixed(2)
}
const emit=defineEmits<{
  (e:'radio-change',good:{
    goods_id:number,
    goods_state:boolean
  }):void,
  (e:'click',msg:any):void,
  (e:'num-change',good:{
    goods_id:number,
    goods_count:number
  }):void
}>()
//声明radio点击处理函数
const radioClickHandle=()=>{
  /**
   * 为啥要主动触发外界自定义事件
   * 因为外界绑定的点击事件不能直接响应
   * 必须通过子组件做一层代理
   * 如果不在子组件触发则没有响应
   * 
   * 注意：如果函数带参数，父组件传参等级高于子组件触发
   */
  emit('radio-change',{
    goods_id:props.good.goods_id,
    goods_state:!props.good.goods_state
  })
}
/* function testHandel(){
  emit('click','我是子组件')
} */

//声明num点击事件
const numChangeHandle=(value:number)=>{
  emit('num-change',{
    goods_id:props.good.goods_id,
    goods_count:value
  })
}
</script>

<style lang="less" scoped>

.goods-item{
  display: flex;
  /* width: 750rpx;
  box-sizing:border-box; */
  margin:10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left{
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    } 
  }
}
</style>