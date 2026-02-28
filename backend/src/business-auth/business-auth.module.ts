import { Module } from '@nestjs/common';
import { BusinessAuthService } from './business-auth.service';
import { BusinessAuthController } from './business-auth.controller';
import { BusinessOwnersModule } from '../business-owners/business-owners.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [BusinessOwnersModule, BusinessesModule, AuthModule],
  providers: [BusinessAuthService],
  controllers: [BusinessAuthController],
})
export class BusinessAuthModule {}
