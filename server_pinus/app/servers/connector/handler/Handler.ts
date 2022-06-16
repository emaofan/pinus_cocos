import { Application, FrontendSession, SID, UID } from 'pinus';
import { ProtocolConnector } from '../../../protocol/ProtocolConnector';
import { ConnectLogger } from '../logger/ConnectLogger';
import { plainToInstance } from 'class-transformer'
import { ErrorCode } from '../../../protocol/ProtocolErrorCode';
import { ProtocolRpcLobby } from '../../../protocolRpc/ProtocolRpcLobby';
import { ProtocolRpcGate } from '../../../protocolRpc/ProtocolRpcGate';
import { Session } from 'inspector';


export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    constructor(private app: Application) {
        this.app = app
    }

    /**
     * 验证权限，由于登录是在gate服务器上完成的，这里需要验证一下是否登录过
     * @param msg 
     * @param session 
     * @returns 
     */
    public async OnAuth(msg: any, session: FrontendSession) {
        let req = plainToInstance(ProtocolConnector.Auth.Request, msg)
        if (req == null) {
            let resp = new ProtocolConnector.Auth.Response()
            resp.errCode = ErrorCode.REQ_ARGS_ERR
            return resp
        }
        let sessionService = this.app.get("sessionService");

        //step1:向gate服务器发送一条rpc消息，检查是否登录过
        let rpcIsLoginReq = new ProtocolRpcGate.IsLogin.Request();
        rpcIsLoginReq.uid = req.uid
        rpcIsLoginReq.token = req.token
        let rpcIsLoginResp = await this.app.rpc.gate.Remote.isLogin.route(session)(rpcIsLoginReq) as ProtocolRpcGate.IsLogin.Response

        if (rpcIsLoginResp.isLogin == false) {
            let resp = new ProtocolConnector.Auth.Response()
            resp.errCode = ErrorCode.AUTH_ERR
            //token错误，服务器断开连接,这里可以先踢人再返回resp的原因是，该方法会在下一个tick执行
            sessionService.kickBySessionId(session.id);
            return resp
        }

        //step3:rpc通知lobby服务器，有玩家进入游戏大厅了
        let rpcReq = new ProtocolRpcLobby.JoinLobby.Request();
        rpcReq.uid = req.uid;
        rpcReq.sid = session.id.toString();
        rpcReq.token = req.token;

        ConnectLogger.debug("rpcReq sid id=", rpcReq.sid)

        let rpcResonse = await this.app.rpc.lobby.Remote.joinLobby.route(session)(rpcReq) as ProtocolRpcLobby.JoinLobby.Response
        if (rpcResonse.errCode == ErrorCode.ACCOUNT_ALREADY_LOGIN) {
            let resp = new ProtocolConnector.Auth.Response()
            resp.errCode = rpcResonse.errCode
            ConnectLogger.debug("error!  rpcResonse sid=", rpcResonse.sid)

            //此时，uid对应的session是上一个session，将那个session踢下线
            await sessionService.akick(req.uid.toString(), '您的账户在另一端登录');
        }

        //然后再重新绑定uid，此时uid和新的session建立对应关系
        await session.abind(req.uid.toString());
        //将session推送出去
        await session.apushAll();
        //监听关闭事件
        session.on('closed', ()=>this.onSessionClose({}, session));

        if (!sessionService.getByUid(req.uid.toString())) {
            session.bind(req.uid.toString(), (err: Error, result) => {
                if (err) {
                    ConnectLogger.info("session bind  uid error: ", err.stack);
                    return
                }
                ConnectLogger.info("session bind uid success!");
            });
            session.on("closed", (session: FrontendSession) => {
                //玩家断开连接事件
                ConnectLogger.debug(`玩家断开连接,uid= ${session.uid}`)
            });
        }

        let resp = new ProtocolConnector.Auth.Response()
        resp.errCode = rpcResonse.errCode
        return resp
    }


    //玩家断开服务器事件
    private async onSessionClose (msg: any, session: FrontendSession) {

   
    }

}


