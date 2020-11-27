import { RedisLogger } from "../logger/RedisLogger";

export abstract class RedisAbsController{
    protected static mClient:any = null;
    protected static mRedlock:any = null;

    public static init(client,redlock){
        RedisAbsController.mClient = client;
        RedisAbsController.mRedlock = redlock;
    }

    /**
     * 设置键值超时时间
     * @param key 
     * @param ttl 秒
     */
    public static async expire(key:string|number,ttl:number):Promise<void>{
        try{
            this.mClient.expire(key,ttl);
        }catch(err){
            RedisLogger.error(err);
        }
    }

    /**
     * hash，添加或更新
     * @param name 
     * @param key 
     * @param value 
     */
    protected static async hset(name:string,key:string|number,value:any):Promise<any>{
        return new Promise( (resolve, reject) => {
            try {
                this.mClient.hset(name,key,JSON.stringify(value),(err, res) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(JSON.parse(res));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * hash，获取值
     * @param name 
     * @param key 
     */
    protected static async hget(name:string,key:string|number):Promise<any>{
        return new Promise( (resolve, reject) => {
            try {
                this.mClient.hget(name,key,(err, res) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(JSON.parse(res));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * hash，删除
     * @param name 
     * @param key 
     * @returns 返回删除数目
     */
    protected static async hdel(name:string,key:string|number):Promise<any>{
        return new Promise( (resolve, reject) => {
            try {
                this.mClient.hdel(name,key,(err, res) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(res);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * hash,key是否存在
     * @param name 
     * @param key 
     * @returns 返回存在数目
     */
    protected static async hexists(name:string,key:string|number):Promise<any>{
        return new Promise( (resolve, reject) => {
            try {
                this.mClient.hexists(name,key,(err, res) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(res);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * hash,获取所有key
     * @param name 
     * @returns 返回key列表
     */
    protected static async hkeys(name:string):Promise<any>{
        return new Promise( (resolve, reject) => {
            try {
                this.mClient.hkeys(name,(err, res) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(res);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    /**
     * 
     * @param name 
     */
    protected static async hvals(name:string):Promise<any>{
        return new Promise( (resolve, reject) => {
            try {
                this.mClient.hvals(name,(err, res) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(res);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}