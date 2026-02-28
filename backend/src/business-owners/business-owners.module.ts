import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessOwner } from './business-owner.entity';
import { BusinessOwnersService } from './business-owners.service';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessOwner])],
  providers: [BusinessOwnersService],
  exports: [BusinessOwnersService],
})
export class BusinessOwnersModule {}
