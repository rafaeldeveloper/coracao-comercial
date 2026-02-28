import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BusinessOwnersService } from '../business-owners/business-owners.service';
import { BusinessesService } from '../businesses/businesses.service';
import { BusinessRegisterDto } from './dto/business-register.dto';
import { BusinessLoginDto } from './dto/business-login.dto';

@Injectable()
export class BusinessAuthService {
  constructor(
    private businessOwnersService: BusinessOwnersService,
    private businessesService: BusinessesService,
    private jwtService: JwtService,
  ) {}

  async register(dto: BusinessRegisterDto) {
    const existing = await this.businessOwnersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const password = await bcrypt.hash(dto.password, 10);
    const owner = await this.businessOwnersService.create({
      email: dto.email,
      password,
      businessName: dto.businessName,
      phone: dto.phone,
      address: dto.address,
      categoryId: dto.category,
    });

    // Cria automaticamente o listing do negócio nas buscas
    await this.businessesService.create(
      {
        name: owner.businessName,
        categoryId: owner.categoryId,
        phone: owner.phone,
        address: owner.address,
        city: dto.city,
      },
      owner.id,
    );

    const token = this.jwtService.sign({ sub: owner.id, email: owner.email, type: 'business' });
    return { token, business: this.sanitize(owner) };
  }

  async login(dto: BusinessLoginDto) {
    const owner = await this.businessOwnersService.findByEmail(dto.email);
    if (!owner) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, owner.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const token = this.jwtService.sign({ sub: owner.id, email: owner.email, type: 'business' });
    return { token, business: this.sanitize(owner) };
  }

  private sanitize(owner: any) {
    const { password, ...rest } = owner;
    return rest;
  }
}
