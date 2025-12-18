import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a report' })
  async create(
    @CurrentUser() user: any,
    @Body() body: {
      postId: string;
      reason: string;
      description?: string;
    }
  ) {
    return this.reportsService.create(user.userId, body);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get reports for a post' })
  async getPostReports(@Param('postId') postId: string) {
    return this.reportsService.getPostReports(postId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports (admin only)' })
  async getAllReports(
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20
  ) {
    return this.reportsService.getAllReports(status, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report by ID (admin only)' })
  async getOne(@Param('id') id: string) {
    return this.reportsService.getOne(id);
  }

  @Put(':id/resolve')
  @ApiOperation({ summary: 'Resolve a report (admin only)' })
  async resolveReport(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { action: 'warn' | 'ban' | 'dismiss'; reason?: string }
  ) {
    return this.reportsService.resolveReport(user.userId, id, body.action, body.reason);
  }
}

