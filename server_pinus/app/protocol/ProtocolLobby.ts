import { ErrorCode } from "./ProtocolErrorCode";

export namespace ProtocolLobby {
    export namespace GetUserInfo {
        export const Router = 'lobby.Handler.OnGetUserInfo';
        export class Request {

        }

        export class Response {
            public errCode: ErrorCode;
            public uid: number;
            public nickname: string;
            public gender: number;
            public avatar: string;
            public gold: number
        }
    }

    export namespace ChangeUserInfo {
        export const Router = 'lobby.Handler.OnChangeUserInfo';
        export class Request {
            public uid: number;
            public nickname?: string;
            public gender?: number;
            public avatar?: string;
            public gold?: number
        }

        export class Response {
            public errCode: ErrorCode;
        }
    }
}