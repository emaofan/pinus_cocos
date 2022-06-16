import { game } from "cc"
import EventBus from "../define/EventBus"
import { Session } from "../login/LoginModel"
import { ErrorCode, ErrorCode2Str } from "../protocol/ProtocolErrorCode"
import { ProtocolLobby } from "../protocol/ProtocolLobby"
import PinusUtil from "../util/PinusUtil"

export class LobbyController {



    /**
     * 一进入大厅模块，先获取玩家信息，再刷新玩家信息显示
     */
    public static Start() {
        this.GetUserInfo();

        PinusUtil.on("kick",null)
    }

    /**
     * 获取玩家信息
     */
    private static async GetUserInfo() {
        let req = new ProtocolLobby.GetUserInfo.Request()
        let resp = await PinusUtil.call<ProtocolLobby.GetUserInfo.Request, ProtocolLobby.GetUserInfo.Response>(ProtocolLobby.GetUserInfo.Router, req)

        console.log(ErrorCode2Str(resp.errCode))
        if (resp.errCode != ErrorCode.SUCCEED) {
            return
        }
        Session.userInfo.avator = resp.avatar
        Session.userInfo.nickName = resp.nickname
        Session.userInfo.gold = resp.gold
        Session.userInfo.uid = resp.uid

        EventBus.eventTarget.dispatchEvent(new Event("LobbyView.refreshUserInfo"))
    }

    /**
     * 修改玩家nickname
     * @param nickName 要修改的nickname
     * @returns 
     */
    public static async ChangeNickName(nickName: string) {
        let req = new ProtocolLobby.ChangeUserInfo.Request()
        req.nickname = nickName
        let resp = await PinusUtil.call<ProtocolLobby.ChangeUserInfo.Request, ProtocolLobby.ChangeUserInfo.Response>(ProtocolLobby.ChangeUserInfo.Router, req)
        if (resp.errCode != ErrorCode.SUCCEED) {
            console.log(ErrorCode2Str(resp.errCode))
            return
        }
        Session.userInfo.nickName = nickName

        //这里最好作事件监听
        game.emit("LobbyView.refreshNickName")
    }



}