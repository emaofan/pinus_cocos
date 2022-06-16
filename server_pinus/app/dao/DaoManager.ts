import { Application } from "pinus";
var mysql = require('mysql');

export default class DaoManager {
    public static mPool: any
    public static init(app: Application) {
        let mysqlConfig = app.get('mysql');
        DaoManager.mPool = mysql.createPool({
            host: mysqlConfig.host,
            user: mysqlConfig.user,
            password: mysqlConfig.password,
            database: mysqlConfig.database,
            port: mysqlConfig.port || '3306',
            charset: 'utf8mb4',
        });
    }
}
