import moment = require("moment");
import { DaoExecute } from "../DaoExecute";
import { DbUserInfo } from "../model/DbModel";
import { DaoTable } from "../../define/DaoTable";
import DaoManager from "../DaoManager";
import { ErrorCode } from "../../protocol/ProtocolErrorCode";
import { DaoLogger } from "../logger/DaoLogger";

interface dbGetUserInfoResp { code: ErrorCode, data?: DbUserInfo }
interface dbGetUserInfoResp { code: ErrorCode }

export class DaoUserInfo {

    /**
   * 获取用户个人信息
   * @param uid 用户uid
   */
    public static async getUserInfo(uid: number): Promise<dbGetUserInfoResp> {
        //step1:连接数据库
        let exe = new DaoExecute(DaoManager.mPool);
        let connect = await exe.startConnection();
        if (connect == false) {
            return {
                code: ErrorCode.DB_CON_ERR
            };
        }

        //step2:查看用户数据
        let sql = `SELECT * FROM ${DaoTable.USER_INFO} WHERE uid=?`
        let param = [uid];
        let res = await exe.select(sql, param);
        if (res.length <= 0) {
            return {
                code: ErrorCode.USER_UN_EXIST
            };
        }

        //step3:关闭数据库连接
        await exe.stopConnection();

        //step4:返回结果
        let dbResult = res[0] as DbUserInfo
        return {
            code: ErrorCode.SUCCEED,
            data: dbResult
        }
    }

    /**
     * 更新用户数据
     * @param target 
     * @returns 
     */
    public static async updateUserInfo(target: DbUserInfo): Promise<dbGetUserInfoResp> {
        //step1:连接数据库
        let exe = new DaoExecute(DaoManager.mPool);
        let connect = await exe.startConnection();
        if (connect == false) {
            return {
                code: ErrorCode.DB_CON_ERR
            };
        }

        //step2:查看用户数据是否存在，不存在不能更新
        let sql1 = `SELECT * FROM ${DaoTable.USER_INFO} WHERE uid=?`
        let param1 = [target.uid];
        let res1 = await exe.select(sql1, param1);
        if (res1.length <= 0) {
            return {
                code: ErrorCode.USER_UN_EXIST
            };
        }

        //step3:判断传入的值是否存在，如果存在且不同就替换
        let dbUserInfo = res1[0] as DbUserInfo
        if (target.nickname && target.nickname != dbUserInfo.nickname) {
            dbUserInfo.nickname = target.nickname;
        }
        if (target.gender && target.gender != dbUserInfo.gender) {
            dbUserInfo.gender = target.gender;
        }
        if (target.avatar && target.avatar != dbUserInfo.avatar) {
            dbUserInfo.avatar = target.avatar;
        }

        //step4:更新到数据库中
        let sql2 = `UPDATE ${DaoTable.USER_INFO} Set nickName = ?, gender = ?, avatar = ? WHERE uid = ?`
        let param2 = [dbUserInfo.nickname, dbUserInfo.gender, dbUserInfo.avatar, dbUserInfo.uid];
        let res2 = await exe.update(sql2, param2);
        if (res2.affectedRows <= 0) {
            return {
                code: ErrorCode.CHANGE_USER_INFO_ERR
            };
        }

        //step3:关闭数据库连接
        await exe.stopConnection();

        return {
            code: ErrorCode.SUCCEED,
        }
    }
}