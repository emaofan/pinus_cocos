import { pinus } from 'pinus';
import { preload } from './preload';
import _pinus = require('pinus');
// import RedisManager from './app/redis/RedisManager';
import DaoManager from './app/dao/DaoManager';
import "reflect-metadata"
import GateManager from './app/servers/gate/service/GateManager';
const filePath = (_pinus as any).FILEPATH;
filePath.MASTER = '/config/master';
filePath.SERVER = '/config/servers';
filePath.CRON = '/config/crons';
filePath.LOG = '/config/log4js';
// filePath.SERVER_PROTOS = '/config/serverProtos';
// filePath.CLIENT_PROTOS = '/config/clientProtos';
filePath.MASTER_HA = '/config/masterha';
filePath.LIFECYCLE = '/lifecycle';
filePath.SERVER_DIR = '/app/servers/';
filePath.CONFIG_DIR = '/config';

const adminfilePath = _pinus.DEFAULT_ADMIN_PATH;
adminfilePath.ADMIN_FILENAME = 'adminUser';
adminfilePath.ADMIN_USER = 'config/adminUser';
/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
let app = pinus.createApp();
app.set('name', 'pinus_cc');

//redis配置
// app.loadConfig('redis',app.getBase() + '/config/redis');

//mysql配置
app.loadConfig('mysql', app.getBase() + '/config/mysql')

app.configure('production|development','all', () => {
    DaoManager.init(app);
    switch (app.serverType) {
        case 'gate':
            GateManager.init()
            app.set('connectorConfig',
                {
                    connector: pinus.connectors.hybridconnector,
                });
            break
        case 'connector':
            app.set('connectorConfig',
                {
                    connector: pinus.connectors.hybridconnector,
                    heartbeat: 3,
                    useDict: true,
                    useProtobuf: true
                });
            break
        default:
            break;
    }
});

app.start();

