import { serverUrl } from '../../constants/env';
import logger from './logger';
import { checkCode, defaultErrorResponse } from './checkCode';

/**
 * 封装微信的的request
 */
export default function request(url, data = {}, method = "POST", callback, header="application/json") {
  // wx.showLoading({
  //   title: '加载中...',
  // });
  const logEntry = {};
  let httpurl = serverUrl + url;
  if (method === 'GET') {
   httpurl = parseParams(data, httpurl); 
  }
  logEntry.started = Date.now();
  logEntry.method = method;
  logEntry.url = url;
  logEntry.data = data;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: httpurl,
      data: data,
      method: method,
      header: {
        Accept: '*/*',
        'content-type': header,
        // 'x-auth-token': wx.getStorageSync('token'),
        // 'x-request-uuid': wxuuid(),
      },
      success: function (res) {
        logEntry.took = Date.now() - logEntry.started;
        logEntry.resp = res.data;
        if (res.statusCode === 200) {
          const { data } = res;
          const response = checkCode(data);
          logEntry.resp = response;
          resolve(response);
        } else {  
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        // 服务器连接失败
        logEntry.took = Date.now() - logEntry.started;
        logEntry.resp = defaultErrorResponse;
        reject(defaultErrorResponse)
      },
      complete: function (e) {
        callback && callback();// 成功的回调
        // wx.hideLoading()
        logger.logBuffer.push(logEntry);
        logger.printBuffer();
      }
    })
  }).catch((e)=>{
    console.log('请求失败', e);
    return e;
  })
}

function parseParams(params, baseurl) {
  try {
      if (JSON.stringify(params) === "{}") {
        return baseurl;
      }
      let tempArr = [];
      for (let i in params) {
          const key = encodeURIComponent(i);
          const value = encodeURIComponent(params[i]);
          tempArr.push(key + '=' + value);
      }
      const urlParamsStr = tempArr.join('&');
      const url = baseurl+"?"+urlParamsStr;
      return url;
  } catch (err) {
      return baseurl;
  }
}

const wxuuid = function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
 
  var uuid = s.join("");
  return uuid
 
}