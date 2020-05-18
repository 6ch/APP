/**
 * Author: Sabertor
 * Description: 闭包+单例模式 保证全局获取同一个对象
 * Data: Create in 14:33 2020/3/18
 */
import ImKit from "../lib/imKit/index.js";

const ImKitUtil = (function () {
  let instance;
  let imKitUtil = function () {
    this.imkit = new Map();

    this.getImKit = (appId) => {
      const instance = this.imkit.get(appId);
      if (!instance) {
        const userInfo = {
          userName: "客服12312",
          userId: "kefu12312",
          icon: "https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg",
          sign: "user"
        }
        const imKit = new ImKit();
        imKit.init(userInfo, { appId: appId });
        this.imkit.set(appId, imKit);
      }
      return this.imkit.get(appId);
    };

  };

  return {
    getInstance: function () {
      if (!instance) {
        instance = new imKitUtil();
      }
      return instance;
    }
  }
})();

exports = module.exports = ImKitUtil;