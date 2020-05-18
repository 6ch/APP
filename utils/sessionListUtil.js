/**
 * Author: Sabertor
 * Description: imKit 小程序端本地存储会话列表 下述为相关字段
 * Data: Create in 14:33 2020/3/18
 */
/*
 * loginId:当前在使用的用户
 * icon:当前会话的头像
 * mode:当前会话模式
 * appId:当前应用场景
 * sessionId:会话id = appId + loginId + target
 * sessionName:会话名称
 * sessionType:会话类型  系统会话和普通会话
 * content:当前会话的最新一条消息
 * unreadCount:当前会话未读数
 * sessionTimestamp:当前会话最新一条消息的时间
 */
const ImKitUtil = require("./imKitUtil.js");
class sessionListUtil {

  /*
   * 根据消息缓存会话列表
   * 目前key = appid + loginid  后续看项目需求改动
   */
  setSessionList = (message) => {
    const options = this.getUserInfo();
    const {userId,appId} = options;
    const key = appId + userId + "@imSessionList";
    const {mode,target,nickname} = message.to;
    let { content } = message.payload;
    if (message.payload.messageType === "image"){
      content = "[图片]"
    }
    const timestamp = message.timestamp;
    if(userId == message.from.accId){
      //自己发的消息
      const sessionBean = {
        loginId:userId,
        mode:mode,
        appId:appId,
        sessionId: appId + userId + target,
        sessionName: "客户001",
        sessionType:"common",
        content: content,
        unreadCount:0,
        icon:"https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg",
        sessionTimestamp: timestamp
      }
      if (this.getSessionId().indexOf(appId + userId + target) < 0) {
        //sessionId不存在
        this.setSessionId(appId + userId + target);
        let temp = this.getSessionList();
        temp.unshift(sessionBean);
        try {
          wx.setStorageSync(key, JSON.stringify(temp))
        } catch (e) {
          console.error("缓存会话列表失败:", e)
        }
      }else{
        //刷新会话的最新一条消息和时间
        const sessionList = this.getSessionList();
        const sessionId = appId + userId + target;
        let newsessionList = [];
        sessionList.map((item) => {
          if (item.sessionId === sessionId) {
            newsessionList.push(sessionBean);
          } else {
            newsessionList.push(item);
          }
        });
        wx.setStorageSync(key, JSON.stringify(newsessionList))
      }
    }else{
      let imKitUtil = ImKitUtil.getInstance();
      let imKit = imKitUtil.getImKit("wx-applet-test");
      //本人收到的消息
      const sessionBean = {
        loginId: userId,
        mode: mode,
        icon: message.from.icon,
        appId: appId,
        sessionId: appId + userId + message.from.accId,
        sessionName: message.from.nickname,
        sessionType: "common",
        content: content,
        unreadCount: imKit.getUnReadNums(message.from.accId),
        sessionTimestamp: timestamp
      }
      if (this.getSessionId().indexOf(appId + userId + message.from.accId) < 0){
        //sessionId不存在
        this.setSessionId(appId + userId + message.from.accId);
        let temp = this.getSessionList();
        temp.unshift(sessionBean);
        try {
          wx.setStorageSync(key, JSON.stringify(temp))
        } catch (e) {
          console.error("缓存会话列表失败:", e)
        }
      } else {
        //刷新会话的最新一条消息和时间
        const sessionList = this.getSessionList();
        const sessionId = appId + userId + message.from.accId;
        let newsessionList = [];
        sessionList.map((item)=>{
          if(item.sessionId === sessionId){
            newsessionList.push(sessionBean);
          }else{
            newsessionList.push(item);
          }
        });
        wx.setStorageSync(key, JSON.stringify(newsessionList))
      }
    }
  }

  /*
   * 获取会话列表
   * 目前key = appid + loginid  后续看项目需求改动
   * 返回json结构
   */
  getSessionList = () => {
    const options = this.getUserInfo();
    const { userId, appId } = options;
    const key = appId + userId + "@imSessionList";
    if (wx.getStorageSync(key)) {
      return JSON.parse(wx.getStorageSync(key));
    } else {
      return [];
    }
  }


  /*
   * 清除指定会话的未读数量
   * 目前key = appid + loginid  后续看项目需求改动
   * 返回json结构
   */
  cleanSessionUnRead = (target) => {
    const options = this.getUserInfo();
    const { userId, appId } = options;
    const key = appId + userId + target;
    const key2 = appId + userId + "@imSessionList";
    let sessionList = this.getSessionList();
    let temp = [];
    sessionList.map((session)=>{
      if(session.sessionId == key){
        const sessionBean = {
          loginId: session.loginId,
          mode: session.mode,
          icon: session.icon,
          appId: session.appId,
          sessionId: session.sessionId,
          sessionName: session.sessionName,
          sessionType: "common",
          content: session.content,
          unreadCount: 0,
          sessionTimestamp: session.sessionTimestamp
        }
        temp.push(sessionBean);
      }else{
        temp.push(session);
      }
    });

    wx.setStorageSync(key2, JSON.stringify(temp))

  }


  /*
   * 存储会话id
   * 目前key = appid + loginid  后续看项目需求改动
   */
  setSessionId = (sessionId) => {
    try {
      const options = this.getUserInfo();
      const { userId, appId } = options;
      const key = appId + userId + "@imSessionId";
      if(this.getSessionId(key).indexOf(sessionId) < 0){
        //会话ID不存在则保存
        let idtemp = this.getSessionId(key);
        idtemp.push(sessionId);
        wx.setStorageSync(key, JSON.stringify(idtemp))
      }
    } catch (e) {
      console.error("缓存用户信息发生异常:", e)
    }
  }


  /*
   * 获取会话id
   * 目前key = appid + loginid  后续看项目需求改动
   */
  getSessionId = () => {
    try {
      const options = this.getUserInfo();
      const { userId, appId } = options;
      const key = appId + userId + "@imSessionId";
      if (wx.getStorageSync(key)){
        return JSON.parse(wx.getStorageSync(key));
      }else{
        return [];
      }
    } catch (e) {
      console.error("获取缓存中的会话id发生异常:", e)
    }
  }



  /*
   * 缓存用户基本信息
   */
  setUserInfo = (options) => {
    try {
      wx.setStorageSync("imKitUserOptions", JSON.stringify(options))
    } catch (e) {
      console.error("缓存用户信息发生异常:", e)
    }
  }

  /*
   * 获取用户基本信息
   * 返回JSON对象
   * {appId:"xxx",userId:"XXX"}
   */
  getUserInfo = () => {
    if (wx.getStorageSync("imKitUserOptions")) {
      return JSON.parse(wx.getStorageSync("imKitUserOptions"));
    } else {
      return null;
    }
  }


}


exports = module.exports = new sessionListUtil();