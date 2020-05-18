/*
 * 消息处理函数 对不同类型消息进行鉴别处理
 */
const types = require("../../constants/types.js");
const events = require("../../constants/events.js");
const getReissueMessage = require("./getReissueMessage.js");
const setMessageReceived = require("./setMessageReceived.js");
const systemMessageReceipt = require("./systemMessageReceipt.js");
const ImKitStore = require("../../store/imkitStore.js");

const handle = (message, options) => {
  const appId = options.appId;
  let pageSize = options.pageSize;
  let to = {};
  let mode = "";
  let timestamp = "";
  if (message.hasOwnProperty("to")) {
    to = message.to;
  }
  if (to.hasOwnProperty("mode")) {
    mode = to.mode;
  }
  if (message.hasOwnProperty("timestamp")) {
    timestamp = message.timestamp;
  }
  if (message.payload) {
    const { contentType, notifyType } = message.payload;
    if (contentType === types.CONTENT_TYPE_NOTIFY) {
      switch (notifyType) {
        case types.MODE_REISSUE:
          if (message.hasOwnProperty("to")) {
            //正常的补发消息
            let type = types.MODE_REISSUE;
            if (options.isDebug) {
              console.log("[imKit]-SDK收到离线补发通知", message)
            }
            const { extend } = message.payload;
            if (extend) {
              //发送所有未读数
              options.emitEvent.emit(appId + events.MESSAGE_UNREAD, JSON.parse(extend));

              const { records = [] } = JSON.parse(extend);
              records.map((value) => {
                const { accId, groupId, unread } = value;
                let from = accId;
                if (mode === types.MODE_GROUP) {
                  type = types.MODE_GROUP;
                  from = groupId;
                }
                const page = {
                  pageNum: 1,
                  pageSize: unread
                };
                const toTarget = {
                  mode: mode,
                  target: from
                };
                const result = getReissueMessage(page, toTarget, "", options);
                result.then((resultData) => {
                  const { code, data } = resultData;
                  const { total, current, size, records } = data;
                  if (code > 0 && records.length > 0) {
                    let recordsAsc = records.reverse();
                    setMessageReceived(recordsAsc[recordsAsc.length - 1], type, options);
                    //发送收到消息通知
                    options.emitEvent.emit(appId + events.MESSAGE_RECEIVE, records)
                  }
                }).catch((e) => {
                  console.log(e)
                });
              });
            }
          } else {
            //系统通知消息
            if (options.isDebug) {
              console.log("[imKit]-SDK收到系统通知离线补发", message)
            }
          }
          break;
        case events.GROUP_DISBAND:
          if (options.isDebug) {
            console.log("[imKit]-SDK收到群解散通知", message)
          }
          //群解散通知
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_DISBAND);
          break;
        case events.GROUP_JOIN:
          if (options.isDebug) {
            console.log("[imKit]-SDK收到加群通知", message)
          }
          //加群通知
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_JOIN);
          break;
        case events.GROUP_DROP:
          if (options.isDebug) {
            console.log("[imKit]-SDK收到群成员通知", message)
          }
          //删除群成员
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_DROP);
          break;
        case events.GROUP_CREATE:
          if (options.isDebug) {
            console.log("[imKit]-SDK收到群组创建通知", message)
          }
          //建群通知
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_CREATE);
          break;
        case events.GROUP_QUIT:
          if (options.isDebug) {
            console.log("[imKit]-SDK收到退群通知", message)
          }
          //退群通知
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_QUIT);
          break;
        case events.GROUP_APPLY:
          if (options.isDebug) {
            console.log("[imKit]-SDK收到申请加群通知", message)
          }
          //申请加群
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_APPLY);
          break;
        case events.GROUP_JOIN_ADMIN:
          //管理员收到申请加群通知
          if (options.isDebug) {
            console.log("[imKit]-SDK管理员收到申请加群通知", message)
          }
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_JOIN_ADMIN);
          break;
        case events.GROUP_QUIT_ADMIN:
          //管理员收到退群通知
          if (options.isDebug) {
            console.log("[imKit]-SDK管理员收到退群通知", message)
          }
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_QUIT_ADMIN);
          break;
        case events.GROUP_INFO_CHANGE:
          //群信息修改通知
          if (options.isDebug) {
            console.log("[imKit]-SDK收到群信息修改通知", message)
          }
          systemMessageReceipt(message, options);
          options.emitEvent.emit(appId + events.GROUP_INFO_CHANGE);
          break;
        case events.LOG_OUT:
          //登出通知
          if (options.isDebug) {
            console.log("[imKit]-SDK收到登出通知", message)
          }
          options.emitEvent.emit(appId + events.LOG_OUT);
          break;
        default:
          let temp = [];
          temp.push(message);
          //通知外部，收到消息
          options.emitEvent.emit(appId + events.MESSAGE_RECEIVE, temp);
          //在线消息单条回执
          setMessageReceived(message, mode, options);
      }
    } else {
      if (options.isDebug) {
        console.log("[imKit]-SDK收到在线消息", message)
      }
      let temp = [];
      temp.push(message);
      //通知外部，收到消息
      options.emitEvent.emit(appId + events.MESSAGE_RECEIVE, temp);

      //存储消息
      saveMessageToStore(message, options);
      //在线消息单条回执
      setMessageReceived(message, mode, options);
    }
  }
}

//存储正常的在线消息
const saveMessageToStore = (message, options) => {
  const key = options.accToken + message.from.accId;
  try {
    let temp = [];
    if (options.chatRecords.get(key)) {
      temp = JSON.parse(options.chatRecords.get(key));
      temp.push(message);
    } else {
      temp.push(message);
    }
    options.chatRecords.set(key, JSON.stringify(temp));
  } catch (e) {
    console.error("获取用户聊天信息发生异常:", e)
  }
}


exports = module.exports = handle;