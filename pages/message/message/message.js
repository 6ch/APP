// pages/chat/message/message.js
const sessionListUtil = require("../../../utils/sessionListUtil.js");
const app = getApp();
const ImKitUtil = require("../../../utils/imKitUtil.js");
Page({

  /**
   * 组件的初始数据
   */
  data: {
    list: [
      // { id: 1, name: '陈小明', content: '备忘录内容详情备忘录内容详情备忘录内容详情备忘录内容详情', time: '下午14:00', num: 5}
    ]
  },

  onLoad: function (options) {
    const userId = app.globalData.userId;
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refreshList(){
      const that = this;
      const sessionList = sessionListUtil.getSessionList();
      let list = [];
      sessionList.map((session) => {
        const item = {
          id: session.sessionId,
          name: session.sessionName,
          content: session.content,
          time: new Date(session.sessionTimestamp).getHours() + ":" + new Date(session.sessionTimestamp).getMinutes(),
          icon:session.icon,
          num: session.unreadCount
        }
        list.push(item)
      });
      that.setData({
        list:list
      })
    },

    //收到消息改变会话列表
    listenerMessage() {
      let that = this;
      let imKitUtil = ImKitUtil.getInstance();
      let imKit = imKitUtil.getImKit("wx-applet-test");

      let lastItem = "";
      imKit.onMessage((message) => {
        let temp = this.data.message;
        message.map((value) => {
          sessionListUtil.setSessionList(value);
        });
        that.refreshList();
      })
    },
  },

 /**
   * 组件的生命周期
   */
  lifetimes:{
    attached(){
      this.refreshList();
      this.listenerMessage();
    },
    detached() {
      //在组件实例被从页面节点树移除时执行
      console.log("detached");
    },
    moved(){
      console.log("message.js,moved");
    }
  },

  pageLifetimes: {
    show: function () {
      // 页面被展示
      this.refreshList();
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})