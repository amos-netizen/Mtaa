import { OnModuleInit } from '@nestjs/common';
export declare class UploadService implements OnModuleInit {
    private readonly uploadPath;
    private readonly maxFileSize;
    private readonly allowedMimeTypes;
    onModuleInit(): Promise<void>;
    uploadImage(file: Express.Multer.File): Promise<string>;
    uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]>;
}
