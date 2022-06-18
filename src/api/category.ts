import { myHttp } from "../utils/request";

export async function getCateList(){
  return await (await myHttp.get('/categories')).data as CateDate
}