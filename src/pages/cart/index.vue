<template>
  <view class="cart-container" v-if="store.cart.length">
    <!-- 收货地址组件 -->
    <my-address></my-address>

    <!-- 商品列表的标题区域 -->
    <view class="cart-title">
      <uni-icons type="shop" size="24" />
      <text class="cart-text-title">购物车</text>
    </view>
    <!-- 商品列表区域 -->
    <uni-swipe-action v-for="(item, index) in store.cart" :key="index">
      <uni-swipe-action-item :right-options="options" @click="clickRightBtn(item)">
        <!-- 做了一下实验果然得子组件做一下触发 <my-goods @radio-change="radioChangeHandle" @click="test('66666666')" :good="item" show-radio></my-goods> -->
        <my-goods
          @radio-change="radioChangeHandle"
          @num-change="numChangeHandle"
          :good="item"
          show-radio
          show-num
        ></my-goods>
      </uni-swipe-action-item>
    </uni-swipe-action>

    <!-- 结算组件 -->
    <my-settle></my-settle>
  </view>

  <view class="empty-cart" v-else>
    <image src="@/static/cart_empty@2x.png" class="empty-image" />
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script lang="ts" setup>
import { useSetBadge, useLocalStorage } from "@/utils/hooks";
import UniIcons from "@/components/uni-icons/uni-icons.vue";
import { useStore } from "@/store/store";
import MyGoods from "@/components/my-goods/index.vue";
import UniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue";
import UniSwipeActionItem from "@/components/uni-swipe-action-item/uni-swipe-action-item.vue";
import MyAddress from "@/components/my-address/index.vue";
import MySettle from '@/components/my-settle/index.vue'

useSetBadge();
const store = useStore();

//定义数据
const options = [
  {
    text: "删除",
    style: {
      backgroundColor: "#c00000",
    },
  },
];

//向右滑动删除
function clickRightBtn(item: typeof store.cart[number]) {
  //找到商品位置
  const index = store.cart.findIndex((x) => {
    return x.goods_id == item.goods_id;
  });
  //删除商品
  store.cart.splice(index, 1);
}

//复选框改变处理,参数是子组件触发传过来
function radioChangeHandle(goods: { goods_id: number; goods_state: boolean }) {
  //修改状态
  store.cart.find((x) => {
    return x.goods_id == goods.goods_id;
  })!.goods_state = goods.goods_state;
}

//num改变处理，参数是子组件触发传过来，相当于回调函数
function numChangeHandle(goods: { goods_id: number; goods_count: number }) {
  //修改状态
  store.cart.find((x) => {
    return x.goods_id == goods.goods_id;
  })!.goods_count = goods.goods_count;
}

//持久化存储hooks
useLocalStorage();

//实验
/* function test(msg:string){
  console.log('test',msg)
} */
</script>

<style lang="less" scoped>
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-text-title {
    font-size: 14px;
    margin-left: 10px;
  }
}
.cart-container{
  padding-bottom: 50px;
}

.empty-cart{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 150px;
  .empty-image{
    width: 90px;
    height: 90px;
  }
  .tip-text{
    font-size: 14px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
