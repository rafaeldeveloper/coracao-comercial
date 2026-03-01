import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessGuard } from '../auth/jwt-auth.guard';

@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
    @Query('city') city?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.businessesService.findAll({
      category,
      search,
      sort,
      city,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.businessesService.findOne(id);
  }

  @Post()
  @UseGuards(BusinessGuard)
  create(@Body() dto: CreateBusinessDto, @Request() req: any) {
    return this.businessesService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(BusinessGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBusinessDto,
    @Request() req: any,
  ) {
    return this.businessesService.update(id, dto, req.user.id);
  }

  @Patch(':id/logo')
  @UseGuards(BusinessGuard)
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads', 'logos'),
      filename: (req, file, cb) =>
        cb(null, `${(req as any).params.id}-${Date.now()}${extname(file.originalname)}`),
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif|webp)/))
        return cb(new BadRequestException('Apenas imagens são permitidas'), false);
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.businessesService.updateLogo(id, req.user.sub, `/uploads/logos/${file.filename}`);
  }
}
