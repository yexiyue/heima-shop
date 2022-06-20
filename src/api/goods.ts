import { myHttp } from "@/utils/request";

//获取商品列表
export async function getGoodsList(query:QueryType){
  return await (await myHttp.get('/goods/search',query)).data as GoodsData
}

//获取商品详情
export async function getGoodDetail(goodsId:string){
  return await (await myHttp.get('/goods/detail',{'goods_id':goodsId})).data as GoodsDetail
}