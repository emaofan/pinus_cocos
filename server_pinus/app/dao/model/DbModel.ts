
/**
 * 存储在数据库中的数据结构——账号
 */
export class DbAccountInfo {
    public uid: number;
    public account: string;
    public password: string;
    public register_at: string
}

/**
 * 存储在数据库中的数据结构——账号
 */
 export class DbUserInfo {
    public uid: number;
    public nickname: string;
    public gender: number;
    public avatar: string;
    public gold:number
  
}