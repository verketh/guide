import moment = require("moment");

export default class DateTimeUtil{

    /**
     * 格式化时间
     * @param date 
     * @param format “YYYY-MM-DD HH:mm:ss”
     */
    public static format(date:Date,format:string):string
    public static format(millisecond:number,format:string):string
    public static format(arg:any,format:string):string{
        return moment(arg).format(format);
    }
    /**
     * 获取指定时间的当天起始时间戳
     * @param date 
     * @returns 毫秒时间戳
     */
    public static startOfDate(date:Date):number
    public static startOfDate(millisecond:number):number
    public static startOfDate(arg:any):number{
        return moment(arg).startOf('date').valueOf();
    }

    /**
     * 获取指定时间的当天结束时间戳
     * @param date 
     * @returns 毫秒时间戳
     */
    public static endOfDate(date:Date):number
    public static endOfDate(millisecond:number):number
    public static endOfDate(arg:any):number{
        return moment(arg).endOf('date').valueOf();
    }
}