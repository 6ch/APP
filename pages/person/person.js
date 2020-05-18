// pages/person/person.js
import { POST, uploadPic } from '../../utils/util.js';
const app = getApp();
import regeneratorRuntime, { async } from '../../lib/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ava: './assets/头像.png',
    sign: "",
    no: '',
    account: "",
    modalName: "",
    label: ["用户"],
  },

  updateHeadUrl: function () {
    const userId = app.globalData.userId;
    var that = this;
    const { imgList = [] } = this.data;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: async function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const choosePic = res.tempFilePaths;
        const json1 = await uploadPic(choosePic[0]);
        if (json1.code > 0) {
          const {data = ''} = json1;
          const json = await POST('/user/baseInfo/updateHeadUrl', { headUrl: data, userId });
          if (json.code > 0) {
            that.getUserData();
          }
        }
      }
    });
    

    
  },

  showModal1: function() {
    this.setData({ modalName: "DialogModal1"});
  },

  showModal2: function() {
    this.setData({ modalName: "DialogModal2"});
  },

  hideModal: function() {
    this.setData({ modalName: ""});
  },

  updateNickName: async function () {
    const userId = app.globalData.userId;
    const { nickName} = this.data;
    const json = await POST('/user/baseInfo/updateNickName', { userId, nickName });
    if (json.code > 0) {
      this.getUserData();
      this.hideModal();
    }
  },

  setName: function(e) {
    this.setData({
      nickName: e.detail.value
    });
  },

  setSign: function(e) {
    this.setData({
      monologue: e.detail.value
    });
  },

  updateMonologue: async function () {
    const userId = app.globalData.userId;
    const { monologue } = this.data;
    const json = await POST('/user/extendInfo/updateMonologue', { userId, monologue });
    if (json.code > 0) {
      this.getUserData();
      this.hideModal();
    }
  },


  getUserData: async function () {
    const userId = app.globalData.userId;
    const json = await POST('/user/baseInfo/moreInfo', { userId });
    if (json.code > 0) {
      const { data = {} } = json;
      this.setData({
        no: data.userNum,
        account: data.nickName,
        sign: data.monologue ||"我的独白 个性签名",
        ava: data.headUrl || './assets/头像.png',
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
    this.getUserData();
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
    this.getUserData();
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