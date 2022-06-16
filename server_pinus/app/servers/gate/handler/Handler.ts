import { Application, FrontendSession, Logger } from 'pinus';
import { DaoAccountInfo } from '../../../dao/controller/DaoAccountInfo';
import { ProtocolGate } from '../../../protocol/ProtocolGate';
import { plainToInstance } from 'class-transformer'
import { ErrorCode } from '../../../protocol/ProtocolErrorCode';
import { GateLogger } from '../logger/Logger';
import { RouterUtil } from '../../../utils/RouterUtil';
import { GateToken } from '../service/GateToken';

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    constructor(private app: Application) {
        this.app = app
    }

    public async OnRegister(msg: any, session: FrontendSession) {
        try {
            //step1:检查req格式，这里用到了'class-transformer'这个库，用于检测msg是否符合ProtocolGate.Register.Request这个class结构
            let req = plainToInstance(ProtocolGate.Register.Request, msg)
            if (req == null) {
                let resp = new ProtocolGate.Register.Response()
                resp.errCode = ErrorCode.REQ_ARGS_ERR
                return resp
            }

            GateLogger.debug("register req=" + JSON.stringify(req))
            //step2:保存数据
            let result = await DaoAccountInfo.register(req.account, req.password);
            if (result.code != ErrorCode.SUCCEED) {
                let resp = new ProtocolGate.Register.Response()
                resp.errCode = result.code
                return resp;
            }

            //step3:回复resp
            let resp = new ProtocolGate.Register.Response()
            resp.errCode = ErrorCode.SUCCEED
            resp.account = result.data.account
            resp.uid = result.data.uid
            resp.password = result.data.password
            return resp
        } catch (error) {
            GateLogger.error(error);
        }
    }

    public async OnLogin(msg: any, session: FrontendSession) {
        try {
            //step1:将msg转成"ProtocolGate.Login.Request"这个class对象
            let req = plainToInstance(ProtocolGate.Login.Request, msg)
            if (req == null) {
                let resp = new ProtocolGate.Login.Response()
                resp.errCode = ErrorCode.REQ_ARGS_ERR
                return resp
            }

            GateLogger.debug("OnLogin req=" + JSON.stringify(req))
            //step2:保存数据
            let result = await DaoAccountInfo.login(req.account, req.password);
            if (result.code != ErrorCode.SUCCEED) {
                let resp = new ProtocolGate.Login.Response()
                resp.errCode = result.code
                return resp;
            }

            //step3:gate分配conncector服务器
            let connectors = this.app.getServersByType("connector");
            if (!connectors || connectors.length === 0) {
                return {
                    code: 500
                };
            }

            let selectedConnector = RouterUtil.dispatch(result.data.account, connectors);
            let token = GateToken.GenToken(result.data.uid)

            //step4:回复resp
            let resp = new ProtocolGate.Login.Response()
            resp.errCode = ErrorCode.SUCCEED
            resp.uid = result.data.uid
            resp.port = selectedConnector.clientPort
            resp.host = selectedConnector.host
            resp.token = token
            return resp
        } catch (error) {
            GateLogger.error(error);
        }
    }
}


