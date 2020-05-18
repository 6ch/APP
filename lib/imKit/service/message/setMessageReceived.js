/*
 * 消息已接收回执方法
 */
const types = require("../../constants/types.js");
const sendMessage = require("./sendMessage.js");
const setMessageReceived = (message,mode,options) => {
  let temp = {
    contentType: types.CONTENT_TYPE_NOTIFY,
    notifyType: types.NOTIFY_TYPE_RECEIVE
  };

  if (mode === types.MODE_GROUP) {
    temp = {
      contentType: types.CONTENT_TYPE_NOTIFY,
      notifyType: types.NOTIFY_TYPE_RECEIVE,
      extend: {
        receiveToken: options.accToken
      }
    };
  } else if (mode === types.MODE_REISSUE) {
    temp = {
      contentType: types.CONTENT_TYPE_NOTIFY,
      notifyType: types.NOTIFY_TYPE_RECEIVE,
      extend: {
        batchReceived: true
      }
    };
  }

  let temp1 = Object.assign({}, message.payload, temp);
  let payload = {
    payload: temp1
  };
  let msg = Object.assign({}, message, payload);
  if (options.isDebug) {
    console.log("[imKit]消息已接收回执", msg);
  }
  //发送消息回执
  const result = sendMessage(msg, options);
  result.then((data)=>{
    if(data.code > 0){
      console.log("[imKit]---消息回执成功");
    }
  });
}

exports = module.exports = setMessageReceived;