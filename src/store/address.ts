import { defineStore } from "pinia";

export const useAddress=defineStore('address',{
  state:()=>({
    address:JSON.parse(uni.getStorageSync('address')||'{}') as UniApp.ChooseAddressRes
  }),
  actions:{
    setAddressStorage(address:typeof this.address){
      uni.setStorageSync('address', JSON.stringify(address))
    }
  },
  getters:{
    addstr:(state)=>{
      return state.address.provinceName+state.address.cityName+state.address.countyName+state.address.detailInfo
    }
  }
})