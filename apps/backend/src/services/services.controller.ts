import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all service listings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'neighborhoodId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('search') search?: string,
    @Query('category') category?: string
  ) {
    return this.servicesService.findAll(page, limit, neighborhoodId, search, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single service listing' })
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service listing' })
  async create(
    @CurrentUser() user: any,
    @Body() body: {
      title: string;
      description: string;
      neighborhoodId: string;
      category?: string;
      images?: string[];
      price?: number;
      serviceType?: string;
    }
  ) {
    return this.servicesService.create(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/book')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book a service' })
  async book(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: {
      preferredDate?: string;
      preferredTime?: string;
      message: string;
    }
  ) {
    return this.servicesService.book(user.userId, id, body);
  }
}






