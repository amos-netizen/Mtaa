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
import { MarketplaceService } from './marketplace.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('listings')
  @ApiOperation({ summary: 'Get all marketplace listings' })
  @ApiQuery({ name: 'neighborhoodId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20
  ) {
    return this.marketplaceService.findAll(neighborhoodId, category, search, page, limit);
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Get single marketplace listing' })
  async findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('listings')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new marketplace listing' })
  async create(@CurrentUser() user: any, @Body() createListingDto: CreateListingDto) {
    return this.marketplaceService.create(user.userId, createListingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('listings/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update marketplace listing' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateData: Partial<CreateListingDto>
  ) {
    return this.marketplaceService.update(user.userId, id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('listings/:id/mark-sold')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark listing as sold' })
  async markAsSold(@CurrentUser() user: any, @Param('id') id: string) {
    return this.marketplaceService.markAsSold(user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('listings/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete marketplace listing' })
  async remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.marketplaceService.remove(user.userId, id);
  }
}
