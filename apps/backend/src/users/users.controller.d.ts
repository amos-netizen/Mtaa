import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(page: number, limit: number): Promise<{
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
    getProfile(user: any): Promise<any>;
    updateProfile(user: any, updateUserDto: UpdateUserDto): Promise<any>;
    updatePassword(user: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
