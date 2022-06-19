import { myHttp } from "@/utils/request";

export async function getSearchList(query:string){
  return (await myHttp.get('/goods/qsearch',{
    query
  })).data as SearchList
}