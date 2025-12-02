import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

/**
 * Users Controller
 * Handles user CRUD operations and profile management
 */
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users (with pagination)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.usersService.findAll(page, limit);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@CurrentUser() user: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.userId, updateUserDto);
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Update current user password' })
  async updatePassword(@CurrentUser() user: any, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.usersService.updatePassword(
      user.userId,
      updatePasswordDto.oldPassword,
      updatePasswordDto.newPassword
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

