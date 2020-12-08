import { Application, FrontendSession } from 'pinus';

export default function (app: Application) {
    return new ConnectHandler(app);
}

export class ConnectHandler {
    constructor(private app: Application) {

    }
    async login(msg: any, session: FrontendSession) {
        return { code: 200, msg: 'game server is ok.' };
    }


}