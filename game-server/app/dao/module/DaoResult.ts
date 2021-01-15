
export class DaoResult<T>{
    public isSucceed:boolean = false;
    public data:T = null;
    public describe:string = '';
    public error:any = null;
    public static succeed<T>(result:T):DaoResult<T>{
        let obj = new DaoResult<T>();
        obj.isSucceed = true;
        obj.data = result;
        return obj;
    }
    public static fail<T>(describe:string,err?:any):DaoResult<T>{
        let obj = new DaoResult<T>();
        obj.isSucceed = false;
        obj.describe = describe;
        obj.error = err;
        return obj;
    }
}