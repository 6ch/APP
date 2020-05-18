// pages/login/login.js
const app = getApp();
import { GET,POST } from "../../utils/util";
import regeneratorRuntime, { async } from '../../lib/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'',
    getCode: '验证码',
    codeDisabled:true,
    ajxtrue:false,
  },
  blurPhone: function (e) {
    var phone = e.detail.value;
    let that = this
    if (!(/^1[345789]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false,
        phoneNumber: phone,
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          icon: 'error',
          duration: 2000,
          image: '../images/logo.jpg'
        })
      }
    } else {
      this.setData({
        ajxtrue: true,
        phoneNumber: phone,
      })
      console.log('验证成功', that.data.ajxtrue)
    }
  },
   formSubmit:async function(e){
    let that = this
    let val = e.detail.value
    const {ajxtrue, phoneNumber} = this.data;
    if (ajxtrue == true) {
      //表单提交进行
      const json = await GET('/user/baseInfo/getPhoneValidateCode', { phone:phoneNumber });
      console.log(json);
      if (json.errCode == 200) {



        // 倒计时操作
        var times = 60
        var i = setInterval(function () {
          times--
          if (times == 0) {
            that.setData({
              color: "#ff6f10",
              disabled: false,
              getCode: "获取验证码",
            })
            clearInterval(i)
          } else {
            that.setData({
              getCode: "重新获取" + times + "s",
              color: "#999",
              disabled: true
            })
          }
        }, 1000);
      } else {
        wx.showToast({
          title: json.note  || "获取手机验证码失败",
          icon: 'error',
          duration: 2000,
          image:'../images/logo.jpg'
        })
      }
 
    } else {
      wx.showToast({
        title: '手机号有误',
        icon: 'error',
        duration: 2000,
        image:'../images/logo.jpg'
      })
    }
  },


  setValidateCode: function (e) {
    this.setData({ validateCode: e.detail.value });
  },

  loginAction: async function(){
    const { validateCode, phoneNumber} = this.data;
    const json = await POST('/user/baseInfo/register', { phone: phoneNumber, role: 1, validateCode });
    if (json.code > 0) {
      const {data={}} = json;
      if (data.userId) {
        app.globalData.userId = data.userId;
        wx.switchTab({ url: '/pages/home/home' });
      }
    }
  },
  wxLogin: function () {
    wx.login({
      complete: (res) => {
        console.log('------'+res.code)
       wx.request({
         url: 'https://www.ygtqzhang.cn/MiniProgramApiController/miniProgramApi/code2Session',
         method: "post",
         data: {
           code: res.code
         },
         success: function (res) {
          console.log(res);
         }
       })
      },
      fail:function (res) {
        console.log(res);
      }
    })
    wx.getUserInfo({
      complete: (res) => {
        console.log(res)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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