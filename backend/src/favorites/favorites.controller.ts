import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UserGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
@UseGuards(UserGuard)
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.favoritesService.findByUser(req.user.id);
  }

  @Post(':businessId')
  @HttpCode(HttpStatus.OK)
  add(@Param('businessId', ParseIntPipe) businessId: number, @Request() req: any) {
    return this.favoritesService.add(req.user.id, businessId);
  }

  @Delete(':businessId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('businessId', ParseIntPipe) businessId: number, @Request() req: any) {
    return this.favoritesService.remove(req.user.id, businessId);
  }
}
