import { type } from 'os';
import { Application, RemoterClass, FrontendSession, ChannelService, Channel } from 'pinus';
import { ErrorCode } from '../../../protocol/ProtocolErrorCode';
import { ProtocolRpcLobby } from '../../../protocolRpc/ProtocolRpcLobby';

export default function (app: Application) {
    return new Remote(app);
}

// UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        lobby: {
            // 一次性定义一个类自动合并到UserRpc中
            Remote: RemoterClass<FrontendSession, Remote>;
        };
    }
}


export class Remote {
    constructor(private app: Application) {
        this.app = app
        this.channelService = app.get('channelService');
        this.lobbyChannel = this.channelService.getChannel('lobby', true)        //整个大厅是一个chanel，可以向全体成员发送广播，跑马灯这类消息
    }

    private channelService: ChannelService;
    private lobbyChannel: Channel

    /**
     *
     * @param req 定制的rpc协议：ProtocolRpcLobby.Request
     * @returns 定制的rpc协议： ProtocolRpcLobby.Response
     */
    public async joinLobby(req: ProtocolRpcLobby.JoinLobby.Request): Promise<ProtocolRpcLobby.JoinLobby.Response> {

        //从channel中获取玩家
        let member = this.lobbyChannel.getMember(req.uid.toString());

        //如果玩家存在，且userInfo的sid也存在，说明玩家已在别处登录过了
        if (member && member.sid) {

            // let session=this.app.get("sessionService").get(Number(member.sid));
            // session.closed("xxxxxxxxxxxxxxxxx");
                
            // this.lobbyChannel.apushMessage("onKick","您的账号已在别处登录")

            let rpcResp = new ProtocolRpcLobby.JoinLobby.Response();
            rpcResp.errCode = ErrorCode.ACCOUNT_ALREADY_LOGIN;
            rpcResp.sid = member.sid;
            return rpcResp
        }

        //将玩家加入lobby channel
        this.lobbyChannel.add(req.uid.toString(), req.sid);
        let rpcResp = new ProtocolRpcLobby.JoinLobby.Response();
        rpcResp.errCode = ErrorCode.SUCCEED;
        return rpcResp
    }

    public async kick(uid: string, serverId: string) {
        let channel = this.channelService.getChannel('lobby', false)

        if (!!channel) {
            channel.leave(uid, serverId);
        }
    }
}