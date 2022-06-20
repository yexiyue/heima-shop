import { myHttp } from "@/utils/request";

export async function getGoodsList(query:QueryType){
  return await (await myHttp.get('/goods/search',query)).data as GoodsData
}