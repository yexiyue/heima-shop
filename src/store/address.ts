import { defineStore } from "pinia";

export const useAddress=defineStore('address',{
  state:()=>({
    address:JSON.parse(uni.getStorageSync('address')||'{}') as UniApp.ChooseAddressRes | undefined,
    token:uni.getStorageSync('token'),
    userInfo:JSON.parse(uni.getStorageSync('userInfo')||'{}') as UniApp.GetUserInfoRes['userInfo'] |undefined,
    redirectInfo:<{openType:string,from:string}|undefined>{}
  }),
  actions:{
    setAddressStorage(address:typeof this.address){
      uni.setStorageSync('address', JSON.stringify(address))
    },
    setUserInfo(userInfo:typeof this.userInfo){
      uni.setStorageSync('userInfo',JSON.stringify(userInfo))
    }
  },
  getters:{
    addstr:(state)=>{
      return state.address!.provinceName+state.address!.cityName+state.address!.countyName+state.address!.detailInfo
    }
  }
})