export enum ErrorCode {
    FAIL,
    SUCCEED,
    REQ_ARGS_ERR,
    ACCOUNT_EXIST,
    DB_CON_ERR,
    DB_SAVE_ERR,
    USER_UN_EXIST,
    ACCOUNT_OR_PASSWORD_ERROR,
    ACCOUNT_ALREADY_LOGIN,
    AUTH_ERR,
    CHANGE_USER_INFO_ERR,
}

export let ErrorCode2Str = (errCode: ErrorCode) => {
    switch (errCode) {
        case ErrorCode.FAIL:
            return "失败"
        case ErrorCode.SUCCEED:
            return "成功"
        case ErrorCode.REQ_ARGS_ERR:
            return "请求参数格式错误"
        case ErrorCode.ACCOUNT_EXIST:
            return "账号已存在"
        case ErrorCode.DB_CON_ERR:
            return "连接数据库失败"
        case ErrorCode.DB_SAVE_ERR:
            return "保存数据失败"
        case ErrorCode.USER_UN_EXIST:
            return "用户不存在"
        case ErrorCode.ACCOUNT_OR_PASSWORD_ERROR:
            return "账号不存在或密码错误"
        case ErrorCode.ACCOUNT_ALREADY_LOGIN:
            return "账号已在别处登录"
        case ErrorCode.AUTH_ERR:
            return "账号未登录"
        case ErrorCode.CHANGE_USER_INFO_ERR:
            return "保存玩家信息失败"
        default:
            return "未知错误"
    }
}