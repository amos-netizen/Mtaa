import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PasswordUtil } from '../common/utils/password.util';
export declare class UsersService {
    private prisma;
    private passwordUtil;
    constructor(prisma: PrismaService, passwordUtil: PasswordUtil);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            email: string;
            phoneNumber: string;
            fullName: string;
            profileImageUrl: string;
            bio: string;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    findByPhoneNumber(phoneNumber: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string | null;
        phoneNumber: string;
        passwordHash: string;
        fullName: string;
        profileImageUrl: string | null;
        bio: string | null;
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        locationVerified: boolean;
        verificationStatus: string;
        role: string;
        languagePreference: string;
        mpesaNumber: string | null;
        isBanned: boolean;
        banReason: string | null;
        banExpiresAt: Date | null;
        lastSeenAt: Date | null;
        trustedMemberBadge: boolean;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    updatePassword(id: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    sanitizeUser(user: any): any;
}
