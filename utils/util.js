const serverUrl = "https://www.ygtqzhang.cn";
const upPicsUrl = "https://www.ygtqzhang.cn/file/uploadBatch";
const upPicUrl = "https://www.ygtqzhang.cn/file/upload";

var wxUserID = '1238473977920352257';
const GET = (url, params) => {
  return request( 'GET',url, params);
}

const uploadPic = (tempFilePaths) => {
  return upload(tempFilePaths, upPicUrl);
}

const uploadPics = async (tempFilePaths=[]) => {
  let count = 0;
  let data = [];

  if (tempFilePaths && tempFilePaths.length) {
    for (let i = 0; i < tempFilePaths.length; i++) {
      const json = await upload(tempFilePaths[i], upPicUrl);
      if (json.code > 0) {
        count += 1;
        data.push(json.data);
      }
    }
    if (count > 0) {
      return { data, code: 1, note: `${count}张图片上传成功` };
    }
    return { data, code: -1, note: '图片上传失败' };
  }

  return { data, code: -1, note: '无图片需要上传' };

}

const upload = (tempFilePaths, url) => {
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: url,
      name: 'file',
      filePath: tempFilePaths,
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        // token: token,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          const { data = '' } = res;
          let jsondata = {};
          jsondata = JSON.parse(data);
        
          if (jsondata.errCode === 200) {
            resolve({ code: 1, ...jsondata });
          } else {
            wx.showToast({
              title: data.errMsg,
            })
            resolve({ code: -1, ...jsondata, note: data.errMsg });
          }


        } else {
          wx.showToast({
            title: res.errMsg,
          })
          resolve({ code: -1, note: res.errMsg });
        }
      },
      fail(res) {
        wx.showToast({
          title: res.errMsg,
        })
        resolve({ code: -1, note: res.errMsg });
      }
    });
  });
}

const POST = (url, params) => {
  return request( 'POST',url, params);
}

const defaultErrorResponse = {
  code: -1,
  note: '服务器连接失败',
}
const request = (method = 'GET', url, params) => {
  let httpurl = serverUrl + url;
  if (method === 'GET') {
  //  httpurl = parseParams(params, httpurl); 
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: httpurl,
      timeout: 15000,
      method,
      // responseType: 'json',
      data: params,
      header: {
        'content-type': 'application/json;charset=UTF-8' // 默认值
      },
      success(res) {
        if (res.statusCode === 200) {
          const { data ={}} = res;
          if (data.errCode === 200) {
            resolve({ code: 1, ...data });
          } else {
            resolve({ code: -1, ...data, note: data.errMsg });
          }
          

        } else {  
          resolve({ code: -1, note: res.errMsg });
        }
      },
      // complete (res) {
      //   if (res.statusCode === 200) {
      //     const { data = {} } = res;
      //     resolve({code:1,...data});
      //   } else {  
      //     resolve({code: -1,note:res.errMsg});
      //   }
      // },
      fail(res) { 
        resolve({code: -1,note:res.errMsg});
      }
    });
  });
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

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  GET,
  POST,
  uploadPic,
  uploadPics,
  wxUserID
}
