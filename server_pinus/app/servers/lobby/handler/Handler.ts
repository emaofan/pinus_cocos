import { Application, BackendSession, ChannelService, FrontendSession } from 'pinus';
import { plainToInstance } from 'class-transformer'
import { ErrorCode } from '../../../protocol/ProtocolErrorCode';
import { ProtocolLobby } from '../../../protocol/ProtocolLobby';
import { DaoUserInfo } from '../../../dao/controller/DaoUserInfo';
import { DbUserInfo } from '../../../dao/model/DbModel';

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    constructor(private app: Application) {
        this.app = app
        
    }

    


    /**
     * 客户端请求修改用户昵称
     * @param msg 
     * @param session 
     * @returns 
     */
    public async OnChangeUserInfo(msg: any, session: BackendSession) {
        //step1:检查req格式，这里用到了'class-transformer'这个库，用于检测msg是否符合ProtocolGate.Register.Request这个class结构
        let req = plainToInstance(ProtocolLobby.ChangeUserInfo.Request, msg)
        if (req == null) {
            let resp = new ProtocolLobby.ChangeUserInfo.Response()
            resp.errCode = ErrorCode.REQ_ARGS_ERR
            return resp
        }

        //step2:更据用户传过来的数据，组织要更新的数据
        let uid = Number(session.uid)
        let changeUserInfo = new DbUserInfo();
        changeUserInfo.uid = uid;
        if (req.nickname) {
            changeUserInfo.nickname = req.nickname
        }
        if (req.avatar) {
            changeUserInfo.avatar = req.avatar
        }
        if (req.gender) {
            changeUserInfo.gender = req.gender
        }

        //step3:更新数据库，回复结果
        let result = await DaoUserInfo.updateUserInfo(changeUserInfo)
        if (result.code != ErrorCode.SUCCEED) {
            let resp = new ProtocolLobby.GetUserInfo.Response()
            resp.errCode = result.code
            return
        }

        let resp = new ProtocolLobby.ChangeUserInfo.Response()
        resp.errCode = ErrorCode.SUCCEED
        return resp
    }

    public async OnGetUserInfo(msg: any, session: BackendSession) {
        let uid = Number(session.uid)
        let result = await DaoUserInfo.getUserInfo(uid)
        if (result.code != ErrorCode.SUCCEED) {
            let resp = new ProtocolLobby.GetUserInfo.Response()
            resp.errCode = result.code
            return
        }

        let resp = new ProtocolLobby.GetUserInfo.Response()
        resp.errCode = ErrorCode.SUCCEED
        resp.avatar = result.data.avatar
        resp.gender = result.data.gender
        resp.gold = result.data.gold
        resp.nickname = result.data.nickname
        resp.uid = result.data.uid
        return resp
    }

}


