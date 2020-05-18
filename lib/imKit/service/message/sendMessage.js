/*
 * 消息发送方法
 */
const sendMessage = async (message,options) => {
  let result = null;
  const client = options.client;
  const topic = options.upTopics;
  const qos = options.mqttOption.pubQos;
  await client.publish(topic, JSON.stringify(message), { qos: qos, rein: true }, (err) => {
    if (err !== null) {
      console.log("[imKit]消息发送---成功");
      result = {
        code: 1,
        note: '[imKit]消息发布---成功'
      }
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

exports = module.exports = sendMessage;