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
export function useSetBadge(){
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
  //添加监听器
  watch(()=>store.total,()=>{
    setTabBarBadge()
  })
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

