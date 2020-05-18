// pages/assets/assets.js
import { POST, uploadPic } from '../../utils/util.js';
const app = getApp();
import regeneratorRuntime, { async } from '../../lib/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
    'https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg',
      'https://ossweb-img.qq.com/images/lol/web201310/skin/big10003.jpg'],},
  TapImage(e){
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    })
  },


  search: async function (e) {
    const userId = app.globalData.userId;
    const json = await POST('/dynamic/search', { type: 6, userId, count: 20, offset: 1 });
    if (json.code > 0) {
      const {data={}} = json;
      this.setData({ list: data });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.search();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})