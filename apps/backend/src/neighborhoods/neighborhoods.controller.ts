import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NeighborhoodsService } from './neighborhoods.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Neighborhoods')
@Controller('neighborhoods')
export class NeighborhoodsController {
  constructor(private readonly neighborhoodsService: NeighborhoodsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all neighborhoods' })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('city') city?: string,
    @Query('search') search?: string
  ) {
    return this.neighborhoodsService.findAll(city, search);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single neighborhood by ID' })
  async findOne(@Param('id') id: string) {
    return this.neighborhoodsService.findOne(id);
  }
}






