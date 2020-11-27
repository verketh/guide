import { Application } from "pinus";
import { RedisLogger } from "./logger/RedisLogger";
import { RedisAbsController } from "./controller/RedisAbsController";
let redis = require('redis');
let Redlock = require('redlock');
export default class RedisManager{
    private mApp:Application = null;
    private mClient:any;
    private mRedlock:any;
    public constructor(app){
        this.init(app);
    }

    public init(app:Application){
        this.mApp = app;
        let redisConfig = app.get('redis');
        this.mClient = redis.createClient(redisConfig.port,redisConfig.host);

        this.mClient.on("error",this.onRedisError.bind(this))

        //清除数据
        if(this.mApp.isMaster()){
            this.mClient.flushall();
        }

        //创建Redis锁
        this.mRedlock = new Redlock(// you should have one client for each independent redis node
            // or cluster
            [this.mClient],
            {
                // the expected clock drift; for more details
                // see http://redis.io/topics/distlock
                driftFactor: 0.01, // time in ms
                // the max number of times Redlock will attempt
                // to lock a resource before erroring
                retryCount:  10,
                // the time in ms between attempts
                retryDelay:  200, // time in ms
                // the max time in ms randomly added to retries
                // to improve performance under high contention
                // see https://www.awsarchitectureblog.com/2015/03/backoff.html
                retryJitter:  200 // time in ms
            }
        );

        this.mRedlock.on('clientError', function(err) {
            RedisLogger.error('A redis error has occurred:', err);
        });

        RedisAbsController.init(this.mClient,this.mRedlock);
    }

    public onRedisError(error){
        RedisLogger.error(error);
    }
}