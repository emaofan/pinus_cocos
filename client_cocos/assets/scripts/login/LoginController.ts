import { ProtocolConnector } from "../protocol/ProtocolConnector";
import { ErrorCode, ErrorCode2Str } from "../protocol/ProtocolErrorCode";
import { ProtocolGate } from "../protocol/ProtocolGate";
import PinusUtil from "../util/PinusUtil";
import { Session } from "./LoginModel";

export class LoginController {

    /**
     * 连接gate服务器
     */
    public static Start() {
        PinusUtil.init('127.0.0.1', 3100)
    }

    /**
     * 注册
     * @param account 
     * @param password 
     * @returns 
     */
    public static async OnRegister(account: string, password: string) {
        let req = new ProtocolGate.Register.Request()
        req.account = account
        req.password = password
        let resp = await PinusUtil.call<ProtocolGate.Register.Request, ProtocolGate.Register.Response>(ProtocolGate.Register.Router, req)
        if (resp.errCode != ErrorCode.SUCCEED) {
            console.log(ErrorCode2Str(resp.errCode))
            return
        }
        Session.account.account = account
        Session.account.password = password
    }

    /**
     * 登录
     * @param account 
     * @param password 
     * @returns 
     */
    public static async OnLogin(account: string, password: string) {
        let req: ProtocolGate.Login.Request = new ProtocolGate.Login.Request();
        req.account = account
        req.password = password
        let resp = await PinusUtil.call<ProtocolGate.Login.Request, ProtocolGate.Login.Response>(ProtocolGate.Login.Router, req)
        if (resp.errCode != ErrorCode.SUCCEED) {
            console.log(ErrorCode2Str(resp.errCode))
            return
        }
        Session.account.uid = resp.uid
        Session.account.token = resp.token
        Session.host = resp.host
        Session.port = resp.port
    }


    /**
     * 断开gate服务器，转而连接connector服务器，连接需要检测登录的授权码
     * @param account 
     * @param password 
     * @returns 
     */
    public static async OnConnectorAuth() {
        //先与gate服务器断开连接
        PinusUtil.disconnect()
        //再与connector服务器连接
        await PinusUtil.init(Session.host, Session.port)
        //创建req
        let req: ProtocolConnector.Auth.Request = new ProtocolConnector.Auth.Request()
        req.token = Session.account.token
        req.uid = Session.account.uid
        //进行登录验证
        let resp = await PinusUtil.call<ProtocolConnector.Auth.Request, ProtocolConnector.Auth.Response>(ProtocolConnector.Auth.Router, req)
        if (resp.errCode != ErrorCode.SUCCEED) {
            console.log(ErrorCode2Str(resp.errCode))
            return
        }
    }

    
}