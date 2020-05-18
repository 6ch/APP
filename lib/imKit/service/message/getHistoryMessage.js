/*
 * 查询历史消息
 * 返回promise
 */
const servers = require("../../constants/servers.js");
const { AGetRequest, APostRequest } = require("../../networks/requestUtils.js");
const getHistoryMessage = async (page, to, dataLine, fromType, options) => {
  let appId = options.appId;
  let accToken = options.accToken;
  const params = {
    accToken: accToken,
    appId: appId,
    page: page,
    to: to,
    sdkType:"wx",
    dataLine: dataLine,
    fromType: fromType
  }
  return await APostRequest(servers.SERVER_ADDRESS + servers.GET_HISTORY_MESSAGE, params).then((data) => {
    if (options.isDebug) {
      console.log("[imKit]查询未读消息返回结果：", data)
    }
    return data;
  });
}

exports = module.exports = getHistoryMessage;