import { ErrorCode } from "../protocol/ProtocolErrorCode"


export namespace ProtocolRpcGate{
    
    export namespace IsLogin{
        export class Request{
            uid: number;
            token: string
        }
    
        export class Response{
            isLogin:boolean
        }
    }

   
}