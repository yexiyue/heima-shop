import { myHttp } from '@/utils/request'
declare type UserQuery = {
  code: string
  encryptedData: string
  rawData: string
  iv: string
  signature: string
}
declare interface TokenData {
  message: Message7
  meta: Meta
}

declare interface Message7 {
  user_id: number
  user_email_code?: any
  is_active?: any
  user_sex: string
  user_qq: string
  user_tel: string
  user_xueli: string
  user_hobby: string
  user_introduce?: any
  create_time: number
  update_time: number
  token: string
}
export async function postToken(query: UserQuery) {
  return (await myHttp.post('/users/wxlogin', query)).data as TokenData
}


//预付订单
export async function postOrder(orderNumber: string) {
  return (
    await myHttp.post('/my/orders/req_unifiedorder', {
      order_number: orderNumber
    })
  ).data
}


declare interface OrderCreate {
  message: Message8;
  meta: Meta;
}

declare interface Meta {
  msg: string;
  status: number;
}

declare interface Message8 {
  order_id: number;
  user_id: number;
  order_number: string;
  order_price: number;
  order_pay: string;
  is_send: string;
  trade_no: string;
  order_fapiao_title: string;
  order_fapiao_company: string;
  order_fapiao_content: string;
  consignee_addr: string;
  pay_status: string;
  create_time: number;
  update_time: number;
  order_detail?: any;
  goods: Good[];
}

declare interface Good {
  id: number;
  order_id: number;
  goods_id: number;
  goods_price: number;
  goods_number: number;
  goods_total_price: number;
}
//创建订单
export async function postOrderCreate(query: {
  order_price: number
  consignee_addr: string
  goods: Array<{ goods_id: number; goods_number: number; goods_price: number }>
}) {
  return (await myHttp.post('/my/orders/create', query)).data as OrderCreate
}
