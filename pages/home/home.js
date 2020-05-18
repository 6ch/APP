// pages/home/home.js
import { GET, POST} from "../../utils/util";
const app = getApp();
import moment from 'moment';
import regeneratorRuntime, { async } from '../../lib/runtime';
var requestData = [];          //动态列表 
var reCommondRequestData = []; //推荐列表
var searchListRequestData = [];//匹配列表
var offset = 1;
var count = 3;
var type = 1; //1 所有 2. 关注 3 好友的 6 自己的 9 同城
var searchPage = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeSelectNum:0,
    animationData:{},
    commentAnimationData:{},
    resultData:[],
    reCommondData:[],
    searchListData:[],
    itemData:["全部","关注","好友","同城","自己"],
    currentTag:0,
    headerImage:'',
    name:'Momo',
    userDetailLb:'25岁·广州·168cm·狮子座',
    timeLB:'16:45',
    imgData: ['','','','','','','',''],
    showComment:true,
    canDeletComment:false,
    commentPlaceholder:'',
    length:0,
    inputStr:'',
    userId:''
  },
  tabSelectAction: function(e){
    let num = e.currentTarget.dataset['index']

    let animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })

    animation.translate('-100vw', 0).step();
    if (num == 2){
      this.setData({
        animationData: animation.export(),
      })
    }else{
      console.log('-------->'+num);
      this.setData({
        typeSelectNum: num,
      });
    }
  },
  cancleSearch:function(){
    let animationHide = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0
    })
    animationHide.left('100vw').step();
    this.setData({
      animationData: animationHide.export(),
    });
  },
  itemSelect:function(e){
    let tag = e.currentTarget.dataset['item']
    console.log(tag)
    switch (tag) {
      case 0:
        type = 1
        break;
      case 1:
        type = 2
        break;
      case 2:
        type = 3
        break;
      case 3:
        type = 9
        break;
      case 4:
        type = 6
        break;
      default:
        break;
    }
    this.getData(true)
    this.setData({
      currentTag: tag
    })
  },
  releaseAction:function(){
    wx.navigateTo({
      url: '../release/release',
    })
  },
  commentAction:function(e){
    let animation = wx.createAnimation({
      duration: 300,
      timingFunction:'linear',
      delay:0
    })
    animation.top('calc(100vh - 250rpx)').step();
    wx.hideTabBar();
    this.setData({
      commentAnimationData:animation.export(),
      commentPlaceholder: '回复**:'
    })
  },
  closeComment:function(e){
    let commentAnimatinHide = wx.createAnimation({
      duration:300,
      timingFunction:'linear',
      delay:0
    })
    commentAnimatinHide.top('100vh').step()
    wx.showTabBar();
    this.setData({
      commentPlaceholder:'',
      inputStr:'',
      commentAnimationData:commentAnimatinHide.export()
    })
  },
  //统计输入长度
  userInput: function (e) {
    console.log("输入的内容---" + e.detail.value)
    console.log("输入的长度---" + e.detail.value.length)
    this.setData({
      length: e.detail.value.length
    })
  },
  _clickCell: function (e) {
    console.log('==========>'+this.data.typeSelectNum);
    let i = e.currentTarget.dataset.index
    if (this.data.typeSelectNum == 1){
      var id ;
      
      if (i < reCommondRequestData.length) {
        id = reCommondRequestData[i].userId
      }else{
        id = searchListRequestData[i+reCommondRequestData.length].userId
      }
      wx.navigateTo({
        url: '../userDetail/userDetail?id=' + id
      })
    }else{
      console.log(0);
      wx.navigateTo({
        url: '../homeDetail/homeDetail?id=' + requestData[i].dynamicOutput.id
      })
    }
    
  },
  // 获取动态
  getData:async function(isRefresh){
      let that = this;
      let data = {
        count: count,
        offset: offset,
        type: type,
        userId: app.globalData.userId
      };
      const json = await POST('/dynamic/search',data)
      console.log(json)
      if (json.code == 1 && json.data) {
        if (isRefresh) {
          requestData = json.data.map(function (value) {
            const a = value.dynamicOutput.createTime;
            const b = moment(a).format('YYYY年MM月DD日');
            value.dynamicOutput.createTime = b;
            return value;
          });
        }else{
          json.data = json.data.map(function (value) {
            const a = value.dynamicOutput.createTime;
            const b = moment(a).format('YYYY年MM月DD日');
            value.dynamicOutput.createTime = b;
            return value;
          });
          requestData = requestData.concat(json.data);
        }
        wx.stopPullDownRefresh({
          complete: (res) => {
            that.setData({
              resultData: requestData
            })
          },
        })
      }else{
        wx.showToast({
          title: json.errMsg,
        })
      }
  },
  // 获取推荐
  getReCommond: async function (userid){
    let that = this;
    let url = '/home/page/today/recommend/' + userid;
    const json = await GET(url);
    if (json.errCode == 200) {
      reCommondRequestData = json.data;
    }else{
      reCommondRequestData = [];
    }
    that.setData({
      reCommondData: reCommondRequestData
    })
  },
  // 获取匹配信息
  getSearchList: async function(isRefresh){
    let that = this;
    var data = {
      userId:app.globalData.userId,pageNumber:searchPage,pageSize:20
    }
    const json = await POST('/home/page/search',data)
    if (json.errCode == 200 && json.data) {
      if (isRefresh) {
        searchListRequestData = json.data.list;
      }else{
        searchListRequestData = searchListRequestData.concat(json.data.list)
      }
      that.setData({
        searchListData:  searchListRequestData
      })
    }else{

    }
  },
  // 点赞
  appreciateAction:async function(e){
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let that = this;
    let i = e.currentTarget.dataset.item
    var index = 0;

    requestData.map(function(item){
      var data = item;
      if (i == index) {
        if (data.isFlag) {
          data.likes -= 1;
          data.isFlag = false
        }else{
          data.likes += 1;
          data.isFlag = true
        }
        index ++
        return data;
      }
      index ++
      return item;
    })

    if (requestData[i].isFlag) {
      var data = {
        commentType: 0,
        correlationId: requestData[i].dynamicOutput.id,
        formUserId: app.globalData.userId,
        toUserId: requestData[i].getUserInfoOutput.userId,
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
        correlationId: requestData[i].dynamicOutput.id,
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
  _clickHeader:function (e) {
    let index = e.currentTarget.dataset.index
    let id = requestData[index].getUserInfoOutput.userId
    wx.navigateTo({
      url: '../userDetail/userDetail?id=' + id
    })
  },
  refreshAll:function(){
    offset = 1;
    searchPage = 1;
    this.getData(true)
    this.getReCommond(app.globalData.userId)
    this.getSearchList(true)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshAll();
    // app.globalData.userId = '1238481197806514178';
    this.setData({
      userId: app.globalData.userId
    })
    if (app.globalData.userId == '') {
      wx.login({
        complete: (res) => {
          console.log(res.code)
        },
      })
    }
  },
  //删除动态
  deleteAction: async function (res) {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }
    let that = this
    let index = res.currentTarget.dataset.index
    let data = {
      id: requestData[index].dynamicOutput.id,
      userId: userId
    }
    let json = await POST('/dynamic/delete',data)
    if (json.errCode == 200) {
      that.refreshAll()
    }
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
    offset += 1;
    searchPage += 1;
    this.getData(false)
    this.getSearchList(false)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})