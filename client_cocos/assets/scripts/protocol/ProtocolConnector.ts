import { ErrorCode } from "./ProtocolErrorCode";

export namespace ProtocolConnector {
    export namespace Auth {
        export const Router = 'connector.Handler.OnAuth';
        export class Request {
            public uid: number;
            public token: string;
        }

        export class Response {
            public errCode: ErrorCode;
        }
    }
}