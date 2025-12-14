import { AuthService } from './auth.service';
import { RegisterDto, VerifyOtpDto, LoginDto, LoginPasswordDto, RefreshTokenDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    registerWithOtp(registerDto: RegisterDto): Promise<{
        userId: string;
        message: string;
    }>;
    login(loginPasswordDto: LoginPasswordDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    requestOtp(loginDto: LoginDto): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(user: any): Promise<any>;
    logout(user: any, body: {
        refreshToken?: string;
    }): Promise<{
        message: string;
    }>;
}
