/**
 * Author: Sabertor
 * Description: 类型常量
 * Data: Create in 10:23 2020/1/21
 */

//上行消息topic
const UP_TOPIC = "@MO/chat";

//离线状态
const STATUS_OFF_LINE = "Offline";

//在线状态
const STATUS_ON_LINE = "Online";

//通知类型
const CONTENT_TYPE_NOTIFY = "notify";

//通知类型-已接收
const NOTIFY_TYPE_RECEIVE = "received";

//通知类型-已读
const NOTIFY_TYPE_READ = "readed";

//消息类型为群消息
const MODE_GROUP = "group";

//消息类型为P2P场景
const MODE_P2P = "p2p";

//消息类型为离线补发
const MODE_REISSUE = "reissue";

//正在输入中
const NOTIFY_TYPE_ENTERING = "entering";


export {
  UP_TOPIC,
  STATUS_OFF_LINE,
  STATUS_ON_LINE,
  CONTENT_TYPE_NOTIFY,
  NOTIFY_TYPE_RECEIVE,
  NOTIFY_TYPE_READ,
  MODE_GROUP,
  MODE_REISSUE,
  NOTIFY_TYPE_ENTERING,
  MODE_P2P
}