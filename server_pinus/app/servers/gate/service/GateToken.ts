import { CryptoUtil } from "../../../utils/CryptoUtil";


export class GateToken {

    private static mapToken: Map<number, { token: string, time: number }> = new Map<number, { token: string, time: number }>();

    /**
     * 
     * @param uid 为uid当前的用户生成一个token
     * @returns 
     */
    public static GenToken(uid: number): string {
        //生成一个字符串
        let key = "" + uid + "_" + Date.now().valueOf() + Math.floor(Math.random() * 10000000000)
        //将字符串md5，生成一个token
        let token = CryptoUtil.md5(key);
        //保存到map中
        this.mapToken.set(uid, {
            token: token,                               //token，一定时间后会失效；如果用户登录了，长时间不进游戏，再连服务器是连不上的
            time: Date.now() + 1 * 60 * 1000,           //过期时间 = 当前时间 + 60秒
        })
        return token;
    }

    /**
     * 检查用户token是否正确
     * @param uid uid
     * @param token token
     * @returns 
     */
    public static checkToken(uid: number, token: string): boolean {
        let tokenInfo = this.mapToken.get(uid);
        if (!tokenInfo) {
            return false;
        }
        if (tokenInfo.token !== token) {
            return false;
        }
        this.mapToken.delete(uid);
        return true;
    }

    /**
     * 检测token是否过期，如果有token过期了，删除
     */
    public static checkTokenExpire() {
        let now = Date.now();
        this.mapToken.forEach((v, k) => {
            if (now > v.time) {
                this.mapToken.delete(k)
            }
        })
    }


}