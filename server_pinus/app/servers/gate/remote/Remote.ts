import { Application, RemoterClass, FrontendSession } from 'pinus';
import { ProtocolRpcGate } from '../../../protocolRpc/ProtocolRpcGate';
import { GateToken } from '../service/GateToken';

export default function (app: Application) {
    return new Remote(app);
}

// UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        gate: {
            // 一次性定义一个类自动合并到UserRpc中
            Remote: RemoterClass<FrontendSession, Remote>;
        };
    }
}


export class Remote {
    constructor(private app: Application) {
        this.app = app
    }

   /**
    * 
    * @param req 
    * @returns 
    */
    public async isLogin(req: ProtocolRpcGate.IsLogin.Request): Promise<ProtocolRpcGate.IsLogin.Response> {
        let resp = new ProtocolRpcGate.IsLogin.Response();
        resp.isLogin = GateToken.checkToken(req.uid, req.token)
        return resp;
    }


}