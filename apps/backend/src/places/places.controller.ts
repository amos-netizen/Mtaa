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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('nearby')
  @ApiOperation({ summary: 'Find places near a location' })
  async findNearby(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius') radius?: string,
    @Query('category') category?: string,
    @Query('search') searchQuery?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.placesService.findNearby({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radiusKm: radius ? parseFloat(radius) : undefined,
      category,
      searchQuery,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all places with filters' })
  async findAll(
    @Query('category') category?: string,
    @Query('search') searchQuery?: string,
    @Query('neighborhoodId') neighborhoodId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.placesService.findAll({
      category,
      searchQuery,
      neighborhoodId,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single place by ID' })
  async findOne(@Param('id') id: string) {
    return this.placesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new place' })
  async create(
    @CurrentUser() user: any,
    @Body() body: any,
  ) {
    return this.placesService.create(body, user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a place' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.placesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a place' })
  async delete(@Param('id') id: string) {
    return this.placesService.delete(id);
  }
}

