<template>
  <view class="my-search-container" :style="{backgroundColor:props.bgColor}">
    <view @click="clickHandle()" class="my-search-box" :style="{borderRadius:props.radius+'px',}">
      <uni-icon type="search" size="30"></uni-icon>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import UniIcon from '../uni-icons/uni-icons.vue'
  type PropDate={
    bgColor?:string,
    radius?:number
  }
  const props=withDefaults(defineProps<PropDate>(),{
    bgColor:'#c00000',
    radius:18
  })

  const emit=defineEmits<{
    (e:'myClick'):void
  }>()
  const clickHandle=()=>{
    emit('myClick')
  }
</script>

<style lang="less" scoped>
.my-search-container{
  height: 50px;
  
  display: flex;
  align-items: center;
  padding: 0 10px;
  .my-search-box{
    height: 36px;
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .placeholder{
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>