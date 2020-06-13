// pages/person/info/edit/edit.js
import { POST, GET } from '../../../../utils/util.js';
const app = getApp();
import regeneratorRuntime, { async } from '../../../../lib/runtime';
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    modalName: '',
		tabData: ['个人信息', '择偶标准'],
		TabCur: 0,
    educationList: ['博士', '硕士', '学士', '大专', '大专', '高中及以下'],
		marryList: ['保密','无婚史','离异无孩','离异有孩','丧偶无孩','丧偶有孩'],
		houseList: ['保密','有房有贷','有房无贷','需要时购房','暂未购房','与父母同住'],
		carList: ['保密','暂未购车','经济型车','中档型车','豪华型车'],
		expectedMarriageTimeList: ['1年内','2年内'],
		lonelyList: ['偶尔想找个人聊','看电影想找个人','生病想找个人','吃饭想找个人','想结束单身'],
		cookList: ['不会做','不太会','一般','还可以','满意','非常好'],
		info: {
      stature: '',
			weight: '',
			age: '',
      gender: '',
      marriedStatus: '',
      nativePlace: '',
      area: '',
			company: '',
      industry: '',
			salary: '',
      housing: '',
      automobile: '',
      hopeMarriedTime: '',
      lonelinessIndex: '',
      isCookDinner: '',
		},
		winfo: {
      statureMin: '',
      statureMax: '',
      ageMin: '',
      ageMax:'',
      educationalBackground: '',
      nativePlace: '',
      area: '',
      salaryMin: '',
      salaryMax: '',
      housing: '',
      automobile: '',
		},
	},

  inputChange: function (e) {
    const key = e.currentTarget.id;
    const { info = {} } = this.data;
    this.setData({
      info: { ...info, [key]: e.detail.value },
    })
  },

  inputChangew: function (e) {
    const key = e.currentTarget.id;
    const { winfo = {} } = this.data;
    this.setData({
      winfo: { ...winfo, [key]: e.detail.value },
    })
  },

  genderChange: function (e) {
    const { info = {} } = this.data;
    this.setData({
      info: { ...info, gender: e.detail.value },
    })
  },

  educationPickerChange(e) {
    const { winfo = {}, educationList } = this.data;
    this.setData({
      winfo: { ...winfo, educationalBackground: educationList[e.detail.value] },
    })
  },

	RegionChange: function(e) {
		const {info={}} = this.data;
    const value = e.detail.value;
    const nativePlace = value.join(' ');
    this.setData({
			// region: e.detail.value
      info: { ...info, nativePlace: e.detail.value.join(' ')}
    })
	},
	
	curRegionChange: function(e) {
		const {info={}} = this.data;
    this.setData({
			// region: e.detail.value
      info: { ...info, area: e.detail.value.join(' ') }
    })
  },

	marryPickerChange(e) {
    const { info = {},marryList} = this.data;
    this.setData({
      info: { ...info, marriedStatus: marryList[e.detail.value] }
    })
	},
	housePickerChange(e) {
    const { info = {}, houseList} = this.data;
    this.setData({
      info: { ...info, housing: houseList[e.detail.value] }
    })
	},
	carPickerChange(e) {
    const { info = {}, carList} = this.data;
    this.setData({
      info: { ...info, automobile: carList[e.detail.value] }
    })
	},
	expectedMarriageTimePickerChange(e) {
    const { info = {}, expectedMarriageTimeList} = this.data;
    this.setData({
      info: { ...info, hopeMarriedTime: expectedMarriageTimeList[e.detail.value] }
    })
	},
	lonelyPickerChange(e) {
    const { info = {}, lonelyList} = this.data;
    this.setData({
      info: { ...info, lonelinessIndex: lonelyList[e.detail.value] }
    })
	},
	cookPickerChange(e) {
    const {info={},cookList} = this.data;
    this.setData({
      info: { ...info, isCookDinner: cookList[e.detail.value] }
    })
	},

	// wRegionChange: function(e) {
	// 	const {winfo={}} = this.data;
  //   this.setData({
	// 		// region: e.detail.value
  //     winfo: { ...winfo, nativePlace: e.detail.value.join(' ') }
  //   })
	// },
	
	// wcurRegionChange: function(e) {
	// 	const {winfo={}} = this.data;
  //   this.setData({
	// 		// region: e.detail.value
  //     winfo: { ...winfo, area: e.detail.value.join(' ') }
  //   })
	// },
	
	whousePickerChange(e) {
    const { winfo = {}, houseList} = this.data;
    this.setData({
      winfo: { ...winfo, housing: houseList[e.detail.value] }
    })
	},
	wcarPickerChange(e) {
    const { winfo = {}, carList} = this.data;
    this.setData({
      winfo: { ...winfo, automobile: carList[e.detail.value] }
    })
	},

	tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },

  getUserData: async function () {
    const userId = app.globalData.userId;
    // 个人信息
    const json = await GET(`/user/extendInfo/get/${userId}`);
    if (json.code > 0) {
      const { data = {} } = json;
      this.setData({
        info: { ...data}
      });
    }

    // 择偶信息
    const json1 = await GET(`/user/get/mateSelection/${userId}`);
    if (json1.code > 0) {
      const { data = {} } = json1;
      this.setData({
        winfo: { ...data }
      });
    }
  },

  formSubmitinfo: async function (e) {
    // 修改个人信息
    const userId = app.globalData.userId;
    const { info = {} } = this.data;
    const json = await POST('/user/extendInfo/editAndUpdate', { userId, ...info});
    if (json.code > 0) {
      wx.navigateBack();
    }
  },


  formSubmitwinfo: async function (e) {
    // 修改个人信息
    const userId = app.globalData.userId;
    const { winfo = {} } = this.data;
    const json = await POST('/user/set/mateSelection', { userId, ...winfo });
    if (json.code > 0) {
      wx.navigateBack();
    }
  },


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
    if (options.TabCur) {
      this.setData({ TabCur: options.TabCur });
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