//对uniapp请求方法的封装
type RequestOption = {
  [property: string]: any
  url: string
  method: 'GET' | 'POST'
  data: object | string | ArrayBuffer
  header: object
}
class MyHttpRequest {
  public baseUrl?: string

  private requestCallbackFn: (
    option: UniApp.RequestOptions,
    
  ) => UniApp.RequestOptions

  private responseCallbackFn: (
    res: UniApp.RequestSuccessCallbackResult,
    
  ) => UniApp.RequestSuccessCallbackResult

  constructor(opt: { baseUrl?: string; header?: {} } = {}) {
    this.baseUrl = opt.baseUrl

    this.requestCallbackFn = (opt) => {
      
      return opt
    }

    this.responseCallbackFn = (res) => {

      return  res
    }
  }
  //添加请求拦截的方法
  public beforeRequest(
    fn: (option: UniApp.RequestOptions) => UniApp.RequestOptions
  ) {
    this.requestCallbackFn=fn
  }
  //添加响应拦截的方法
  public afterRequest(
    fn: (
      res: UniApp.RequestSuccessCallbackResult
    ) => UniApp.RequestSuccessCallbackResult
  ) {
    this.responseCallbackFn = fn
  }

  public http(
    method: RequestOption['method'],
    url: string,
    query?: Record<string, any>
  ): Promise<UniApp.RequestSuccessCallbackResult> {
    //发送请求前的拦截
    const opt = this.requestCallbackFn({
      url,
      data: query,
    })
    //添加设置基本路径
    if(typeof this.baseUrl!='undefined'){
      opt.url=this.baseUrl+opt.url
    }
    return new Promise((resolve, reject) => {
      uni.request({
        ...opt,
        method: method,
        success: (res: UniApp.RequestSuccessCallbackResult) => {
          const result=this.responseCallbackFn(res)
          resolve(result)
        },
        fail: (res) => {
          reject(res)
        },
      })
    })
  }

  public get(url: string, query?: Record<string, any>) {
    return this.http('GET', url, query)
  }

  public post(url: string, query?: Record<string, any>) {
    return this.http('POST', url, query)
  }
}

export const myHttp = new MyHttpRequest()
