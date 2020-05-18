// pages/person/info/info.js
import { POST, GET } from '../../../utils/util.js';
import regeneratorRuntime, { async } from '../../../lib/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: '',
    imgList: [],
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

  getUserData: async function () {
    const {userId} = this.data;
    const json = await POST('/user/baseInfo/moreInfo', { userId });
    if (json.code > 0) {
      const { data = {} } = json;
      this.setData({
        gender: data.gender,
        name: data.nickName,
        age: data.age + '岁',
        city: data.area,
        height: data.stature + 'cm',
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
          value = value ? value + 'cm' : '';
        }
        if (key == 'weight') {
          value = value ? value + '千克' : '';
        }
        if (key == 'age') {
          value = value ? value + '岁' : '';
        }
        if (key == 'salary') {
          value = value ? '月收入：' + value : '';
        }


        value && infoList.push(value);
      });
      this.setData({
        infoList: infoList,
        heartBeatObject: data.heartBeatObject,
        selfIntroduction: data.selfIntroduction,
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
          value = value ? '最高' + value + 'cm' : '';
        }
        if (key == 'ageMin') {
          value = value ? '最大' + value + '岁' : '';
        }
        if (key == 'ageMax') {
          value = value ? '最小' + value + '岁' : '';
        }
        if (key == 'salaryMin') {
          value = value ? '收入至少' + value : '';
        }
        if (key == 'salaryMax') {
          value = value ? '收入至多' + value : '';
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
    if (options.userId) {
      this.setData({ userId: options.userId }, this.getUserData);
    }

  },

})