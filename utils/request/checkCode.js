import responseCode from './responseCode';

export const defaultErrorResponse = {
  code: responseCode.SERVER_CONNECT_FAILED,
  note: '服务器连接失败',
}

export function checkCode(response) {

  // 如果返回的response中没有statusCode值,请求链接失败
  if (!response.code) {
    return defaultErrorResponse;
  }

  const { code, note } = response; 

  if (
    code === responseCode.INVALID_TOKEN ||
    code === responseCode.NULL_TOKEN ||
    code === responseCode.QUIT_TOKEN
  ) {
    wx.showToast({ title: note })
    // token失效类，直接退出登录
    wx.reLaunch({
      url: '/pages/auth/auth',//跳转到授权页面
    })
  } else if (code < 0) {
    // 请求失败类，可能为uuid、连接、接口错误等原因造成
    console.log(`请求失败：${note}，错误代码：${code}`);
  } else {
    // 请求成功类，可能为请求成功但无数据，可能就是请求成功
    console.log('请求成功');
  }
  return response;
}