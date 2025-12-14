"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fs_1 = require("fs");
let UploadService = class UploadService {
    uploadPath = (0, path_1.join)(process.cwd(), 'public', 'uploads');
    maxFileSize = 5 * 1024 * 1024;
    allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    async onModuleInit() {
        if (!(0, fs_1.existsSync)(this.uploadPath)) {
            await (0, promises_1.mkdir)(this.uploadPath, { recursive: true });
        }
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException('File size exceeds 5MB limit');
        }
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are allowed');
        }
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.originalname.split('.').pop();
        const filename = `marketplace-${timestamp}-${randomString}.${extension}`;
        const filepath = (0, path_1.join)(this.uploadPath, filename);
        await (0, promises_1.writeFile)(filepath, file.buffer);
        const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
        return `${baseUrl}/uploads/${filename}`;
    }
    async uploadMultipleImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        if (files.length > 8) {
            throw new common_1.BadRequestException('Maximum 8 images allowed');
        }
        const uploadPromises = files.map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)()
], UploadService);
//# sourceMappingURL=upload.service.js.map