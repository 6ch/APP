/**
 * Author: Sabertor
 * Description: imKit工具包-根据实际场景自定义封装EMQ调用
 * Data: Create in 9:33 2020/03/12
 */

const mqttClient = require("../../mqtt/mqtt.min.js");
const ImKitStore = require("../../store/imkitStore.js");
const handle = require("../message/handle.js");

const mqttServer = (promise,options) => {
  promise.then((data) => {
    console.log(data);
    const { code, object } = data;
    if (code > 0) {
      const { accToken, globalConfig, mqtt, topic } = object;  //获取基本控制参数
      const { messageRoam, pageSize, publishTargetTopic } = globalConfig; //获取全局通用配置参数
      const { authMode, brokers, cleanSession, clientAuth, connectTimeout, keepAliveInterval, password, pubQos, reconnectPeriod, sslEnabled, subQos, username } = mqtt; //获取MQTT配置参数

      const mqttOptions = {
        // 超时时间
        connectTimeout: connectTimeout * 1000,
        // 认证信息
        clientId: options.clientId,
        // 心跳时间
        keepalive: keepAliveInterval,
        clean: true,
        reconnectPeriod: reconnectPeriod * 1000
      };

      const url = "wxs://dongdong.apexsoft.com.cn/mqtt";
      // const url = "wxs://192.168.80.246:8084/mqtt";
      const client = mqttClient.connect(url, mqttOptions);

      options.client = client;

      client.on('connect', () => {
        console.log('连接成功');
        client.subscribe(topic, { qos: subQos }, (err) => {
          console.log('[imKit]客户端订阅用户默认主题---成功', topic);
        });

        client.on('message', (topic, message) => {
          console.log("[imKit]---收到消息", JSON.parse(message.toString()));
          
          //传入消息处理方法中
          handle(JSON.parse(message.toString()),options);
        });
      })

      client.on('reconnect', (error) => {
        console.log('正在重连:', error)
      })

      client.on('error', (error) => {
        console.log('连接失败:', error)
      })

    }
  })


}


export {
  mqttServer
}