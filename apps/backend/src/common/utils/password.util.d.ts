import { AppConfigService } from '../../config/config.service';
export declare class PasswordUtil {
    private configService;
    constructor(configService: AppConfigService);
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
}
