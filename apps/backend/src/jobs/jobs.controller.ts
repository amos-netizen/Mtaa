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
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all job listings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'neighborhoodId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('search') search?: string
  ) {
    return this.jobsService.findAll(page, limit, neighborhoodId, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single job listing' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post a new job' })
  async create(
    @CurrentUser() user: any,
    @Body() body: {
      title: string;
      description: string;
      neighborhoodId: string;
      category?: string;
      images?: string[];
      salary?: string;
      jobType?: string;
    }
  ) {
    return this.jobsService.create(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a job posting' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: {
      title?: string;
      description?: string;
      category?: string;
      images?: string[];
    }
  ) {
    return this.jobsService.update(user.userId, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job posting' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.jobsService.remove(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply for a job' })
  async apply(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { coverLetter: string; resumeUrl?: string }
  ) {
    return this.jobsService.apply(user.userId, id, body);
  }
}














