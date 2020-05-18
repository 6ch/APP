// pages/person/auth/acadAuth/acadAuth.js
import { POST, GET } from '../../../../utils/util.js';
const app = getApp();
import moment from 'moment';
import regeneratorRuntime, { async } from '../../../../lib/runtime';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		school: '',
    educationalBackground: '',
		picker: ['博士', '硕士', '学士', '大专', '大专', '高中及以下'],
		tip: "打造100%真实交友平台，为了信息的真实准确,每个人都需要完成实名认证才能开启交友功能",
	},
	PickerChange(e) {
    console.log(e);
    const { picker } =this.data;
    this.setData({
      educationalBackground: picker[e.detail.value],
    })
  },

  getUserData: async function () {
    const userId = app.globalData.userId;
    const json = await POST('/user/baseInfo/get/authentication', { visitorId: userId });
    const { picker  } = this.data;
    if (json.code > 0) {
      const { data = {} } = json;
      this.setData({
        school: data.schoolName,
        educationalBackground: data.educationalBackground,
      });
    }

  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
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