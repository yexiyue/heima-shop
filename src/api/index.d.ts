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