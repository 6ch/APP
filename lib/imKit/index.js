/**
 * Author: Sabertor
 * Description: imKit工具包
 * Data: Create in 9:33 2020/03/12
 */
const servers = require("./constants/servers");
const types = require("./constants/types");
const events = require("./constants/events");
const common = require("./constants/common");
const EventEmitter = require('events');
const { initServer, mqttServer, saveVariable, createUUID } = require("./service/index.js");
const uploadImageMessage = require("./service/message/uploadImageMessage.js");
const getHistoryMessage = require("./service/message/getHistoryMessage.js");
const regeneratorRuntime = require("./service/utils/runtime.js");

class ImKit {

  constructor() {
    this.options = {
      mqttOption: {},     //内存中存储mqtt配置信息
      client: null,       //mqtt客户端
      appId: "",        //存储appId
      accToken: "",     //存储客户端返回accToken
      downTopics: [],   //需要订阅的topic 用于接收消息
      upTopics: "",     //发送消息的上行topic
      mqttUrl: '',      //存放mqtt地址
      userInfo: null,     //当前用户数据
      clientId: "",       //EMQ客户端连接ID
      baseMessageFormat: {
        "version": common.VERSION,
        "sdkType": common.SDK_TYPE,
        "sdkVersion": common.SDK_VERSION,
        "appId": this.appId,
        "msgSeq": "xxxx-xxxx-xxxx-xxxx",
        "timestamp": new Date()
      },
      pageSize: 10,     //每页拉取数量
      isDebug: false,   //是否为调试模式
      emitEvent: new EventEmitter(),  //监听通知事件
      chatRecords: new Map(),   //内存中缓存消息记录。进程关闭清除
      messageSeq:[],           //消息唯一ID
    }
  }

  init = (info, option) => {
    const that = this;
    const { appId } = option;
    this.options.clientId = createUUID();
    this.options.userInfo = info;
    this.options.appId = appId;
    const params = {
      accId: info.userId,
      appId: appId,
      nickname: info.userName,
      icon: info.icon,
      clientId: this.options.clientId,
      sdkType: "h5"
    };

    /**
     * 根据初始化入参调用imkit服务端接口
     * 保存服务端返回的数据，连接emq服务器
     * initServer返回promise对象
     */
    const result = initServer(params);

    //保存基本信息
    saveVariable(result, this.options);

    //连接EMQ
    mqttServer(result, this.options);

    //监听是否有未读消息
    this.options.emitEvent.addListener(this.options.appId + events.MESSAGE_UNREAD,(unreadObj)=>{
      const {unread,records} = unreadObj;
      this.setUnReadNums(common.UNREAD_TOTAL,unread);
      records.map((record)=>{
        this.setUnReadNums(record.accId,record.unread);
      });
    });
  }

  //-------------------------消息相关API---------------------------

  /*
   * 消息发送
   */
  sendMessage = async (message) => {
    let result = null;
    const that = this;
    const client = this.options.client;
    const topic = this.options.upTopics;
    const qos = this.options.mqttOption.pubQos;
    await client.publish(topic, JSON.stringify(message), { qos: qos, rein: true }, (err) => {
      if (err !== null) {
        console.log("[imKit]---消息发送成功");
        result = {
          code: 1,
          note: '[imKit]消息发布---成功'
        };
        const target = message.to.target;
        this.setChatRecords(target, message);
      } else {
        console.log("[imKit]消息发送---失败", err);
        result = {
          code: -1,
          note: err
        }
      }
    })

    return result;
  }


  /*
   * 封装报文数据结构
   */
  createMessage = (options) => {
    const { type = "p2p", target, mode, content, at, extend } = options;
    let message = {};
    const uuid = createUUID();
    switch (type) {
      case types.MODE_P2P:
        let part = {
          "to": {
            "mode": mode,
            "target": target
          },
          "payload": {
            "contentType": "message",
            "quoteMsgSeq": "",
            "messageType": "text",
            "content": content,
            "atAccToken": [],
            "notifyType": "",
            "extend": {

            }
          }
        };
        message = Object.assign({}, this.options.baseMessageFormat, { "msgSeq": uuid }, part);
        break;
      case types.MODE_GROUP:
        break;
      default:
        break;
    }
    return message;
  };


  createImageMessage = (options) => {
    const { type = "p2p", target, mode, content, at, extend } = options;
    const uuid = createUUID();
    let part = {
      "to": {
        "mode": mode,
        "target": target
      },
      "payload": {
        "contentType": "message",
        "quoteMsgSeq": "",
        "messageType": "image",
        "content": content,
        "atAccToken": [],
        "notifyType": "",
        "extend": extend
      }
    };
    return Object.assign({}, this.options.baseMessageFormat, { "msgSeq": uuid }, part);
  }

  /*
   * 上传图片消息
   * filePath:图片的路径
   * options:width,height,md5
   */
  uploadImageMessage = (filePath) => {
    return new Promise((resolve)=>{
      const result = uploadImageMessage(filePath, this.options);
      resolve(result);
    })
  }


  /*
   * 根据fileCode获取图片静态资源路径
   */
  getImageMessagePath = (fileCode) => {
    return servers.SERVER_ADDRESS + servers.DOWN_IMAGE_MESSAGE + "?fileCode=" + fileCode + "&appId=" + this.options.appId + "&accToken=" + this.options.accToken
  }


  /*
   * 下载图片
   */
  downloadImageMessage = (fileCode) => {
    return new Promise((resolve) => {
      wx.downloadFile({
        url: servers.SERVER_ADDRESS + servers.DOWN_IMAGE_MESSAGE + "?fileCode=" + fileCode+ "&appId=" + this.options.appId + "&accToken=" + this.options.accToken,
        success(res) {
          console.log("图片下载成功",res);
          const result = {
            filePath:res.tempFilePath,
            code:1
          }
          resolve(result)
        },
        fail(res) {
          const result = {
            code:-1,
            errMst:res.errMsg
          }
          resolve(result);
        }
      })
    });
  }


  /*
   * 收到消息回调
   */
  onMessage = (callback) => {
    this.options.emitEvent.addListener(this.options.appId + events.MESSAGE_RECEIVE,(message)=>{
      const currentChat = this.getCurrentChat();
      message.map((value)=>{
        if (value.to.mode == types.MODE_P2P && currentChat !== value.from.accId && (this.options.messageSeq.indexOf(value.msgSeq) < 0)){
          //判断如果不是在当前聊天窗口中  未读数+1   在聊天窗口中则不加
          this.setUnReadNums(value.from.accId,1);
          this.setUnReadNums(common.UNREAD_TOTAL,1);
          this.options.messageSeq.push(value.msgSeq);
        }
      })
      callback(message)
    });
  }


  /*
   * 缓存指定的聊天记录
   */
  setChatRecords = (target, message) => {
    const key = this.options.accToken + target;
    try {
      let temp = [];
      if (this.options.chatRecords.get(key)) {
        temp = JSON.parse(this.options.chatRecords.get(key));
        temp.push(message);
      } else {
        temp.push(message);
      }
      this.options.chatRecords.set(key, JSON.stringify(temp));
    } catch (e) {
      console.error("存储用户聊天信息发生异常:", e)
    }
  }


  /*
   * 获取指定的聊天记录
   * 返回JSON数组
   */
  getChatRecords = async (target,mode) => {
    const key = this.options.accToken + target;
    const that = this;
    if (this.options.chatRecords.get(key)) {
      return JSON.parse(this.options.chatRecords.get(key));
    } else {
      //如果本地没有缓存，则通过历史记录接口查询消息返回记录
      const page = {
        pageNum: 1,
        pageSize: 100
      };

      const toTarget = {
        mode: "p2p",
        target: target
      };

      let result = [];
      const historyResult = await getHistoryMessage(page, toTarget , 0 , "" ,this.options);
      if (historyResult.code > 0){
        const { total,current,size,records } = historyResult.data
        result = records.reverse();
        that.options.chatRecords.set(key, JSON.stringify(result));
        console.log(result);
      }
      return result;
    }
  }


  /*
   * 查询历史消息
   * 返回JSON数组
   * toTarget{
   *    mode:"",
   *    target:""
   * }
   */
  getHistoryMessage = (toTarget,dataLine) => {
    const page = {
      pageNum: 1,
      pageSize: 100
    };

    const messages = getHistoryMessage(page, toTarget, dataLine,"",this.options);
    messages.then((data)=>{
      console.log("---data---",data)
    })
  }


  /*
   * 存储消息未读数量，存储在缓存中
   */
  setUnReadNums = (target,num) => {
    const key = this.options.accToken + target + "@messageUnReadNums";
    let targetNum = this.getUnReadNums(target);
    let current = targetNum + num;
    //根据targetId获取未读数量
    wx.setStorageSync(key, current);
  }



  /*
   * 初次加载获取所有的未读数  存储在缓存中
   * 返回JSON数组
   */
  getUnReadNums = (target) => {
    let result = 0;

    if (target == "total") {
      const key = this.options.accToken + common.UNREAD_TOTAL + "@messageUnReadNums";
      if (wx.getStorageSync(key)) {
        //根据targetId获取未读数量
        result = parseInt(wx.getStorageSync(key));
      }
    }else if(target){
      const key = this.options.accToken + target + "@messageUnReadNums";
      if (wx.getStorageSync(key)){
        //根据targetId获取未读数量
        result = parseInt(wx.getStorageSync(key));
      }
    }

    return result;

  }


  /*
   * 删减指定未读条数
   */
  subtractUnReadNums = (target,num) => {
    const key = this.options.accToken + target + "@messageUnReadNums";
    let targetNum = this.getUnReadNums(target);
    if(targetNum == 0){
      return 
    }else if(num > targetNum){
      wx.setStorageSync(key,0);
    }else{
      let current = targetNum - num;
      wx.setStorageSync(key, current);
    }
  }


  /*
   * 去除未读条数
   */
  cleanUnReadNums = (target) => {
    const key = this.options.accToken + target + "@messageUnReadNums";
    //根据targetId获取未读数量
    wx.removeStorageSync(key);
  }

  /*
   * 传入当前聊天人员
   * 进入聊天窗口时调用，用于计算未读消息数量
   */
  setCurrentChat = (target) => {
    const key = this.options.accToken + "@currentChat";

    //认定为进入聊天窗口，清除当前用户的未读消息数且未读总数扣除相应数量
    let currentUnread = this.getUnReadNums(target);
    this.cleanUnReadNums(target);
    this.subtractUnReadNums(common.UNREAD_TOTAL,currentUnread);

    wx.setStorageSync(key,target);
  }

  /*
   * 获取当前聊天人员
   */
  getCurrentChat = () => {
    const key = this.options.accToken + "@currentChat";
    return wx.getStorageSync(key);
  }

  /*
   * 清除当前聊天人员
   */
  cleanCurrentChat = () => {
    const key = this.options.accToken + "@currentChat";
    wx.removeStorageSync(key);
  }

}

exports = module.exports = ImKit;