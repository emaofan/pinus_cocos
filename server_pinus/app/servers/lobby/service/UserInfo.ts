import { DbUserInfo } from "../../../dao/model/DbModel";






/**
 * 用户逻辑数据层
 */
export class UserInfo {
    public dbUser: DbUserInfo;      //在数据库的的数据结构
    public uid: number;             //user id
    public sid: number;            //session id 
    public isMatching = false;   //是否正在匹配中


    constructor(){

    }
}