const crypto = require('crypto');
export class CryptoUtil {
    //加密密钥
    private static readonly ENCRYPT_KEY = '23yOjdk098dj';
    /**
     * 获取MD5值
     * @param str 
     */
    public static md5(str: string): string {
        const hash = crypto.createHash('md5');
        hash.update(str);
        const md5str = hash.digest('hex');
        return md5str;
    }
    /**
     * AES加密
     * @param data 
     */
    public static aesEncrypt(data: string): string {
        const cipher = crypto.createCipher('aes-256-cbc', CryptoUtil.ENCRYPT_KEY);
        var crypted = cipher.update(data, 'utf8', 'base64');
        crypted += cipher.final('base64');
        return crypted;
    }
    /**
     * AES解密
     * @param encrypted 
     */
    public static aesDecrypt(encrypted: string): string {
        const decipher = crypto.createDecipher('aes-256-cbc', CryptoUtil.ENCRYPT_KEY);
        var decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}