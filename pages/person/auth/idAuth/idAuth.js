// pages/person/auth/idAuth/idAuth.js
import { POST, GET, uploadPic } from '../../../../utils/util.js';
const app = getApp();
import moment from 'moment';
import regeneratorRuntime, { async } from '../../../../lib/runtime';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		gender: '',
		name: "",
		tip: "打造100%真实交友平台，为了信息的真实准确,每个人都需要完成实名认证才能开启交友功能",
		qq: '',
		wx: '',
		date: '',
		imgSrc: '../../assets/头像.png',
	},

	DateChange(e) {
    this.setData({
      date: e.detail.value
    })
	},
	
	uploadPic: async function (){
    var that = this;
    // const { picLen = 0, imgList = [] } = this.data;
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
			// sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: async function (res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const choosePic = res.tempFilePaths;
        const json = await uploadPic(choosePic[0] );
        if (json.code >0) {
          const {data}= json;
          that.setData({ 
            imgSrc: data
          });
        }
      
      }
    });
	},

	getUserData: async function () {
    const userId = app.globalData.userId;
    const json = await POST('/user/baseInfo/get/authentication', { visitorId: userId });
    if (json.code > 0) {
      const { data = {} } = json;
      const date = moment(data.dateOfBirth).format('YYYY-MM-DD');
      this.setData({
        name: data.realName,
        wx: data.weChat,
        qq: data.qq,
        imgSrc: data.headUrl || './assets/头像.png',
        date: date,
      });
    }

    const json2 = await GET('/user/baseInfo/getGender', { userId });
    if (json2.code > 0) {
      const { data = '' } = json2;
      this.setData({
        gender:data,
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