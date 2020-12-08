import { DaoExecute } from "../module/DaoExecute";
import { DaoResult } from "../module/DaoResult";
import { DaoLogger } from "../logger/DaoLogger";

export default abstract class DaoAbsController {
    protected static mPool: any = null;

    public static init(pool) {
        this.mPool = pool;
    }

    public static async execute<T>(fun:(execute:DaoExecute)=>Promise<DaoResult<T>>):Promise<DaoResult<T>> {
        try {
            let exe = new DaoExecute(this.mPool);
            let connect = await exe.startConnection();
            if(connect == false){
                return DaoResult.fail<T>('get connection fail');
            }
            let result = await fun(exe);
            await exe.stopConnection();
            return result;
        } catch (error) {
            DaoLogger.error(error);
            return DaoResult.fail<T>('dao error',error);
        }
    }

    public static async executeTransaction<T>(fun:(execute:DaoExecute)=>Promise<DaoResult<T>>):Promise<DaoResult<T>> {
        let exe:DaoExecute = null;
        try {
            exe = new DaoExecute(this.mPool);
            let connect = await exe.startConnection();
            if(connect == false){
                return DaoResult.fail<T>('get connection fail');
            }
            let isOk = await exe.beginTransaction();
            if(isOk == false){
                return DaoResult.fail<T>('db Transaction fail');
            }
            let result = await fun(exe);
            isOk = false;
            if(result && result.isSucceed){
                isOk = await exe.commit();
            }
            if(!isOk){
                await exe.rollback();
            }
            await exe.stopConnection();
            return result;
        } catch (error) {
            if(exe && exe.isTransaction()){
                await exe.rollback();
            }
            DaoLogger.error(error);
            return DaoResult.fail<T>('dao error',error);
        }
    }
}