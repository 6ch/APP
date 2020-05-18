/**
 * Author: Sabertor
 * Description: 封装通用网络请求
 * Data: Create in 9:43 2020/3/12
 */
const AGetRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: "GET",
      success(res) {
        resolve(res.data)
      },
      fail(res) {
        reject(res.data)
        console.error("请求服务端异常", res)
      }
    })
  })
}


const APostRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: "POST",
      success(res) {
        resolve(res.data)
      },
      fail(res) {
        reject(res.data)
        console.error("请求服务端异常", res)
      }
    })
  })
}


export{
  AGetRequest,
  APostRequest
}