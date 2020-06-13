import { async } from "../../lib/runtime";
import {GET,POST} from '../../utils/util'
const app = getApp()
import moment from "moment";
// pages/userDetail/userDetail.js
var userid;
var infoList;
var userInfo;
var isFlag;
var gender;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard: true,
    infoData:[],
    listData:[],
    isFlag:false,
    gender: true,
    age:0,
    stature:0,
    area:'',
    fans:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userid = options.id
    this.refreshAll()
  },
  refreshAll:function () {
    const myUserId = app.globalData.userId;
    if (!myUserId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
    this.requestInfo()
    this.requestList()
    this.requestIsFlag()
    this.getBaseInfo()
  },
 requestList: async function () {
   let that = this
    let url = '/dynamic/getList/' + userid
   const json = await GET(url)
   if (json.errCode == 200) {
    infoList = json.data.map(function (value) {
      const a = value.createTime;
      const b = moment(a).format('DDMM月');
      value.createTime = b;
      return value
     })
     that.setData({
        listData:infoList
     })
   }
   
 },
 getBaseInfo: async function () {
   let that = this
   let data = {
    userId: userid
   }
   let json = await POST('/user/baseInfo/moreInfo',data)
   console.log('---->'+json)
   if (json.errCode == 200) {
     that.setData({
       gender:json.data.gender == '男' ? true : false,
       age:json.data.age,
       area:json.data.area,
       stature:json.data.stature,
       fans:json.data.fans
     })
   }
 },
 requestInfo: async function () {
  let that = this
  let url = '/back/user/getUserInfo'
  let data = {userId:userid}
  const json = await GET(url,data)
  if (json.errCode == 200) {
    userInfo = json.data
    wx.setNavigationBarTitle({
      title: userInfo.nickName,
    })
    that.setData({
      infoData: userInfo
    })
  }
 },
 otherInfo:function () {
   wx.navigateTo({
     url: '/pages/person/otherInfo/otherInfo?userId='+userid,
   })
 },
 // 获取是否关注
 requestIsFlag:async function () {
   let that = this  
   let data = {
    attentionId: userid,
    userId: app.globalData.userId
   }
   let json = await POST('/im/friend/attention/isFlag',data)
   if (json.errCode == 200) {
    isFlag = json.data
     that.setData({
        isFlag: json.data
     })
   }
 },
 // 关注
 attentionAction: async function () {
  const myUserId = app.globalData.userId;
  if (!myUserId) {
    wx.reLaunch({
      url: '/pages/login/login',
    })
    return
  }
  let that = this  
   let data = {
    attentionId: userid,
    userId: myUserId
   }
   let json = await POST('/im/friend/attention/addAndDel',data)
   if (json.errCode == 200) {
    isFlag = !isFlag
     that.setData({
       isFlag: isFlag
     })
   }
 },
 clickCell:function (e) {
   let id = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '../homeDetail/homeDetail?id=' + id
  })
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
    this.refreshAll()
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