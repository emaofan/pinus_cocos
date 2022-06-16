import { Application, ServerInfo, Session } from "pinus";
import * as crc from 'crc';

export class RouterUtil {

    /**
     * 通过一致性算法，将account匹配一个的服务器
     * @param account 账户名
     * @param servers 某个类型的服务器
     * @returns 指定的为哪一个服务器
     */
    public static dispatch(account: string, servers: ServerInfo[]): ServerInfo {
        let index = Math.abs(crc.crc32(account)) % servers.length;
        return servers[index];
    }
}