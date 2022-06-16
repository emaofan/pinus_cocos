import { ErrorCode } from "./ProtocolErrorCode";

export namespace ProtocolGate {
    export namespace Login {
        export const Router = 'gate.Handler.OnLogin';
        export class Request {
            public account: string;
            public password: string;
        }
        export class Response {
            public errCode: ErrorCode;
            public uid: number;
            public host:string
            public port:number
            public token:string
        }
    }

    export namespace Register {
        export const Router = 'gate.Handler.OnRegister';
        export class Request {
            public account: string;
            public password: string;
        }
        export class Response {
            public errCode: ErrorCode;
            public uid: number;
            public account: string;
            public password: string;
        }
    }
}