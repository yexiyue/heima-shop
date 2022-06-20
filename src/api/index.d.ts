//声明getSwiperList类型
declare interface SwiperData {
  message: Message[];
  meta:    Meta;
}

declare interface Message {
  goods_id:      number;
  image_src:     string;
  navigator_url: string;
  open_type:     string;
}

declare interface Meta {
  msg:    string;
  status: number;
}

//声明navList类型
declare interface NavData {
  message: Message1[];
  meta:    Meta;
}

declare interface Message1 {
  image_src:      string;
  name:           string;
  navigator_url?: string;
  open_type?:     string;
}

//声明楼层数据类型
declare interface FloorData {
  message: Message2[];
  meta:    Meta;
}

declare interface Message2 {
  floor_title:  FloorTitle;
  product_list: ProductList[];
}

declare interface FloorTitle {
  image_src: string;
  name:      string;
}

declare interface ProductList {
  image_src:     string;
  image_width:   string;
  name:          string;
  navigator_url: string;
  open_type:     string;
}

//商品分类类型
declare interface CateDate {
  message: Message3[];
  meta:    Meta;
}

declare interface Message3 {
  cat_deleted: boolean;
  cat_icon:    null | string;
  cat_id:      number;
  cat_level:   number;
  cat_name:    string;
  cat_pid:     number;
  children:    Message3[];
}

//searchList返回值类型
declare interface SearchList {
  message: Message4[];
  meta:    Meta;
}

declare interface Message4 {
  goods_id:   number;
  goods_name: string;
}

//goodsList返回值类型
declare interface GoodsData {
  message: Message5;
  meta:    Meta;
}

declare interface Message5 {
  goods:   Good[];
  pagenum: number;
  total:   number;
}

declare interface Good {
  add_time:         number;
  cat_id:           number;
  cat_one_id:       number;
  cat_three_id:     number;
  cat_two_id:       number;
  goods_big_logo:   string;
  goods_id:         number;
  goods_name:       string;
  goods_number:     number;
  goods_price:      number;
  goods_small_logo: string;
  goods_weight:     number;
  hot_mumber:       number;
  is_promote:       boolean;
  upd_time:         number;
}

declare type QueryType={
  query?:string,
  cid?:string,
  pagenum:number,
  pagesize:number
}