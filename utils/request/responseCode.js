// 请求相关的提示代码
const code = {
  // token为空导致请求失败
  NULL_TOKEN: -990,

  // token过期导致请求失败
  INVALID_TOKEN: -991,

  // token失效
  QUIT_TOKEN: -992,

  // uuid为空 导致请求失败
  NULL_UUID: -201,

  // uuid重复请求 导致失败
  REPEAT_UUID: -202,

  // app客户端与服务端连接异常
  SERVER_CONNECT_FAILED: -3,

  // 数据库操作异常
  DATABASE_OPERATE_FAILED: -4,

  // fsdp 调用异常
  FSDP_OPERATE_FAILED: -501,

  // fsdp 连接异常
  FSDP_CONNECT_FAILED: -502,

  // 请求成功并且数据集有结果
  SUCCESS: 100,

  // 请求成功，暂无数据
  SUCCESS_NO_DATA: 101,
};

export default code;
