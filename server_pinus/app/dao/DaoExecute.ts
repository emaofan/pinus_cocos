let util = require('util');

export interface DaoPack {
    fieldCount: number;
    affectedRows: number;       //影响的条数   
    insertId: number;           //插入mysql的id
    serverStatus: number;
    warningCount: number;
    message: string;            //消息
    protocol41: boolean;
    changedRows: number         //改变的条数
}

export class DaoExecute {
    private mPool: any = null;
    private mConn: any = null;
    private mIsTransaction: boolean = false;
    public constructor(pool: any) {
        this.mPool = pool;
    }

    public async startConnection(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.mPool == null) {
                reject('pool is null');
                return;
            }
            this.mPool.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    this.mConn = conn;
                    resolve(true);
                }
            });
        });
    }

    public isTransaction(): boolean {
        return this.mIsTransaction;
    }

    public async beginTransaction(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.mConn.beginTransaction((err) => {
                if (err) {
                    reject(err);
                } else {
                    this.mIsTransaction = true;
                    resolve(true);
                }
            });
        })
    }

    public async commit(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.mConn.commit((err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * 回滚
     * @returns 是否回滚成功
     */
    public async rollback(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.mConn.rollback((a, b) => {
                resolve(true);
            });
        });
    }

    public async stopConnection(): Promise<boolean> {
        if (this.mConn) {
            this.mConn.release();
            return true;
        }
        return false
    }

    protected async query(sql: string, params?: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mConn.query(sql, params || [], (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }

    public format(format: string, ...arg: any): string {
        return util.format(format, arg);
    }

    public async select(sql: string, params?: Array<any>): Promise<Array<any>> {
        return await this.query(sql, params);
    }
    public async update(sql: string, params?: Array<any>): Promise<DaoPack> {
        return await this.query(sql, params);
    }
    public async insert(sql: string, params?: Array<any>): Promise<DaoPack> {
        return await this.query(sql, params);
    }
    public async delete(sql: string, params?: Array<any>): Promise<DaoPack> {
        return await this.query(sql, params);
    }
}