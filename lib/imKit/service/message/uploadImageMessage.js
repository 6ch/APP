const servers = require("../../constants/servers.js");

let md5 = "";
let width = 0;
let height = 0;
let options = {};
let filePath = "";

function step1(resolve, reject) {
  //通过传入的filepath 调用微信api解析获取md5
  wx.getFileInfo({
    filePath: filePath,
    success(res) {
      md5 = res.digest;
      const result = {
        code: 1,
        md5: md5
      }
      resolve(result);
    },
    fail() {
      //处理失败问题  要返回给前端项目  先预留
      resolve({
        code: -1,
        note: "无法获取图片信息"
      })
    }
  })
    
}

function step2(resolve, reject) {
  wx.getImageInfo({
    src: filePath,
    success(res2) {
      width = res2.width;
      height = res2.height;
      resolve({
        code:1,
        width:width,
        height:height
      })
    },
    fail() {
      //处理失败问题  要返回给前端项目  先预留
      resolve({
        code: -1,
        note: "无法获取图片信息"
      })
    }
  })
}

function step3(resolve, reject) {
  wx.uploadFile({
    url: servers.SERVER_ADDRESS + servers.UPLOAD_IMAGE_MESSAGE,
    filePath: filePath,
    name: 'file',
    header: {
      "content-type": "multipart/form-data"
    },
    formData: {
      appId: options.appId,
      accToken: options.accToken,
      type: "image",
      md5: md5,
      h: height,
      w: width
    },
    success(res) {
      // {"note":"上传成功","code":1,"fileCode":"ee85d9a4-5452-4df5-b669-dab2c39ad598","fileStreamMd5":"eef9a368fa575d49588200596e3cbcf8","thumbnailMd5":"869da6fab1849e7da7da805f367c4d8b"}
      JSON.parse(res.data);
      const result = Object.assign({},JSON.parse(res.data), {width:width,height:height,md5:md5});
      resolve(result);
    },
    fail(res){
      resolve(res)
    }
  })
}

const uploadImageMessage = (localFilepath,optionsVal) => {
  filePath = localFilepath;
  options = optionsVal;
  return new Promise(step1)
    .then(function (val) {
      return new Promise(step2);
    })
    .then(function (val) {
      return new Promise(step3);
    })
}


exports = module.exports = uploadImageMessage;
