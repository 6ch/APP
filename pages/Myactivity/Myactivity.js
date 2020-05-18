import { async } from "../../lib/runtime"
import {POST} from '../../utils/util'
import moment from 'moment'
// pages/Myactivity/Myactivity.js
const app = getApp()
var offset = 1;
var type = 1;
var listRequestData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard: true,
    listData:[]
  },
  clickAction:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../activityDetail/activityDetail?id='+id,
    })
  },
  getResult:async function (isRefresh) {
    let that = this
    let data = {
      count:10,
      offset: offset,
      type:type,
      userId: app.globalData.userId
    }
    const json = await POST('/activity/search',data)
    console.log(json)
    if (isRefresh) {
      listRequestData = json.data.map(function (value) {
        const a = value.activityStartTime;
        const b = moment(a).format('YYYY年MM月DD日');
        const c = value.activityEndTime
        const d = moment(c).format('YYYY年MM月DD日')
        value.activityStartTime = b;
        value.activityEndTime = d;
        return value;
      });
    }else{
      json.data = json.data.map(function (value) {
        const a = value.activityStartTime;
        const b = moment(a).format('YYYY年MM月DD日');
        const c = value.activityEndTime
        const d = moment(c).format('YYYY年MM月DD日')
        value.activityStartTime = b;
        value.activityEndTime = d;
        return value;
      });
      listRequestData = listRequestData.concat(json.data);
    }
    wx.stopPullDownRefresh({
      complete: (res) => {
        that.setData({
          listData: listRequestData
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    offset = 1;
    if (options.type) {
      type = 3
    }
    this.getResult(true)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    offset ++
    this.getResult(false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    offset = 1
    this.getResult(true)
  },
})