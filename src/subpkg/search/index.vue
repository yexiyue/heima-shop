<template>
  <view>
    <!-- 吸顶搜索框 -->
    <view class="search-box">
      <uni-search-bar
        cancelButton="none"
        placeholder="请输入搜索内容"
        :radius="100"
        @input="input"
        :focus="true"
      ></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchList.data.length != 0">
      <view
        class="sugg-item"
        @click="gotoGoodsDetail(item.goods_id)"
        v-for="item in searchList.data"
        :key="item.goods_id"
      >
        <view class="goods-name">
          {{ item.goods_name }}
        </view>
        <uni-icons type="arrowright" size="16" />
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clearHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag
          @click="gotoGoodsList(item)"
          inverted
          :text="item"
          v-for="(item, i) in reverseHistory"
          :key="i"
        ></uni-tag>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, watch, ref, computed, toRaw } from "vue";
import UniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import { getSearchList } from "@/api/search";
import { showMsg } from "@/utils/hooks";
import UniIcons from "@/components/uni-icons/uni-icons.vue";
import UniTag from "../../components/uni-tag/uni-tag.vue";
import { onLoad } from "@dcloudio/uni-app";
//不是页面渲染数据没必要添加响应式
/* const searchContent=ref('') */
//只有页面数据更新才触发
/* onUpdated(()=>{
  console.log(searchContent.value)
}) */

//这里想要使用watchEffect就设置成了响应式
const searchContent = ref("");

//searchList是要渲染页面的所以要添加响应式
const searchList = reactive<{
  data: SearchList["message"];
}>({
  data: [],
});
//设置防抖处理
let timer: number | undefined;
const input = (e: any) => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    searchContent.value = e;
  }, 500);
};
//监听输入框数据变化
watch(searchContent, async (newValue, oldValue) => {
  if (newValue.length == 0) {
    searchList.data = [];
    return;
  }
  searchList.data = (await dataHandle(newValue)) ?? [];
});
//数据请求及处理
const dataHandle = async (query: string) => {
  const res = await getSearchList(query);
  if (res.meta.status != 200) {
    return showMsg();
  }
  if (res.message.length == 0) {
    uni.showToast({
      title: "亲，没有该商品！",
      duration: 1500,
      icon: "none",
    });
  } else {
    //保存搜索历史
    saveSearchHistory(query);
  }
  return res.message;
};

//点击跳转到商品详情
const gotoGoodsDetail = (id: number) => {
  uni.navigateTo({
    url: "/subpkg/goods_detail/index?goods_id=" + id,
  });
};

//搜索历史
const historyList = reactive(new Set());
//保存搜索历史函数
const saveSearchHistory = (query: string) => {
  //如果最前面有搜索历史，那么这次搜索历史应该在最开头
  historyList.delete(query);
  historyList.add(query);
  //持久化处理
  //必须要转一下数组，因为集合不能直接进行序列化
  const storageData = Array.from(historyList);
  uni.setStorageSync("history", JSON.stringify(storageData));
};
//解决前后顺序问题
const reverseHistory = computed(() => {
  //由于reverse会直接修改原数组，所以我吗间接返回reverse
  return [...historyList].reverse() as string[];
});

onLoad(() => {
  if (uni.getStorageSync("history")) {
    const storageData = JSON.parse(uni.getStorageSync("history") ?? "[]");
    storageData.forEach((v: string) => {
      historyList.add(v);
    });
  }
});

//点击清空历史记录
const clearHistory = () => {
  historyList.clear();
  uni.setStorageSync("history", "[]");
};

//点击历史跳转到商品列表
const gotoGoodsList = (query: string) => {
  uni.navigateTo({
    url: "/subpkg/goods_list/index?query=" + query,
  });
};
</script>

<style lang="less" scoped>
.search-box {
  background-color: pink;
  height: 50px;
  position: sticky;
  display: flex;
  flex-direction: column;
  justify-content: center;
  top: 0;
  z-index: 9999;
}

.sugg-list {
  padding: 0 5px;
  .sugg-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 13px 0;
    font-size: 12px;
    border-bottom: 1px solid #efefef;
    .goods-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
