/**
 * Author: Sabertor
 * Description: 常量类
 * Data: Create in 16:39 2020/1/7
 */

//imKit 服务端地址
//const SERVER_ADDRESS = "http://192.168.80.246:8088";
const SERVER_ADDRESS = "http://218.66.59.169:3266"

//前端请求 注册接口
const INIT = "/imKit/api/init";

//根据用户ID查询用户在线状态
const QUERY_STATE = "/imKit/api/user/queryState";

//创建群里接口地址
const CREATE_GROUP = "/imKit/api/group/groupCreate";

//查询群组信息接口地址
const QUERY_GROUP = "/imKit/api/group/groupList";

//加入群聊
const JOIN_GROUP = "/imKit/api/group/groupJoin";

//群组踢人
const DELETE_GROUP_MEMBER = "/imKit/api/group/deleteGroupMember";

//退出群聊
const QUIT_GROUP = "/imKit/api/group/quitGroup";

//解散群组
const DISBAND_GROUP = "/imKit/api/group/disbandGroup";

//获取群成员信息
const GET_MEMBERS = "/imKit/api/group/getMembers";

//查询历史消息
const GET_HISTORY_MESSAGE = "/imKit/api/message/historyMessage";

//查询未读消息
const GET_REISSUE_MESSAGE = "/imKit/api/message/reissueMessage";

//上传图片到服务器
const UPLOAD_IMAGE_MESSAGE = "/imKit/stream/upload";

//从服务器下载图片资源
const DOWN_IMAGE_MESSAGE = "/imKit/stream/download";


export {
  SERVER_ADDRESS,
  INIT,
  QUERY_STATE,
  CREATE_GROUP,
  QUERY_GROUP,
  DELETE_GROUP_MEMBER,
  QUIT_GROUP,
  DISBAND_GROUP,
  JOIN_GROUP,
  GET_MEMBERS,
  GET_HISTORY_MESSAGE,
  GET_REISSUE_MESSAGE,
  UPLOAD_IMAGE_MESSAGE,
  DOWN_IMAGE_MESSAGE
}