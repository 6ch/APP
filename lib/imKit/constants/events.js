/**
 * Author: Sabertor
 * Description: 事件通知常量
 * Data: Create in 10:08 2020/1/21
 */

//收到消息事件
const MESSAGE_RECEIVE = "message_received";

//系统通知类型
//登出通知
const LOG_OUT = "logout";

//群主创建通知
const GROUP_CREATE = "groupCreate";

//加群申请通知
const GROUP_JOIN = "groupJoin";

//
const GROUP_DROP = "groupKick";

//退出群聊
const GROUP_QUIT = "groupQuit";

//解散群
const GROUP_DISBAND = "groupDisband";


//入群申请
const GROUP_APPLY = "groupApply";

//群加入管理员通知
const GROUP_JOIN_ADMIN = "groupJoinAdmin";

//群退出管理员通知
const GROUP_QUIT_ADMIN = "groupQuitAdmin";

//群信息修改通知
const GROUP_INFO_CHANGE = "";


//消息未读
const MESSAGE_UNREAD = "messageUnread";

//系统通知消息
const RECEIVED_SYSTEM_NOTIFY = "receivedSystemNotify";


export {
  MESSAGE_RECEIVE,
  GROUP_DISBAND,
  LOG_OUT,
  GROUP_CREATE,
  GROUP_DROP,
  GROUP_JOIN,
  GROUP_QUIT,
  GROUP_APPLY,
  GROUP_JOIN_ADMIN,
  GROUP_QUIT_ADMIN,
  GROUP_INFO_CHANGE,
  MESSAGE_UNREAD,
  RECEIVED_SYSTEM_NOTIFY
}