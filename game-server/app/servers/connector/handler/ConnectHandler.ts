import { Application, FrontendSession } from 'pinus';
import { DefServerType } from '../../../define/DefServerType';
import { AppProtocol } from '../../../protocol/AppProtocol';
import { ProConnect } from '../../../protocol/ProConnect';
import ConnectVerifyController from '../controller/ConnectVerifyController';
import { ConnectLogger } from '../logger/ConnectLogger';

export default function (app: Application) {
    return new ConnectHandler(app);
}

export class ConnectHandler {
    constructor(private app: Application) {
        if(app.getServerType() == DefServerType.CONNECTOR){
            ConnectVerifyController.getInstance().setApplication(app);
        }
    }
    async onLogin(msg: any, session: FrontendSession) {
        try {
            let req = AppProtocol.convert(new ProConnect.Login.Request,msg);
            if(req == null){
                return AppProtocol.result(ProConnect.Login.Result,false,'请求参数错误');
            }
            return await ConnectVerifyController.getInstance().onLogin(session,req);
        } catch (error) {
            ConnectLogger.error(error);
        }
        return AppProtocol.result(ProConnect.Login.Result,false,'请求失败');
    }

    async onRegister(msg: any, session: FrontendSession) {
        try {
            let req = AppProtocol.convert(new ProConnect.Register.Request,msg);
            if(req == null){
                return AppProtocol.result(ProConnect.Register.Result,false,'请求参数错误');
            }
            return await ConnectVerifyController.getInstance().onRegister(session,req);
        } catch (error) {
            ConnectLogger.error(error);
        }
        return AppProtocol.result(ProConnect.Register.Result,false,'请求失败');
    }


}