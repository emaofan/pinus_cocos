import { ErrorCode } from "../protocol/ProtocolErrorCode"


export namespace ProtocolRpcLobby {

    export namespace JoinLobby {
        export class Request {
            uid: number
            sid: string
            token: string
        }

        export class Response {
            errCode: ErrorCode
            sid?: string            //如果已加入
        }
    }

    //把大厅玩家踢除
    export namespace Kick {
        export class Request {
            uid: number
            sid: number
        }

        export class Response {
            errCode: ErrorCode
        }
    }
}