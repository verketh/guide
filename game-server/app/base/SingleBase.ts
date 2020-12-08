export abstract class SingleBase{
    protected static mInstance:SingleBase = null;
    protected static instance<T extends SingleBase>(C:new() => T):T{
        if(this.mInstance === null){
            this.mInstance = new C();
        }
        return <T>this.mInstance;
    }

    public constructor(){
        if(SingleBase.mInstance !== null){
            throw '实例已创建，不允许再次创建';
        }
    }
}