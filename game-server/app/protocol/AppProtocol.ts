

/**
 * 请求结果返回码
 */
export enum ProResultCode {
    CODE_NULL       = 0,        //未定义
    CODE_SUCCEED    = 200,      //请求成功
    CODE_FAIL       = 500,      //请求失败
}

/**
 * 初始化接口
 */
export interface IProInitializer {
    /**
     * 子类必须实现该方法对所有类成员变量初始化
     * number初始化为0
     * string初始化为''
     * T 初始化为new T  (T为对象)
     * Array 初始化为 [new T] (T为对象或基本数据类型)
     */
    initialization():void;
}

/**
 * 所有请求数据的基类
 */
export abstract class ProRequest implements IProInitializer {
    constructor() {
        this.initialization();
    }
    /**
     * 子类必须实现该方法对所有类成员变量初始化
     * number初始化为0
     * string初始化为''
     * T 初始化为new T  (T为对象)
     * Array 初始化为 [new T] (T为对象或基本数据类型)
     */
    public abstract initialization():void;
}
/**
 * 所有请求结果的基类
 */
export abstract class ProResult implements IProInitializer {
    public code: ProResultCode = ProResultCode.CODE_NULL;
    public describe: string = '';
    constructor() {
        this.initialization();
    }
    /**
     * 子类必须实现该方法对所有类成员变量初始化
     * number初始化为0,
     * string初始化为'',
     * T 初始化为new T  (T为对象),
     * Array 初始化为 [new T] (T为对象或基本数据类型),
     */
    public abstract initialization():void;
}

export class AppProtocol {
    /**
     * 构造请求结果
     * @param C 
     * @param sussced 
     * @param des 
     */
    public static result<T extends ProResult>(C: new () => T, sussced: boolean, des?: string): T {
        let res = new C;
        res.code = sussced ? ProResultCode.CODE_SUCCEED : ProResultCode.CODE_FAIL;
        if (des !== undefined) {
            res.describe = des;
        }
        return res;
    }
    /**
     * 构造请求
     * @param C 
     */
    public static request<T extends ProRequest>(C: new () => T): T {
        return new C;
    }

    /**
     * 将客户端发来的消息转换为对应的对象
     * @param arg 转换的对象
     * @param msg 消息对象
     */
    public static convert<T>(arg:T, msg: any): T {
        if (typeof arg !== 'object') return null;
        if (typeof msg !== 'object') return null;
        if (Array.isArray(arg)) {
            let arry = this.copyArray(arg,msg);
            if(arry == null) return null;
            arg = <any>arry;
            return arg;
        }
        for (let name in arg) {
            if (msg.hasOwnProperty(name)) {
                //属性成员是否是数组
                if (Array.isArray(arg[name])) {
                    let arry = this.copyArray(arg[name],msg[name])
                    if(arry == null) return null;
                    arg[name] = <any>arry;
                    //属性成员是否是object
                } else if (typeof arg[name] === 'object') {
                    arg[name] = this.convert(arg[name], msg[name]);
                    if (arg[name] === null) return null;//转换对象失败
                } else {
                    if (typeof arg[name] !== typeof msg[name]) return null;//数据类型校验
                    arg[name] = msg[name];
                }
            }
            //客户端消息缺少属性
            else if (!(arg[name] instanceof Function)) {
                return null;
            }
        }
        return arg;
    }

    protected static copyArray(arg, msg) {
        if (Array.isArray(msg) === false) return null;//客户端数据不是数组
        let argArry = <Array<any>>(<any>arg);
        let msgArry = <Array<any>>msg;
        if (argArry.length <= 0) return null;//数组定义必须初始化添加一个元素
        let arry = [];
        if (typeof argArry[0] == 'object') {
            for (let i = 0; i < msgArry.length; i++) {
                let item = this.clone(argArry[0]);
                item = this.convert(item, msgArry[i]);
                if (item === null) return null;//转换对象失败
                arry.push(item);
            }
        } else {
            for (let i = 0; i < msgArry.length; i++) {
                if (typeof argArry[0] !== typeof msgArry[i]) return null;//数据类型校验
                arry.push(msgArry[i]);
            }
        }
        return arry;
    }

    protected static clone(obj: any) {
        if (typeof obj !== 'object') throw "克隆必须是对象";
        let temp = null;
        if (obj instanceof Array) {
            temp = obj.concat();
        } else if (obj instanceof Function) {
            //函数是共享的是无所谓的，js也没有什么办法可以在定义后再修改函数内容
            temp = obj;
        } else {
            temp = new Object();
            for (let item in obj) {
                let val = obj[item];
                temp[item] = typeof val == 'object' ? this.clone(val) : val; //这里也没有判断是否为函数，因为对于函数，我们将它和一般值一样处理
            }
        }
        return temp;
    }
    /**
     * 将source和dest相同的字段复制给dest
     * @param dest 
     * @param source 
     */
    public static copy(dest:object,source:object){
        for (const key in dest) {
            if (source.hasOwnProperty(key)) {
                dest[key] = source[key];
            }
        }
    }
}