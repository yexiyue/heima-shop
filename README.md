# 黑马优购项目总结

## 1.背景

暑期漫漫，在家没事学点项目长点经验，当时刚学完小程序顺势把uniapp学了，不料uniapp官方给的编辑器不友好，特别是对ts开发的，然后根据[这篇文章](https://juejin.cn/post/7090532271257714695)使用vscode开发，刚开始也是各种出错，下面将详细介绍

**技术栈：**

- vue3.2
- typescript
- pinia
- uniapp
- vite

## 2.学会了详细的项目管理

### 1.初始化

**1.初始化本地仓库**

`git init`

`git branch -M master`

**2.添加到暂存区**

`git add .`

**3.提交更新**

`git commit -m "init progect"`

**4.推送到远程仓库**

`git push -u https://github.com/yexiyue/heima-shop.git`



### 2.开发流程

每次开发一个功能最好先创建一个分支，当完成功能的开发后，把当前分支推送到远程，再切换到主分支,然后合并该开发分支，具体流程如下：

**1.创建分支**

`git branch home`

**2.切换分支**

`git checkout home`

**以上可以简化为**

`git checkout -b home`

**3.查看当前分支**

`git branch`



**当开发完后上传到远程仓库**

**1.所以文件加入到暂存区**

`git add .`

**2.提交本地记录**

`git commit -m "完成了home页面的开发"`

**3.推送到远程仓库**

`git push -u origin home`



**分支的合并**

**1.切换到主分支**

`git checkout master`

**2.合并分支**

`git merge home`

**3.推送到远程仓库**

`git push -u origin master`



**删除本地分支**

`git branch -d home`



**以上就是通用的开发流程，其他功能模块的开发都可以如此。远程合作开发也一样，不同的人分别开发不同的功能最后再合并起来。**



## 3.分析总结

这里是黑马优购详细开发流程我就不再赘述了

[uniapp - 黑马优购 (escook.cn)](https://www.escook.cn/docs-uni-shop/mds/1.start.html#_1-5-把项目运行到微信开发者工具)

**下面我就叙述一下我遇到问题及如何解决**

**下面是项目目录结构**

![image-20220625092343304](https://s2.loli.net/2022/06/25/LIe8Nxn6Eyz3MOJ.png)

### 1.请求问题

由于平台的限制，小程序项目中**不支持 axios**，而且原生的 `wx.request()` API 功能较为简单，**不支持拦截器**等全局定制的功能。因此，建议在 uni-app 项目中使用 `@escook/request-miniprogram` 第三方包发起网络数据请求。

而我发现`@escook/request-miniprogram`这个包并没有typescript类型声明，而且如果挂载到uni全局上会报错而且会得不到类型提示，**转念一想，vue3.2支持hooks为什么非要挂载到全局**，写个模块在写个api接口不就一样ok。说干就干，干脆直接自己封装基于uni.request的请求方法，下面直接放出代码

**该模块位于utils/request.ts文件**

```typescript
//对uniapp请求方法的封装
type RequestOption = {
  [property: string]: any
  url: string
  method: 'GET' | 'POST'
  data: object | string | ArrayBuffer
  header: object
}
class MyHttpRequest {
  public baseUrl?: string

  private requestCallbackFn: (
    option: UniApp.RequestOptions,
    
  ) => UniApp.RequestOptions

  private responseCallbackFn: (
    res: UniApp.RequestSuccessCallbackResult,
    
  ) => UniApp.RequestSuccessCallbackResult

  constructor(opt: { baseUrl?: string; header?: {} } = {}) {
    this.baseUrl = opt.baseUrl

    this.requestCallbackFn = (opt) => {
      
      return opt
    }

    this.responseCallbackFn = (res) => {

      return  res
    }
  }
  //添加请求拦截的方法
  public beforeRequest(
    fn: (option: UniApp.RequestOptions) => UniApp.RequestOptions
  ) {
    this.requestCallbackFn=fn
  }
  //添加响应拦截的方法
  public afterRequest(
    fn: (
      res: UniApp.RequestSuccessCallbackResult
    ) => UniApp.RequestSuccessCallbackResult
  ) {
    this.responseCallbackFn = fn
  }

  public http(
    method: RequestOption['method'],
    url: string,
    query?: Record<string, any>
  ): Promise<UniApp.RequestSuccessCallbackResult> {
    //发送请求前的拦截
    const opt = this.requestCallbackFn({
      url,
      data: query,
    })
    //添加设置基本路径
    if(typeof this.baseUrl!='undefined'){
      opt.url=this.baseUrl+opt.url
    }
    return new Promise((resolve, reject) => {
      uni.request({
        ...opt,
        method: method,
        success: (res: UniApp.RequestSuccessCallbackResult) => {
          const result=this.responseCallbackFn(res)
          resolve(result)
        },
        fail: (res) => {
          reject(res)
        },
      })
    })
  }

  public get(url: string, query?: Record<string, any>) {
    return this.http('GET', url, query)
  }

  public post(url: string, query?: Record<string, any>) {
    return this.http('POST', url, query)
  }
}

export const myHttp = new MyHttpRequest()

```

### 2.vue2与vue3.2差异

视频里教的是vue2的语法，用的vuex全局状态管理，而我用的**vue3.2setup语法，全局状态管理为pinia**

在学习的过程中用compositionAPI，下面是我的开发感悟

在对比vue2与vue3.2后，我发现vue3.2明显更方便更简洁。

1. **方法可以不用挂载全局，写个单独模块就行**
2. **不需要mixin，写个hooks就行**
3. **vuex各种导入方式有点繁杂，pinia结合vue3.2setup方便无比**

下面是vue3.2开发购物车页面

其中用到的方法我封装到了utils/hooks.ts文件

```typescript
import { onShow } from '@dcloudio/uni-app';
import {useStore} from '@/store/store'
import { watch } from 'vue';
//封装方法
//展示数据加载成功消息
export function showMsg(
  title:string='数据加载失败！',
  duration:number=1500,
  icon:UniApp.ShowToastOptions['icon']='none'
){
  uni.showToast({
    title,
    duration,
    icon
  })
}

//将请求过来的数据封装到页面数据
export async function encapsulateData(container:any[],getDataFn:()=>Promise<any>){
  const res=await getDataFn()
  //请求失败
  if(res.meta.status!==200){
    return showMsg()
  }
  //请求成功
  container.push(...res.message)
  showMsg('数据请求成功')
}

//设置页面徽标hooks
//相当于vue2的mixins
export function useSetBadge(isWatch:boolean=false){
  const store=useStore()
  onShow(()=>{
    setTabBarBadge()
  })

  const setTabBarBadge=()=>{
    //调用uni.setTabBarBadge
    uni.setTabBarBadge({
      index:2,
      text:store.total+'',
    })
  }
  if(isWatch){
    //添加监听器
    watch(()=>store.total,()=>{
      setTabBarBadge()
    })
  }
}
const store=useStore()
//持久化存储
export function useLocalStorage(){
  store.$subscribe(()=>{
    uni.setStorageSync('cart',JSON.stringify(store.cart))
    //组件卸载后保留,这样就能通用啦
    console.log(JSON.parse(uni.getStorageSync('cart')))
  },{detached:true})
}

//封装选择地址接口
export async function useChooseAddress(options?:UniApp.ChooseAddressOptions):Promise<UniApp.ChooseAddressRes>{
  return new Promise((resolve,reject)=>{
    uni.chooseAddress({
      ...options,
      success:(res)=>{
        resolve(res)
      },
      fail:(res)=>{
        reject(res)
      }
    })
  })
}

//封装展示接口
export async function useShowModal(options:UniApp.ShowModalOptions):Promise<UniApp.ShowModalRes>{
  return new Promise((resolve,reject)=>[
    uni.showModal({
      ...options,
      success:(res)=>{
        resolve(res)
      },
      fail:(res)=>{
        reject(res)
      }
    })
  ])
}

//封装uni.login
export async function useLogin(options?:UniApp.LoginOptions):Promise<UniApp.LoginRes>{
  return new Promise((resolve,reject)=>[
    uni.login({
      ...options,
      success:(res)=>{
        resolve(res)
      },
      fail:(res)=>{
        reject(res)
      }
    })
  ])
}

//封装uni.getUserProfile
export async function useUserProfile(options?:UniApp.GetUserProfileOptions):Promise<UniApp.GetUserProfileRes>{
  return new Promise((resolve,reject)=>[
    uni.getUserProfile({
      ...options,
      success:(res)=>{
        resolve(res)
      },
      fail:(res)=>{
        reject(res)
      }
    })
  ])
}

```



```vue
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
//设置徽标
useSetBadge(true);
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

```



**经过实践，可以把生命周期函数写在一个hooks文件里，然后再导入vue文件里，而且一个页面也可以同时存在多个生命周期函数，意思是使用hooks不会造成冲突，可以完美替代mixin**



### 3.导入组件问题

由于我使用vite+vscode开发，导入组件并没有像官方说的那样设置easecom就行，使用的是原生的导入方式。目前官方文档也只是放出了vue2导入组件配置easecom。

解决：按照官方推荐我把uni-ui组件复制到了components文件下，导入的时候是手动导

```typescript
import MyGoods from "@/components/my-goods/index.vue";
import UniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue";
import UniSwipeActionItem from "@/components/uni-swipe-action-item/uni-swipe-action-item.vue";
import MyAddress from "@/components/my-address/index.vue";
import MySettle from '@/components/my-settle/index.vue'
```



### 4.学到了很多布局技巧，及样式设置

**1.吸顶设置**

```css
.search-box{
    //设置为sticky
    position:sticky;
    //设置位置
    top:0;
    //设置层级
    z-index: 999;
}
```



**2.底部固定**

```css
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  //必须设置宽高，因为设置为position为fixed盒子变为了浮动
  height: 50px;
  width: 100%;
  z-index: 999;
}
```



#### 总结

设置固定位置三大步

1. **设置position**
2. **调整固定位置**
3. **提示显示等级免被覆盖**



**3.伪类**

```less
.login-container {
  //...
  //设置相对定位方便伪类定位
  position: relative;
  overflow: hidden;
  //设置末尾半椭圆
  &::after {
    //必须设置content
    content: "";
    //设置为block才能设置宽高
    display: block;
    width: 100%;
    height: 40px;
    background-color: white;
    //设置绝对定位
    position: absolute;
    //调整位置
    bottom: 0;
    left: 0;
    border-radius: 100%;
    transform: translate(0, 50%);
  }
}
```

#### 总结

**伪类五大步**

1. **父级设置绝对定位**
2. **伪类设置相对定位**
3. **伪类必须设置content**
4. **伪类设置宽高改为块**
5. **调整位置**



**其他就不再一一赘述，什么flex布局相信大家都是手拿把掐**



### 5.pinia相关问题

```typescript
import { defineStore } from 'pinia'

export const useStore = defineStore('shop', {
  state: () => ({
    //获取本地数据
    cart: <CartShop[]>JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  actions: {
    addToCart(goods: CartShop) {
      const findResult = this.cart.find((x) => x.goods_id == goods.goods_id)
      //若无商品就添加
      if (!findResult) {
        this.cart.push(goods)
      } else {
        //只增加数量
        findResult.goods_count++
      }
    },
    //实现全选功能
    FullCheckOrNo(newState:boolean){
      this.cart.forEach(x=>x.goods_state=newState)
    }
  },
  getters: {
    total(): number {
      return this.cart.reduce((pre,cur)=>pre+cur.goods_count,0)
    },
    //已勾选商品总数量
    checkCount(): number {
      return this.cart
        .filter((x) => x.goods_state)
        .reduce((pre, cur) => {
          return pre + cur.goods_count
        }, 0)
    },
    goodsTotal:(state):number=>{
      return state.cart.reduce((pre,cur)=>pre+cur.goods_count,0)
    },
    /**
     * 要么用箭头函数第一个参数就是当前store的state
     * 因为箭头函数不绑定this,
     * 要么用普通函数，可通过this拿到state，但得自己设置返回值类型
     */
    checkGoodsAmount(state){
      return state.cart.filter(x=>x.goods_state).reduce((pre,cur)=>{
        return pre+cur.goods_price*cur.goods_count
      },0).toFixed(2)
    }
  },
})

```



### 6.ts配置@路径

```json
{
  "compilerOptions": {
    //...
    "baseUrl": ".",
    "paths": {
      "@/*":[
        "src/*"
      ]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}

```

1. **先配置baseURL为当前目录 . 代表当前根目录**
2. **指定`@/*`为`src/*`**



### 7.业务逻辑

业务逻辑有点多，欢迎大家克隆仓库学习

github仓库：https://github.com/yexiyue/heima-shop



## 4.总结

这次时长15天左右的项目学习，学到了很多，但还是有点遗憾，后台接口数据我没有开发权限，导致支付功能做不来，只写了代码用不了，阉割版

下面是我博客地址：https://yexiyue.github.io/

**欢迎大家来参观**