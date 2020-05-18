// pages/chat/chat.js
const ImKitUtil = require("../../../utils/imKitUtil.js");
const sessionListUtil = require("../../../utils/sessionListUtil.js");
import regeneratorRuntime from '../../../lib/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastItem: '',
    height: wx.getSystemInfoSync().windowHeight - 110,
    inputMsg: '',
    modalShow: false,
    InputBottom: 0,
    message: [
      // {content: '这是第一条数据', type: 1, self: true, time: '2018年3月23日 13:23',id:1}
    ],
    selfIcon: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg',
    otherIcon: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg',
  },

  toInvestmentAdvisor() {
    wx.navigateTo({
      url: '../investmentAdvisor/InvestmentAdvisor',
    })
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height,
    })
    setTimeout(() => {
      this.setData({
        lastItem: 'item-' + this.data.message.length
      })
    }, 100);
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },
  // sendMsgTap(e) {
  //   const newMsg = this.data.message.concat([]);
  //   const date = new Date();
  //   newMsg.push({ content: e.detail.value, type: 1, self: true, time: `${date.getHours()}:${date.getMinutes()}`, id: newMsg.length + 1 });
  //   this.setData({
  //     inputMsg: '',
  //     message: newMsg,
  //     lastItem: "item-"+newMsg.length,
  //   },()=>{
  //     this.toBottom();
  //   })
  // },

  toBottom() {
    wx.createSelectorQuery().select('#content').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom,
        duration: 100
      })
    }).exec();
  },

  showModal(e) {
    this.setData({
      InputBottom: 100,
      modalShow: true
    })
  },
  hideModal(e) {
    this.setData({
      InputBottom: 0,
      modalShow: false
    })
  },
  uploadPic() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];

        let imKitUtil = ImKitUtil.getInstance();
        let imKit = imKitUtil.getImKit("wx-applet-test");
        const result = imKit.uploadImageMessage(tempFilePaths);
        result.then((data) => {
          console.log("----执行结束图片上传成功----", data)
          const { fileCode, thumbnailMd5, height, width, md5 } = data;
          //构造基础的消息结构
          let mode = "p2p";
          let options = {
            type: mode,
            target: "kehu001",
            mode: mode,
            content: fileCode,
            extend: {
              md5: md5,
              thumbnailMd5: thumbnailMd5,
              height: height,
              width: width
            }
          };

          //调用imkit创建消息报文 然后发送消息
          const message = imKit.createImageMessage(options);
          const result = imKit.sendMessage(message);

          const newMsg = that.data.message.concat([]);
          const date = new Date();
          newMsg.push({ content: tempFilePaths, type: 2, self: true, time: `${date.getHours()}:${date.getMinutes()}`, id: newMsg.length + 1 });
          that.setData({
            lastItem: "item-" + (newMsg.length + 1),
            message: newMsg
          })
        });
      }
    });
  },
  photograph() {
    var that = this;
    console.log('拍照');
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        let imKitUtil = ImKitUtil.getInstance();
        let imKit = imKitUtil.getImKit("wx-applet-test");
        const result = imKit.uploadImageMessage(tempFilePaths);
        result.then((data) => {
          console.log("----执行结束图片发送成功----", data)
          const newMsg = that.data.message.concat([]);
          const date = new Date();
          newMsg.push({ content: tempFilePaths, type: 2, self: true, time: `${date.getHours()}:${date.getMinutes()}`, id: newMsg.length + 1 });
          that.setData({
            lastItem: "item-" + (newMsg.length + 1),
            message: newMsg
          })
        });
      }
    });
  },
  video() {
    var that = this;
    console.log('视频');
    wx.chooseVideo({
      success(res) {
        const tempFilePath = res.tempFilePath;
        const newMsg = that.data.message.concat([]);
        const date = new Date();
        newMsg.push({ content: tempFilePath, type: 3, self: true, time: `${date.getHours()}:${date.getMinutes()}`, id: newMsg.length + 1 });
        that.setData({
          message: newMsg
        })
      }
    })
  },
  file() {
    console.log('文件');
    wx.getSavedFileList({
      success(res) {
        console.log(res);
      }
    })
  },


  /**
   * 集成ImKit相关方法
   * 从imKit-SDK获取当前聊天记录 转换成现在页面需要的数据结构 渲染到页面
   * customer为暂时写死的用户ID
   */
  getChatRecords: async function () {
    let that = this;
    let imKitUtil = ImKitUtil.getInstance();
    let imKit = imKitUtil.getImKit("wx-applet-test");
    const records = await imKit.getChatRecords("kehu001");   //通过imkit获取和客户001的聊天记录
    let customRecords = [];
    let lastItem = "";
    if (records !== null) {
      for (let i = 0; i < records.length; i++) {
        //判断是否是自己发的
        let self = false;
        if (records[i].from.accId === "kefu12312") {
          self = true
        }

        //判断消息类型
        let type = 0;
        if (records[i].payload.messageType === "text") {
          type = 1;
          let temp = {
            content: records[i].payload.content,
            type: type,
            self: self,
            time: new Date(records[i].timestamp).getHours() + ":" + new Date(records[i].timestamp).getMinutes(),
            id: records[i].msgSeq
          };
          lastItem = "item-" + records[i].msgSeq;

          customRecords.push(temp);
        } else if (records[i].payload.messageType === "image"){
          type = 2;
          const filePath = imKit.getImageMessagePath(records[i].payload.content);
          const content = { content: filePath, type: 2, self: self, time: new Date(records[i].timestamp).getHours() + ":" + new Date(records[i].timestamp).getMinutes(), id: records[i].msgSeq };
          customRecords.push(content);
          lastItem = "item-" + records[i].msgSeq;
          that.setData({
            message: customRecords
          }, () => {
            that.toBottom();
          });
        }
      }
      this.setData({
        lastItem:lastItem,
        message: customRecords
      }, () => {
        that.toBottom();
      });
    }
  },



  /**
   * 集成ImKit相关方法
   * 通过ImKit发送消息
   */
  sendMsgTap: function (e) {
    //获取已经初始化的IMkit实例
    let that = this;
    let imKitUtil = ImKitUtil.getInstance();
    let imKit = imKitUtil.getImKit("wx-applet-test");

    //构造基础的消息结构
    let mode = "p2p";
    let options = {
      type: mode,
      target: "kehu001",
      mode: mode,
      content: e.detail.value
    };

    //调用imkit创建消息报文 然后发送消息
    const message = imKit.createMessage(options);
    const result = imKit.sendMessage(message);

    //消息发送结果回调
    result.then((data) => {
      if (data.code > 0) {
        sessionListUtil.setSessionList(message);   //根据消息产生会话列表
        //消息发送成功
        const newMsg = that.data.message.concat([]);
        const date = new Date();
        newMsg.push({ content: e.detail.value, type: 1, self: true, time: new Date().getHours()+":"+new Date().getMinutes(), id: newMsg.length + 1 });
        that.setData({
          lastItem: "item-" + (newMsg.length + 1),
          inputMsg: '',
          message: newMsg,
          lastItem: "item-" + newMsg.length,
        }, () => {
          that.toBottom();
        })
      }
    });
  },


  /**
    * 集成ImKit相关方法
    * 收到消息回调
    */
  listenerMessage: function () {
    let that = this;
    let imKitUtil = ImKitUtil.getInstance();
    let imKit = imKitUtil.getImKit("wx-applet-test");

    //设置当前聊天对象
    imKit.setCurrentChat("kehu001");
    sessionListUtil.cleanSessionUnRead("kehu001");   //进入聊天窗口则清除未读数量

    let lastItem = "";
    imKit.onMessage((message) => {
      let temp = this.data.message;
      message.map((value) => {
        if (value.payload.messageType == "image") {
          const filePath = imKit.getImageMessagePath(value.payload.content);
          const content = { content: filePath, type: 2, self: false, time: new Date(value.timestamp).getHours() + ":" + new Date(value.timestamp).getMinutes(), id: value.msgSeq };
          lastItem = "item-" + value.msgSeq;
          temp.push(content);
        }else{
          sessionListUtil.setSessionList(value);
          const content = { content: value.payload.content, type: 1, self: false, time: new Date(value.timestamp).getHours() + ":" + new Date(value.timestamp).getMinutes(), id: value.msgSeq };
          lastItem = "item-" + value.msgSeq;
          temp.push(content);
        }
      });
      that.setData({
        lastItem:lastItem,
        message: temp
      },()=>{
        that.toBottom();
      });
    })
  },


  /**
   * imKit
   * 滑动到顶部  加载更多历史消息
   */
  loadMoreHistory: function () {
    console.log("预留加载历史消息,后续补充");
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      lastItem: 'item-' + this.data.message.length
    })
    // this.toBottom();
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
    //获取当前用户存储在内存中的消息
    this.getChatRecords();
    this.listenerMessage();  //监听消息回调
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
    let imKitUtil = ImKitUtil.getInstance();
    let imKit = imKitUtil.getImKit("wx-applet-test");
    //清除当前聊天对象
    imKit.cleanCurrentChat();
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