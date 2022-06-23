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
