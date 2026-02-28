import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { CategoriesModule } from '../categories/categories.module';
import { Business } from '../businesses/business.entity';

@Module({
  imports: [CategoriesModule, TypeOrmModule.forFeature([Business])],
  providers: [SeedService],
})
export class SeedModule {}
