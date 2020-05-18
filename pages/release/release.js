// pages/release/release.js
import { POST, GET, uploadPics } from '../../utils/util.js';
const app = getApp();
import regeneratorRuntime, { async } from '../../lib/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputStr: '',
    imgList: [],
    picLen: 0,
  },

  onLoad: function(e) {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },

  setInputStr: function (e) {
    this.setData({ inputStr: e.detail.value });
  },

  release: async function (e) {
    const userId = app.globalData.userId;
    const { inputStr, picLen, imgList } = this.data;

    let urlPicture = [];
    if (picLen) {
      const json = await uploadPics(imgList);
      if (json.code > 0) {
        urlPicture = json.data;
      } else{
        return;
      }
    }
    const json1 = await POST('/dynamic/publish', { urlPicture, content: inputStr, userId, type: 1 });
    if (json1.code > 0) {
      wx.navigateBack();
    }
  },
 
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
            picLen: this.data.imgList.length,
          })
        }
      }
    })
  },
  
	uploadPic: function (){
    var that = this;
    const { picLen = 0, imgList = [] } = this.data;
		wx.chooseImage({
			count: 9 - picLen, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			// sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
			success: function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const choosePic = res.tempFilePaths;
        that.setData({ 
          imgList: imgList.concat(choosePic), 
          picLen: picLen + choosePic.length,
        });
      }
    });
	},
})