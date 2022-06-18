import { myHttp } from "../utils/request";
//设置基本路径
myHttp.baseUrl='https://api-ugo-web.itheima.net/api/public/v1'

//添加请求拦截
myHttp.beforeRequest((opt)=>{
  uni.showLoading({
    title:'数据加载中...'
  })
  return opt
})

//添加响应拦截
myHttp.afterRequest((res)=>{
  uni.hideLoading()
  return res
})

//获取轮播图数据
export async function getSwiperList():Promise<SwiperData>{
  return (await myHttp.get('/home/swiperdata')).data as SwiperData
}

//获取导航栏数据
export async function getNavList():Promise<NavData>{
  return await (await myHttp.get('/home/catitems')).data as NavData
}

//获取楼层数据
export async function getFloorList():Promise<FloorData>{
  //对navigator_url数据进行处理
  const data=(await myHttp.get('/home/floordata')).data as FloorData
  data.message.forEach(v=>{
    v.product_list.forEach(v1=>{
      let query:string=v1.navigator_url.split('?')[1]
      v1.navigator_url='/subpkg/goods_list/index'+'?'+query
    })
  })
  return data
}