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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get reviews for a target' })
  async getReviews(
    @Query('targetId') targetId: string,
    @Query('targetType') targetType: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20
  ) {
    return this.reviewsService.getReviews(targetId, targetType, page, limit);
  }

  @Get('average')
  @ApiOperation({ summary: 'Get average rating for a target' })
  async getAverageRating(
    @Query('targetId') targetId: string,
    @Query('targetType') targetType: string
  ) {
    return this.reviewsService.getAverageRating(targetId, targetType);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  async create(
    @CurrentUser() user: any,
    @Body() body: {
      targetId: string;
      targetType: 'MARKETPLACE' | 'SERVICE' | 'PROVIDER' | 'JOB_EMPLOYER';
      rating: number;
      comment?: string;
      isVerified?: boolean;
    }
  ) {
    return this.reviewsService.create(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { rating?: number; comment?: string }
  ) {
    return this.reviewsService.update(user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.reviewsService.delete(user.userId, id);
  }
}

