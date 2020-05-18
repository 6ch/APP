/**
 * Author: Sabertor
 * Description: imKit内部缓存
 * Data: Create in 9:43 2020/3/12
 */
class ImKitStoreClass{

  /*
   * 缓存clientId
   */
  setClientId = (key1,key2,clientId) => {
    const key = key1 + key2 + "@clientId";
    try {
      wx.setStorageSync(key,clientId)
    } catch (e) {
      console.error("缓存用户信息发生异常:", e)
    }
  }

  /*
   * 获取clientId
   */
  getClientId = (key1, key2) => {
    const key = key1 + key2 + "@clientId";
    if (wx.getStorageSync(key)) {
      return wx.getStorageSync(key);
    } else {
      return null;
    }
  }


}


exports = module.exports = new ImKitStoreClass();