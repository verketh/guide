import { Application, ChannelService, FrontendSession } from "pinus";
import { SingleBase } from "../../../base/SingleBase";
import { DaoUserAccountInfo } from "../../../dao/controller/user/DaoUserAccountInfo";
import { DbUserAccountInfo } from "../../../dao/module/user/DbUserAccountInfo";
import { AppProtocol } from "../../../protocol/AppProtocol";
import { ProConnect } from "../../../protocol/ProConnect";

export default class ConnectVerifyController extends SingleBase{
    private mApp:Application = null;
    private mChannelService:ChannelService = null;

    public static getInstance():ConnectVerifyController{
        return this.instance(ConnectVerifyController);
    }

    public setApplication(app:Application){
        this.mApp = app;
        this.mChannelService = app.get('channelService');
    }

    public async onLogin(session:FrontendSession,req:ProConnect.Login.Request):Promise<ProConnect.Login.Result>{
        let dbResult = await DaoUserAccountInfo.login(req.account,req.password);
        if(dbResult.isSucceed == false){
            return AppProtocol.result(ProConnect.Login.Result,false,dbResult.describe);
        }
        let res = AppProtocol.result(ProConnect.Login.Result,true);
        AppProtocol.copy(res,dbResult.data);
        return AppProtocol.result(ProConnect.Login.Result,true);
    }

    public async onRegister(session:FrontendSession,req:ProConnect.Register.Request):Promise<ProConnect.Register.Result>{
        let data = new DbUserAccountInfo;
        data.account = req.account;
        data.password = req.password;
        data.nickname = req.nickname;
        data.gender = req.gender;
        data.head_url = req.head_url;
        let dbResult = await DaoUserAccountInfo.register(data);
        if(dbResult.isSucceed == false){
            return AppProtocol.result(ProConnect.Register.Result,false,dbResult.describe);
        }
        let res = AppProtocol.result(ProConnect.Register.Result,true);
        AppProtocol.copy(res,dbResult.data);
        return AppProtocol.result(ProConnect.Register.Result,true);
    }
}