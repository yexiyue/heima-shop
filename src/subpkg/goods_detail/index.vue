<template>
  <view v-if="data.goodsDetails.goods_name" class="goods-details-container">
    <!-- 轮播图区域 -->
    <swiper indicator-dots autoplay circular :duration="1000" :interval="3000">
      <swiper-item v-for="(item, index) in data.goodsDetails.pics" :key="index">
        <image :src="item.pics_big" @click="preview(index)" />
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{ data.goodsDetails.goods_price }}</view>
      <!-- 商品信息主体 -->
      <view class="goods-info-body">
        <view class="goods-name">{{ data.goodsDetails.goods_name }}</view>
        <view class="favi">
          <uni-icon type="star" size="18" color="gray"></uni-icon>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>

    <!-- 商品图文介绍 -->
    <rich-text :nodes="data.goodsDetails.goods_introduce"></rich-text>

    <!-- 商品导航 -->
    <view class="goods-nav">
      <uni-goods-nav
        :options="data.options"
        :button-group="btnGroup"
        :fill="true"
        @click="navHandle"
        @button-click="addCartHandle"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getGoodDetail } from "@/api/goods";
import { showMsg } from "@/utils/hooks";
import { onLoad } from "@dcloudio/uni-app";
import { reactive } from "vue";
import UniIcon from "@/components/uni-icons/uni-icons.vue";
import UniGoodsNav from "@/components/uni-goods-nav/uni-goods-nav.vue";
//商品详情数据容器
const data = reactive({
  goodsDetails: <GoodsDetail["message"]>{},
  options: [
    {
      icon: "shop",
      text: "店铺",
      infoBackgroundColor: "#007aff",
      infoColor: "red",
    },
    {
      icon: "cart",
      text: "购物车",
      info: 2,
    },
  ],
});

const btnGroup = [
  {
    text: "加入购物车",
    backgroundColor: "#ff0000",
    color: "#fff",
  },
  {
    text: "立即购买",
    backgroundColor: "#ffa200",
    color: "#fff",
  },
];
onLoad(async (option) => {
  await setGoodsDetail(data, option.goods_id!);
});

//接收数据的函数
const setGoodsDetail = async (container: typeof data, query: string) => {
  const res = await getGoodDetail(query);
  if (res.meta.status != 200) {
    return showMsg();
  }

  //保存到响应式数据里
  container.goodsDetails = res.message;
  //对数据进行处理
  container.goodsDetails.goods_introduce = container.goodsDetails.goods_introduce
    .replace(/<img /g, '<img style="display:block;" ')
    .replace(/webp/g, "jpg");
};

//点击图片预览函数
const preview = (index: number) => {
  uni.previewImage({
    current: index,
    urls: data.goodsDetails.pics.map((x) => {
      return x.pics_big;
    }),
  });
};
type ClickInfo = {
  content: { icon: string; text: string; info: number };
  index: number;
};
//点击导航栏函数
const navHandle = (e: ClickInfo) => {
  console.log(e);
  //点击跳转到购物车
  if (e.content.text == "购物车") {
    uni.switchTab({
      url: "/pages/cart/index",
    });
  }
};
//点击添加到购物车函数
const addCartHandle = (e: ClickInfo) => {
  console.log(e);
};
</script>

<style lang="less" scoped>
swiper {
  height: 750rpx;
  image {
    height: 100%;
    width: 100%;
  }
}

.goods-info-box {
  padding: 10px;
  padding-right: 0;
  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
      margin-right: 10px;
    }
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }
  .yf {
    font-size: 12px;
    color: gray;
    margin: 10px 0;
  }
}
.goods-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.goods-details-container {
  padding-bottom: 50px;
}
</style>
