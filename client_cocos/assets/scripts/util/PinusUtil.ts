const pinus: any = (window as any).pinus;

//打开或关闭日志
const isLog: boolean = true

export default class PinusUtil {

    /**
     * 与服务器创建一个长连接
     * @param host 地址
     * @param port 端口
     * @returns 
     */
    public static async init(host: string, port: number): Promise<void> {
        console.log(`pinus init, host =${host}, port=${port}`)

        pinus.on('disconnect', (reason) =>{
            console.log('pinus on disconnect',reason);
        });

        return new Promise<void>(resolve => {
            pinus.init({ host: host, port: port, log: true, user: {} },
                (data: any) => {
                    if (data) {
                        console.log(data)
                    }
                    console.log(`pinus init success! host =${host}, port=${port}`)
                    resolve();
                });
        });
    }


    /**
     * 向服务器发送一条req,同时返回resp
     * @param route 路由
     * @param req 请求消息，指定为泛型Treq
     * @returns 返回一个resp,指定为泛型Tresp
     */
    public static async call<Treq, Tresp>(route: string, req: Treq): Promise<Tresp> {
        if (isLog) {
            console.log("[---------------req---------------]\n[route]=" + route + "\n[data]=" + JSON.stringify(req));
        }
        return new Promise<Tresp>(resolve => {
            pinus.request(route, req, (respData: Tresp) => {
                if (isLog) {
                    console.log("[---------------resp---------------]\n[route]=" + route + "\n[data]=" + JSON.stringify(respData));
                }
                resolve(respData)
            });
        });
    }

    /**
     * 监听服务器push过来的消息
     * @param route 路由
     * @param callBack 回调方法
     */
    public static on(route: string, callBack: Function) {
        pinus.on(route, (data: any) => {
            if (isLog) {
                console.log("[route]=" + route + "\n[data]=" + JSON.stringify(data));
            }
            callBack(data)
        });
    }

    /**
     * 向服务器发送一条消息，但不需要服务器回应
     * @param route 路由
     * @param msg 消息
     */
    public static notify<Treq>(route: string, msg: Treq) {
        pinus.notify(route, msg)
    }

    /**
     * 与服务器主动断开连接
     */
    public static disconnect() {
        pinus.disconnect()
    }
}