import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  ParseFloatPipe,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { NearbyService } from './nearby.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('nearby')
@Controller('nearby')
export class NearbyController {
  constructor(private readonly nearbyService: NearbyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all nearby items (marketplace, alerts, events)' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km (default: 5)' })
  @ApiQuery({ name: 'types', required: false, type: String, description: 'Comma-separated types: marketplace,alert,event' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max items to return (default: 50)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination (default: 0)' })
  @ApiResponse({ status: 200, description: 'List of nearby items with distance' })
  async findNearby(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', new DefaultValuePipe(5), ParseFloatPipe) radiusKm: number,
    @Query('types') types?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    const typeArray = types ? types.split(',').map((t) => t.trim()) : undefined;
    
    return this.nearbyService.findNearby({
      latitude,
      longitude,
      radiusKm,
      types: typeArray,
      limit,
      offset,
    });
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get nearby safety alerts' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km (default: 5)' })
  @ApiResponse({ status: 200, description: 'List of nearby safety alerts' })
  async findNearbyAlerts(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', new DefaultValuePipe(5), ParseFloatPipe) radiusKm: number,
  ) {
    return this.nearbyService.findNearbyAlerts(latitude, longitude, radiusKm);
  }

  @Get('marketplace')
  @ApiOperation({ summary: 'Get nearby marketplace listings' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km (default: 5)' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of nearby marketplace listings' })
  async findNearbyMarketplace(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', new DefaultValuePipe(5), ParseFloatPipe) radiusKm: number,
    @Query('category') category?: string,
  ) {
    return this.nearbyService.findNearbyMarketplace(
      latitude,
      longitude,
      radiusKm,
      category,
    );
  }

  @Get('neighborhoods')
  @ApiOperation({ summary: 'Get nearby neighborhoods' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Radius in km (default: 10)' })
  @ApiResponse({ status: 200, description: 'List of nearby neighborhoods' })
  async findNearbyNeighborhoods(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('radius', new DefaultValuePipe(10), ParseFloatPipe) radiusKm: number,
  ) {
    return this.nearbyService.getNearbyNeighborhoods(latitude, longitude, radiusKm);
  }

  @Post('location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user location' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  async updateLocation(
    @Req() req: any,
    @Body() body: { latitude: number; longitude: number },
  ) {
    return this.nearbyService.updateUserLocation(
      req.user.sub,
      body.latitude,
      body.longitude,
    );
  }
}

