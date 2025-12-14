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
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'neighborhoodId', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('category') category?: string
  ) {
    return this.postsService.findAll(page, limit, neighborhoodId, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  async create(
    @CurrentUser() user: any,
    @Body() body: {
      title: string;
      description: string;
      neighborhoodId: string;
      category?: string;
      type?: string;
      images?: string[];
      videos?: string[];
      isAnonymous?: boolean;
    }
  ) {
    return this.postsService.create(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: {
      title?: string;
      description?: string;
      category?: string;
      images?: string[];
      videos?: string[];
    }
  ) {
    return this.postsService.update(user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.postsService.remove(user.userId, id);
  }

  @Get(':postId/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getComments(
    @Param('postId') postId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20
  ) {
    return this.postsService.getComments(postId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on a post' })
  async createComment(
    @CurrentUser() user: any,
    @Param('postId') postId: string,
    @Body() body: { content: string; parentId?: string }
  ) {
    return this.postsService.createComment(user.userId, postId, body.content, body.parentId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('comments/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a comment' })
  async updateComment(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { content: string }
  ) {
    return this.postsService.updateComment(user.userId, id, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  async deleteComment(@CurrentUser() user: any, @Param('id') id: string) {
    return this.postsService.deleteComment(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike a post' })
  async toggleLike(@CurrentUser() user: any, @Param('postId') postId: string) {
    return this.postsService.toggleLike(user.userId, postId);
  }
}





