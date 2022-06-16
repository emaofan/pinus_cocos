import moment = require("moment");
import { DaoExecute } from "../DaoExecute";
import { DbAccountInfo, DbUserInfo } from "../model/DbModel";
import { DaoTable } from "../../define/DaoTable";
import DaoManager from "../DaoManager";
import { ErrorCode } from "../../protocol/ProtocolErrorCode";

/**
* 定义一个register的db返回的数据结构
*/
interface dbRegisterResp { code: ErrorCode, data?: DbAccountInfo, }
interface dbLoginResp { code: ErrorCode, data?: DbAccountInfo, }


/**
 * account相关的db逻辑
 */
export class DaoAccountInfo {
    /**
    * 注册
    * @param account 
    * @param password 
    * @returns dbRegisterResp
    */
    public static async register(account: string, password: string): Promise<dbRegisterResp> {

        //step1:连接数据库
        let exe = new DaoExecute(DaoManager.mPool);
        let connect = await exe.startConnection();
        if (connect == false) {
            return {
                code: ErrorCode.DB_CON_ERR
            };
        }

        //step2:检测账号是否已存在
        let sql1 = `SELECT ACCOUNT FROM ${DaoTable.ACCOUNT_INFO} WHERE account=?`;
        let param1 = [account];
        let res1 = await exe.select(sql1, param1);
        if (res1.length > 0) {
            return {
                code: ErrorCode.ACCOUNT_EXIST
            };
        }

        //step3:将account信息保存到数据库
        let accountInfo: DbAccountInfo = new DbAccountInfo()
        accountInfo.account = account
        accountInfo.password = password
        accountInfo.register_at = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

        let sql2 = `INSERT INTO ${DaoTable.ACCOUNT_INFO}(account,password,register_at) VALUES(?,?,?)`;
        let param2 = [accountInfo.account, accountInfo.password, accountInfo.register_at];
        let res2 = await exe.insert(sql2, param2);
        if (res2.affectedRows <= 0) {
            return {
                code: ErrorCode.DB_SAVE_ERR
            };
        }
        //写入mysql后，由mysql自增的insertId作为用户的uid
        let uid = res2.insertId

        //step4:将用户信息单独列表，保存到userInfo里
        let userInfo: DbUserInfo = new DbUserInfo()
        userInfo.uid = uid
        userInfo.gender = 0
        userInfo.nickname = account
        userInfo.gold = 1000
        userInfo.avatar = `http://0.jpg`
        let sql3 = `INSERT INTO ${DaoTable.USER_INFO}(uid,gender,nickname,gold,avatar) VALUES(?,?,?,?,?)`;
        let param3 = [userInfo.uid, userInfo.gender, userInfo.nickname, userInfo.gold, userInfo.avatar];
        let res3 = await exe.insert(sql3, param3);
        if (res3.affectedRows <= 0) {
            return {
                code: ErrorCode.DB_SAVE_ERR
            };
        }

        //step4:获取账户完整信息
        let sql4 = `SELECT * FROM ${DaoTable.ACCOUNT_INFO} WHERE uid=?`
        let param4 = [uid];
        let res4 = await exe.select(sql4, param4);
        if (res4.length <= 0) {
            return {
                code: ErrorCode.DB_SAVE_ERR
            };
        }

        //step5:关闭数据库连接
        await exe.stopConnection();

        //step6:返回结果
        let dbResult = res4[0] as DbAccountInfo
        return {
            code: ErrorCode.SUCCEED,
            data: dbResult
        }
    }


    /**
     * 登录
     * @param account 
     * @param password 
     */
    public static async login(account: string, password: string): Promise<dbLoginResp> {
        //step1:连接数据库
        let exe = new DaoExecute(DaoManager.mPool);
        let connect = await exe.startConnection();
        if (connect == false) {
            return {
                code: ErrorCode.DB_CON_ERR
            };
        }

        //step2:检测账号，密码是否正确
        let sql = `SELECT * FROM ${DaoTable.ACCOUNT_INFO} WHERE account=? and password=?`;
        let param = [account, password];
        let res = await exe.select(sql, param);
        if (res.length < 0) {
            return {
                code: ErrorCode.ACCOUNT_OR_PASSWORD_ERROR
            };
        }

        //step3:关闭数据库连接
        await exe.stopConnection();

        //step4:返回结果
        let dbResult = res[0] as DbAccountInfo
        return {
            code: ErrorCode.SUCCEED,
            data: dbResult
        }
    }


   
}