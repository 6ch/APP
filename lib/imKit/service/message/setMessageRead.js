/*
 * 消息已读回执方法
 */
const types = require("../../constants/types.js");
const sendMessage = require("./sendMessage.js");
const setMessageRead = (message, options) => {
  let temp = {
    contentType: types.CONTENT_TYPE_NOTIFY,
    notifyType: types.NOTIFY_TYPE_READ
  };
  let temp1 = Object.assign({}, message.payload, temp);
  let payload = {
    payload: temp1
  };
  let msg = Object.assign({}, message, payload);
  if (options.isDebug) {
    console.log("[imKit]消息已读回执", msg);
  }

  sendMessage(msg, options);

}

exports = module.exports = setMessageRead;