// pages/activityDetail/activityDetail.js
import {POST, GET } from '../../utils/util'
import moment from 'moment'
import { async } from '../../lib/runtime';
const app = getApp()
var activityID ;
var requestData;
var requestListData = [];
var homeUserID;
var offset = 1;
var inputText ;
var touserId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoData:[],
    userList:[],
    length: 0,
    inputStr: '',
    commentNum: 1,
    listData:[],
    headerURL:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    activityID = options.id
    this.refreshAll()
  },
  getList:async function (isRefresh) {
    let that = this
    let data = {
      correlationId: activityID,
      count:10,
      offset:offset,
      type:1
    }
    const json = await POST('/comment/list',data)

    if (json.errCode == 200 && json.data) {
      json.data.map(function (value) {
        const a = value.createTime;
        const b = moment(a).format('YYYY年MM月DD日');
        value.createTime = b;
        return value
      })
      if (isRefresh) {
        requestListData = json.data
      }else{
        requestListData = requestListData.concat(json.data) 
      }
      wx.stopPullDownRefresh({
        complete: (res) => {
          that.setData({
            listData: requestListData
          })
        },
      })
    }
  },
  commentAction: function (isReCommond) {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0
    })
    animation.top('calc(100vh - 250rpx)').step();
    // wx.hideTabBar();
    touserId = !isReCommond ? touserId : homeUserID
    this.setData({
      commentAnimationData: animation.export(),
      commentPlaceholder: '回复**:'
    })
  },
  closeComment: function (e) {
    let commentAnimatinHide = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0
    })
    commentAnimatinHide.top('100vh').step()
    // wx.showTabBar();
    this.setData({
      commentPlaceholder: '',
      inputStr: '',
      commentAnimationData: commentAnimatinHide.export()
    })
  },
  _clickCell: function (e) {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let index = e.currentTarget.dataset.index
    touserId = requestListData[index].formUserId
    this.commentAction(false);
  },
  //统计输入长度
  userInput: function (e) {
    console.log("输入的内容---" + e.detail.value)
    console.log("输入的长度---" + e.detail.value.length)
    inputText = e.detail.value;
    this.setData({
      length: e.detail.value.length
    })
  },
  toMap:function () {
    // wx.navigateTo({
    //   url: '../map/map',
    // })
  },
  clickHeader: function (e) {
    let i = e.currentTarget.dataset.index
    touserId = requestListData[i].formUserId
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + touserId
    })
  },
  // 获取活动详情
  getBasicInfo: async function () {
    let that = this
    let data = {id:activityID,userId:app.globalData.userId}
    let json = await POST('/activity/detailInfo',data)
    if (json.errCode == 200) {
      const a = json.data.activityMoreInfo.activityStartTime;
      const b = moment(a).format('YYYY-MM-DD HH:mm');
      const c = json.data.activityMoreInfo.activityEndTime
      const d = moment(c).format('YYYY-MM-DD HH:mm')
      json.data.activityMoreInfo.activityStartTime = b;
      json.data.activityMoreInfo.activityEndTime = d;
      touserId = json.data.userInfoOutput.userId
      homeUserID = touserId
      requestData = json.data
      that.setData({
        infoData:requestData
      })
    }
  },
  // 点赞
  appreciateAction: async function () {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let that = this;
    if (requestData.isLike) {
      requestData.likeNum -= 1;
      requestData.isLike = false
    }else{
      requestData.likeNum += 1;
      requestData.isLike = true
    }

    if (requestData.isLike) {
      var data = {
        commentType: 0,
        correlationId: activityID,
        formUserId: app.globalData.userId,
        toUserId: requestData.userInfoOutput.userId,
        type: 1
      }
      const json = await POST('/comment/add',data)
      if (json.errCode == 200) {
        that.setData({
          infoData: requestData
        })
      }  
    }else{
      var data = {
        correlationId: activityID,
        formUserId: app.globalData.userId,
        type: 1
      }
      const json = await POST('/comment/cancel/like',data)
      if (json.errCode == 200) {
        that.setData({
          infoData: requestData
        })
      }  
    }
    
  },
  // 预定
  reserveAction: async function () {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    if (requestData.isJoin) {
      return ;
    }else{
      var timeStamp = Date.parse(new Date())
      timeStamp = timeStamp / 1000
      wx.requestPayment({
        nonceStr: 'nonceStr',
        package: 'package',
        paySign: 'paySign',
        timeStamp: timeStamp,
        success:function (res) {
          
        },
        fail:function (res) {
          
        },
        complete:function (res) {
          
        }
      })
      let that = this
      let data = {
        activityCost: requestData.activityMoreInfo.activityCost,
        activityId: activityID,
        userId: app.globalData.userId,
        weChatId: '用户微信openID'
      }
      const json = await POST('/activity/join'.data)
    }
  },
  // 获取参加用户列表
  getUserList:async function () {
    let that = this
    let url = '/activity/join/get/' + activityID
    let json = await GET(url)
    if (json.errCode == 200) {
      that.setData({
        userList:json.data
      })
    }
  },
   // 添加评论
   add: async function () {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let that = this
    let data = {
        commentType: 1,
        commentContent:inputText,
        correlationId: activityID,
        formUserId: app.globalData.userId,
        toUserId: touserId,
        type: 1
      }
      const json = await POST('/comment/add',data)
      if (json.errCode == 200) {
        this.closeComment()
        this.refreshAll()
      }

  },
  refreshAll:function () {
    offset = 1
    this.getBasicInfo()
    this.getUserList()
    this.getList(true)
    this.getUserInfo()
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
    offset ++
    this.getList(false)
  },
  getUserInfo: async function () {
    let that = this
   let data = {
    userId: app.globalData.userId
   }
   let json = await POST('/user/baseInfo/moreInfo',data)
   console.log(json)
   if (json.errCode == 200) {
     that.setData({
       headerURL:json.data.headUrl || '../person/assets/头像.png'
     })
   }
  }
})