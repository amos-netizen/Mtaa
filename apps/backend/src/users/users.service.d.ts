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
            phoneNumber: string;
            fullName: string;
            username: string;
            email: string;
            bio: string;
            profileImageUrl: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
        phoneNumber: string;
        fullName: string;
        username: string;
        email: string | null;
        address: string | null;
        bio: string | null;
        profileImageUrl: string | null;
        languagePreference: string;
        mpesaNumber: string | null;
        id: string;
        passwordHash: string;
        latitude: number | null;
        longitude: number | null;
        locationVerified: boolean;
        verificationStatus: string;
        role: string;
        isActive: boolean;
        isBanned: boolean;
        banReason: string | null;
        banExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
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
