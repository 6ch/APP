/*
 * 系统消息回执方法
 */
const types = require("../../constants/types.js");
const sendMessage = require("./sendMessage.js");
const systemMessageReceipt = (message, options) => {
  let temp = {
    contentType: types.CONTENT_TYPE_NOTIFY,
    notifyType: types.NOTIFY_TYPE_RECEIVE
  };
  let temp1 = Object.assign({}, message.payload, temp);
  let payload = {
    payload: temp1
  };
  let msg = Object.assign({}, message, payload);
  if (options.isDebug) {
    console.log("[imKit]---系统消息已接收回执", msg);
  }

  //消息回执同时将通知回调给外部系统
  // this.sendSystemMessage(msg);
  sendMessage(msg,options);

}


exports = module.exports = systemMessageReceipt;