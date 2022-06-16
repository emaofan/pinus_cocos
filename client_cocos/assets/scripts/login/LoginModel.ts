import { E_Sex } from "../define/Enum"


export class LoginModel {
    public account: AccountData;
    public userInfo: UserData;
    public host:string
    public port:number
    constructor() {
        this.account = new AccountData()
        this.userInfo = new UserData()
    }
}

export class AccountData {
    public account: string
    public password: string
    public uid: number
    public token: string
}

export class UserData {
    public uid: number
    public gold: number
    public avator: string
    public nickName: string
    public sex: E_Sex
}


//给LoignModel起个别名，session表示连接
export let Session = new LoginModel()