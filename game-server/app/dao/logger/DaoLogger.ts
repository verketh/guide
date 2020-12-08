import { getLogger } from 'pinus-logger';
import * as path from 'path';
let logger = getLogger('dao', path.basename(__filename));

export class DaoLogger{
    
    public static trace(message: any, ...args: any[]): void{
        logger.trace(message,args);
    }

	public static debug(message: any, ...args: any[]): void{
        logger.debug(message,args);
    }

	public static info(message: any, ...args: any[]): void{
        logger.info(message,args);
    }

	public static warn(message: any, ...args: any[]): void{
        logger.warn(message,args);
    }

	public static error(message: any, ...args: any[]): void{
        logger.error(message,args);
    }

	public static fatal(message: any, ...args: any[]): void{
        logger.fatal(message,args);
    }
}