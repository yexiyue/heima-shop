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
export async function encapsulateData(container:any,getDataFn:()=>Promise<any>){
  const res=await getDataFn()
  //请求失败
  if(res.meta.status!==200){
    return showMsg()
  }
  //请求成功
  container.push(...res.message)
  showMsg('数据请求成功')
}