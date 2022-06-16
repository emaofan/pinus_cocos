import { GateLogger } from "../logger/Logger";
import { GateToken } from "./GateToken";

export default class GateManager {
   public static init() {
      GateLogger.debug(">>>>>>>>>>>> GateManager 初始化 >>>>>>>>>>>>>>")
      //每30秒检查一次token是否过期
      setTimeout(() => GateToken.checkTokenExpire(), 30 * 1000)
   }
}
