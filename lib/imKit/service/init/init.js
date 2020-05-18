/*
 * Imkit初始化函数
 */
const servers = require("../../constants/servers");
const { AGetRequest, APostRequest } = require("../../networks/requestUtils.js");

/**
  * 对接imkit服务端 初始化基本数据
  */
const initServer = (params) => {

  //发起初始化网络请求
  const response = APostRequest(servers.SERVER_ADDRESS + servers.INIT, params);
  return response.then((result) => {
    return result;
  }).catch((e) => {
    console.log("[imKit]Exception:", e);
  });
};


/**
  * 保存基础数据到内存
  */
const saveVariable = (promise, variable) => {
  promise.then((data) => {
    const { code, object } = data;
    if (code > 0) {
      const { accToken, globalConfig, mqtt, topic } = object;  //获取基本控制参数
      const { messageRoam, pageSize, publishTargetTopic } = globalConfig; //获取全局通用配置参数
      const { authMode, brokers, cleanSession, clientAuth, connectTimeout, keepAliveInterval, password, pubQos, reconnectPeriod, sslEnabled, subQos, username } = mqtt; //获取MQTT配置参数

      //存储数据到内存
      variable.accToken = accToken;
      variable.mqttOption = {
        // 超时时间
        connectTimeout: connectTimeout * 1000,
        // 认证信息
        clientId: variable.clientId,
        // 心跳时间
        keepalive: keepAliveInterval,
        clean: true,
        reconnectPeriod: reconnectPeriod * 1000
      };
      variable.upTopics = publishTargetTopic;
      variable.downTopics = topic;

      let fromObj = {
        appId: variable.appId,
        from: {
          accId: variable.userInfo.userId,
          from_type: variable.userInfo.sign || "user",
          accToken: accToken
        }
      };

      variable.baseMessageFormat = Object.assign({}, variable.baseMessageFormat, fromObj);

    }
  });
};


export {
  initServer,
  saveVariable
}