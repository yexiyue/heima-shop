<template>
  <view class="goods-list">
    <view @click="gotoGoodsDetail(item.goods_id)" v-for="(item,index) in data.goodsList" :key="index">
      <MyGoodsItem :good="item"></MyGoodsItem>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import {getGoodsList} from '@/api/goods'
import { reactive } from 'vue';
import { showMsg } from '@/utils/hooks';
import MyGoodsItem from '../../components/my-goods/index.vue'
//不用于渲染页面可以不添加响应式
let queryData={
  query:'',
  cid:'',
  pagenum:1,
  pagesize:10
}

//声明接收数据容器
const data=reactive({
  goodsList:<GoodsData['message']['goods']>[],
  pagenum:1,
  total:0
})

//设置节流阀
let isLoading:boolean=false;

onLoad(async (option)=>{
  Object.assign(queryData,option)
  await setGoodsDate(queryData,data)
})

//请求数据并放入响应式
const setGoodsDate=async (query:QueryType,dataContiner:typeof data,fn?:()=>void)=>{
  //发送请求之前打开节流阀
  isLoading=true
  //发送请求
  const res=await getGoodsList(query)
  //关闭节流阀
  isLoading=false
  if(res.meta.status!==200){
    return showMsg()
  }
  dataContiner.goodsList=[...data.goodsList,...res.message.goods]
  dataContiner.pagenum=res.message.pagenum
  dataContiner.total=res.message.total
  fn && fn()
}
//触底加载更多数据
onReachBottom(()=>{
  //判断数据是否加载完毕
  if(data.pagenum*queryData.pagesize>=data.total)return showMsg('数据加载完毕！')

  //判断节流阀，如果为true则不发起请求
  if(isLoading)return
  //让页码值加1
  queryData.pagenum++
  setGoodsDate(queryData,data)
})

//上拉刷新
onPullDownRefresh(()=>{
  //重置数据
  queryData={
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  }
  isLoading=false
  data.goodsList=[]

  //重新发起数据请求
  setGoodsDate(queryData,data,()=>{
    //关闭下拉刷新
    uni.stopPullDownRefresh()
  })
})

//点击跳转到商品详情页
const gotoGoodsDetail=(goodsId:number)=>{
  uni.navigateTo({
    url:'/subpkg/goods_detail/index?goods_id='+goodsId,
  })
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