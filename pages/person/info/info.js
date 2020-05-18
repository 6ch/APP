// pages/person/info/info.js
import { POST, GET, uploadPics } from '../../../utils/util.js';
const app = getApp();
import regeneratorRuntime, { async } from '../../../lib/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    otherUrls:[],
    ava: '../assets/头像.png',
    name: '',
    age: '',
    city: '',
    height: '',
    fans: '0',
    gender: '',
    infoList: [],
    partnerInfo: [],



    modalName: '',
    selfIntroduction: '',
    heartBeatObject: '',

  },

  uploadingOtherUrls:async function (e){
    const userId = app.globalData.userId;
    const json1 = await uploadPics(this.data.imgList);
    if (json1.code > 0) {
      const {data = []} = json1;
      const json = await POST('/user/extendInfo/uploadingOtherUrls', { userId, otherUrls: data })
      if (json.code > 0){
        this.getUserData();
        this.setData({ imgList: []  });
      }
    }
    
  },

  ViewImageotherUrls(e) {
    wx.previewImage({
      urls: this.data.otherUrls,
      current: e.currentTarget.dataset.url
    });
  },
  DelImgotherUrls(e) {
    const userId = app.globalData.userId;
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: async res => {
        if (res.confirm) {
          const json = await POST('/user/extendInfo/deleteOtherUrls', { userId, otherUrl: e.currentTarget.dataset.url })
          if (json.code > 0) {
            this.getUserData();
          }
        }
      }
    })
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除这张图片吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList,
          })
        }
      }
    })
  },

  uploadPic: function () {
    var that = this;
    const { imgList = [] } = this.data;
    wx.chooseImage({
      count: 20,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const choosePic = res.tempFilePaths;
        that.setData({
          imgList: imgList.concat(choosePic),
        });
      }
    });
  },
  getUserData: async function () {
    const userId = app.globalData.userId;
    const json = await POST('/user/baseInfo/moreInfo', { userId });
    if (json.code > 0) {
      const { data = {} } = json;
      this.setData({
        gender: data.gender,
        name: data.nickName,
        age: data.age+'岁',
        city: data.area,
        height: data.stature+'cm',
        fans: data.fans,
        ava: data.headUrl || './assets/头像.png',
      });
    }

    const json3 = await GET(`/user/extendInfo/get/${userId}`);
    if (json3.code > 0) {
      const { data = {} } = json3;
      const keyList = [
        'stature',
        'weight',
        'age',
        'gender',
        'marriedStatus',
        'nativePlace',
        'area',
        'company',
        'industry',
        'salary',
        'housing',
        'automobile',
        'hopeMarriedTime',
        'lonelinessIndex',
        'isCookDinner',
      ];
      const infoList = [];
      keyList.map((key) => {
        let value = data[key];
        if (key == 'stature') {
          value = value ? value+ 'cm' : '';
        }
        if (key == 'weight') {
          value = value ? value + '千克' : '';
        }
        if (key == 'age') {
          value = value ? value + '岁' : '';
        }
        if (key == 'salary') {
          value = value ? '月收入：'+value : '';
        }


        value && infoList.push(value);
      });
      this.setData({
        infoList: infoList,
        heartBeatObject: data.heartBeatObject,
        selfIntroduction: data.selfIntroduction,
        otherUrls: data.otherUrls.split(';'),
      });
    }

    const json4 = await GET(`/user/get/mateSelection/${userId}`);
    if (json4.code > 0) {
      const { data = {} } = json4;
      const keyList4 = [
        'statureMin',
        'statureMax',
        'ageMin',
        'ageMax',
        'educationalBackground',
        'nativePlace',
        'area',
        'company',
        'salaryMin',
        'salaryMax',
        'housing',
        'automobile',
      ];
      const partnerInfo = [];
      keyList4.map((key) => {
        let value = data[key];
        if (key == 'statureMin') {
          value = value ? '最低' + value + 'cm' : '';
        }
        if (key == 'statureMax') {
          value = value ? '最高'+ value + 'cm' : '';
        }
        if (key == 'ageMin') {
          value = value ?'最大'+ value + '岁' : '';
        }
        if (key == 'ageMax') {
          value = value ? '最小' + value + '岁' : '';
        }
        if (key == 'salaryMin') {
          value = value ? '收入至少' + value  : '';
        }
        if (key == 'salaryMax') {
          value = value ? '收入至多' + value  : '';
        }


        value && partnerInfo.push(value);
      });
      this.setData({
        partnerInfo: partnerInfo,
      });
    }
  
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    this.getUserData();
  },

  onShow: function (options) {
    this.getUserData();
  },


  hideModal: function () {
    this.setData({ modalName: "", selfIntroductionTmp: '', heartBeatObjectTmp: '', });
  },

  showModal1: function () {
    this.setData({ modalName: "DialogModal1" });
  },

  showModal2: function () {
    this.setData({ modalName: "DialogModal2" });
  },

  setSelfIntroduction: function (e) {
    this.setData({
      selfIntroductionTmp: e.detail.value
    });
  },

  addSelfIntroduction: async function () {
    const userId = app.globalData.userId;
    const { selfIntroductionTmp } = this.data;
    const json = await POST('/user/extendInfo/addSelfIntroduction', { userId, selfIntroduction: selfIntroductionTmp });
    if (json.code > 0) {
      this.getUserData();
      this.hideModal();
    }
  },

  setHeartBeatObject: function (e) {
    this.setData({
      heartBeatObjectTmp: e.detail.value
    });
  },

  addHeartBeatObject: async function () {
    const userId = app.globalData.userId;
    const { heartBeatObjectTmp } = this.data;
    const json = await POST('/user/extendInfo/addHeartBeatObject', { userId, heartBeatObject: heartBeatObjectTmp });
    if (json.code > 0) {
      this.getUserData();
      this.hideModal();
    }
  },

})