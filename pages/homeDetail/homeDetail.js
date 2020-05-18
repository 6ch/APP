import { async } from "../../lib/runtime";
import {POST} from '../../utils/util'
import moment from "moment";
 
const app = getApp()
var requestData ; 
var requestListData = [];
var offset = 1;
var inputText ;
var touserId;
var selectIndex;
// pages/homeDetail/homeDetail.js
var detailID ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard: true,
    showComment: true,
    canDeletComment: false,
    commentPlaceholder: '',
    length: 0,
    inputStr: '',
    resultData:[],
    listData:[]
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
    touserId = !isReCommond ? touserId : requestData.getUserInfoOutput.userId
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
  //统计输入长度
  userInput: function (e) {
    console.log("输入的内容---" + e.detail.value)
    inputText = e.detail.value;
    console.log("输入的长度---" + e.detail.value.length)
    this.setData({
      length: e.detail.value.length
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
    selectIndex = index;
    touserId = requestListData[index].formUserId
    this.commentAction(false);
  },
  moreAction:function(e){
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let that = this
    wx.showActionSheet({
      itemList: ['删除评论'],
      success(res){
        console.log(res.tapIndex)
        that.deleAction(e.currentTarget.dataset.index)
      },
      fail(res){

      }
    })
  },
  clickHeader: function () {
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + touserId
    })
  },
  clickCellHeader:function (e) {
    let i = e.currentTarget.dataset.index
    touserId = requestListData[i].formUserId
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + touserId
    })
  },
  getResult:async function () {
    let that = this;
    let data = {
      id: detailID,
      userId: app.globalData.userId
    }
    const json = await POST('/dynamic/info',data)
    if (json.errCode == 200) {
      requestData = json.data;
      touserId = requestData.getUserInfoOutput.userId
      const a = requestData.dynamicOutput.createTime;
      const b = moment(a).format('YYYY年MM月DD日');
      // const b = getDate(a)
      requestData.dynamicOutput.createTime = b;
      that.setData({
        resultData: requestData
      })
    }
  },
  
  getList:async function (isRefresh) {
    let that = this
    let data = {
      correlationId: detailID,
      count:10,
      offset:offset,
      type:0
    }
    const json = await POST('/comment/list',data)
    console.log(json)
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
  // 删除评论
  deleAction: async function (e) {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let that = this
    let i = e//.currentTarget.dataset.index
    console.log(i)
    var data = {
      formUserId: app.globalData.userId,
      id: requestListData[i].id,
      type: 0
    }
    const json = await POST('/comment/delete',data)
    console.log(data)
    console.log(json)
    if (json.errCode == 200) {
      // requestListData.splice(i,1)
      // that.setData({
      //   listData: requestListData
      // })
      that.getList(true)
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
    console.log(requestData);
    let data = {
        commentType: 1,
        commentContent:inputText,
        correlationId: requestData.dynamicOutput.id,
        formUserId: app.globalData.userId,
        toUserId: touserId,
        type: 0
      }
      console.log(data)
      const json = await POST('/comment/add',data)
      console.log(json)
      if (json.errCode == 200) {
        this.closeComment()
        this.refreshAll()
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
    if (requestData.isFlag) {
      requestData.likes -= 1;
      requestData.isFlag = false
    }else{
      requestData.likes += 1;
      requestData.isFlag = true
   }

    if (requestData.isFlag) {
      var data = {
        commentType: 0,
        correlationId: requestData.dynamicOutput.id,
        formUserId: app.globalData.userId,
        toUserId: requestData.getUserInfoOutput.userId,
        type: 0
      }
      const json = await POST('/comment/add',data)
      if (json.errCode == 200) {
        that.setData({
          resultData: requestData
        })
      }  
    }else{
      var data = {
        correlationId: requestData.dynamicOutput.id,
        formUserId: app.globalData.userId,
        type: 0
      }
      const json = await POST('/comment/cancel/like',data)
      if (json.errCode == 200) {
        that.setData({
          resultData: requestData
        })
      }  
    }
   
  },
  refreshAll:function () {
    this.getResult()
    this.getList(true)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    detailID = options.id
    this.refreshAll(options)
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
    offset = 1;
    this.getResult()
    this.getList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    offset ++
    this.getList(false)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})