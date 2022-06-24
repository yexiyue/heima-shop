<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="store.FullCheckOrNo(!isFullCheck)">
      <radio :checked="isFullCheck" color="#c00000" /> <text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{ checkGoodsAmount }}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="clickSettleHandle"> 结算({{ checkCount }}) </view>
  </view>
</template>

<script lang="ts" setup>
import {useStore} from '@/store/store'
import {useAddress} from '@/store/address'
import {storeToRefs} from 'pinia'
import { computed ,ref} from 'vue';
import { showMsg } from '@/utils/hooks';
import {postOrderCreate,postOrder} from '@/api/my'
import { myHttp } from '@/utils/request';
const store=useStore()
const addressStore=useAddress()
const {address,token}=storeToRefs(addressStore)
//果然会丢失响应式
/* const {checkCount,checkGoodsAmount} =store */
const {checkCount,checkGoodsAmount} =storeToRefs(store)
const isFullCheck=computed(()=>{
  return store.goodsTotal==store.checkCount
})

//点击结算按钮处理函数
const clickSettleHandle=()=>{
  //判断条件
  if(checkCount.value==0)return showMsg('请选择要结算的商品！')
  if(JSON.stringify(address.value)=='{}')return showMsg('请选择收货地址!')
  if(!token.value)return delayNavigator()
  payOrder()
}
//定义数字秒
let n=3
//展示倒计时的提示消息
const showTips=(n:number)=>{
  uni.showToast({
    title:'请登录后再结算！' + n + ' 秒后自动跳转到登录页',
    icon:'none',
    duration:1500,
    mask:true
  })
}

//延迟导航到my页面
const delayNavigator=()=>{
  showTips(n)
  let timer:number;
  //创建定时器每隔一秒执行
  timer=setInterval(()=>{
    n--
    if(n<=0){

      clearInterval(timer)
      uni.switchTab({
        url:'/pages/my/index',
      })
      n=3
      //设置重定向参数
      addressStore.redirectInfo={
        openType:'switchTab',
        from:'/pages/cart/index'
      }
      return
    }

    showTips(n)
  },1000)
}

const payOrder=async ()=>{
  //1.创建订单
  // 1.1 组织订单的信息对象
  const orderInfo={
    // 开发期间，注释掉真实的订单价格，
    // order_price: this.checkedGoodsAmount,
    // 写死订单总价为 1 分钱
    order_price:0.01,
    consignee_addr:addressStore.addstr,
    goods:store.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
  }
  // 1.2 发起请求创建订单
  const res=await postOrderCreate(orderInfo)
  if(res.meta.status!==200)return showMsg('创建订单失败！')
  console.log(res)
  //得到订单编号
  const orderNumber=res.message.order_number
  const res2:any=await postOrder(orderNumber)
  if(res2.meta.status!==200)return showMsg('订单预支付失败！')
  // 1.3 得到服务器响应的“订单编号”
  const payInfo = res2.message.pay
  // 3. 发起微信支付
   try {
      // 3.1 调用 uni.requestPayment() 发起微信支付
      const res3:any = await uni.requestPayment(payInfo)
      // 3.3 完成了支付，进一步查询支付的结果
      const res4:any= await myHttp.post('/my/orders/chkOrder', { order_number: orderNumber })
      // 3.4 检测到订单未支付
      if (res4.meta.status !== 200) return showMsg('订单未支付！')
      // 3.5 检测到订单支付完成
      uni.showToast({
        title: '支付完成！',
        icon: 'success'
      })
   } catch (error) {
      // 3.2 未完成支付
    showMsg('订单未支付！')
   }
   
}
</script>

<style lang="less" scoped>
.my-settle-container {
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
  .radio {
    display: flex;
    align-items: center;
  }
  .amount-box {
    .amount {
      color: #c00000;
      font-weight: bold;
    }
  }
  .btn-settle {
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
