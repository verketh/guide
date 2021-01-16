import DaoAbsController from "../DaoAbsController";
import { DaoExecute } from "../../module/DaoExecute";
import { DaoResult } from "../../module/DaoResult";
import { DbUserAccountInfo } from "../../module/user/DbUserAccountInfo";
import { DefDaoTable } from "../../../define/DefDaoTable";

export class DaoUserAccountInfo extends DaoAbsController{
    /**
     * 注册
     * @param arg 
     */
    public static async register(arg:DbUserAccountInfo):Promise<DaoResult<DbUserAccountInfo>>{
        return await this.execute(async (exe:DaoExecute):Promise<DaoResult<DbUserAccountInfo>>=>{
            let sql = exe.format('insert into %s(permission,robot,account,password,nickname,gender,head_url,login_date,login_ip,register_date,register_ip) '
                + 'values(?,?,?,?,?,?,?,?,?,?,?)',DefDaoTable.USER_ACCOUNT_INFO);
            let param = [arg.permission,arg.robot,arg.account,arg.password,arg.nickname,arg.gender,arg.head_url,arg.login_date,arg.login_ip,arg.register_date,arg.register_ip];
            let res = await exe.insert(sql,param);
            if(res.affectedRows<=0){
                return DaoResult.fail('注册失败');
            }
            sql = exe.format('select * from %s where uid=?',DefDaoTable.USER_ACCOUNT_INFO);
            param = [res.insertId];
            let user = await exe.select(sql,param);
            if(user.length <= 0){
                return DaoResult.fail('注册失败');
            }
            return DaoResult.succeed(user[0]);
        });
    }
    /**
     * 登录
     * @param account 
     * @param password 
     */
    public static async login(account:string,password:string):Promise<DaoResult<DbUserAccountInfo>>{
        return await this.execute(async (exe:DaoExecute):Promise<DaoResult<DbUserAccountInfo>>=>{
            let sql = exe.format('select * from %s where account=? and password=?',DefDaoTable.USER_ACCOUNT_INFO);
            let param = [account,password];
            let res = await exe.select(sql,param);
            if(res.length <= 0){
                return DaoResult.fail('账号或密码错误');
            }
            return DaoResult.succeed(res[0]);
        });
    }
    /**
     * 查询用户信息
     * @param uid 
     */
    public static async queryAccountInfo(uid:number):Promise<DaoResult<DbUserAccountInfo>>{
        return await this.execute(async (exe:DaoExecute):Promise<DaoResult<DbUserAccountInfo>>=>{
            let sql = exe.format('select * from %s where uid=? ',DefDaoTable.USER_ACCOUNT_INFO);
            let param = [uid];
            let res = await exe.select(sql,param);
            if(res.length <= 0){
                return DaoResult.fail('操作失败');
            }
            return DaoResult.succeed(res[0]);
        });
    }
    /**
     * 更新用户信息
     * @param uid 
     * @param data 
     */
    public static async updateAccountInfo(uid:number,data:{[key:string]:any}):Promise<DaoResult<boolean>>{
        return await this.execute(async (exe:DaoExecute):Promise<DaoResult<boolean>>=>{
            let sql = exe.format('update %s set ? where uid=?',DefDaoTable.USER_ACCOUNT_INFO);
            let param = [data,uid];
            let res = await exe.update(sql,param);
            if(res.affectedRows <= 0){
                return DaoResult.fail('操作失败');
            }
            return DaoResult.succeed(true);
        });
    }
}