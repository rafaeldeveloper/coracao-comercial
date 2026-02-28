import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { BusinessAuthService } from './business-auth.service';
import { BusinessRegisterDto } from './dto/business-register.dto';
import { BusinessLoginDto } from './dto/business-login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('business-auth')
export class BusinessAuthController {
  constructor(private businessAuthService: BusinessAuthService) {}

  @Post('register')
  register(@Body() dto: BusinessRegisterDto) {
    return this.businessAuthService.register(dto);
  }

  @Post('login')
  login(@Body() dto: BusinessLoginDto) {
    return this.businessAuthService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req: any) {
    const { password, ...business } = req.user;
    return { business };
  }
}
