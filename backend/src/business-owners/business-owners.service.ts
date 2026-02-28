import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessOwner } from './business-owner.entity';

@Injectable()
export class BusinessOwnersService {
  constructor(
    @InjectRepository(BusinessOwner)
    private repo: Repository<BusinessOwner>,
  ) {}

  findByEmail(email: string): Promise<BusinessOwner | null> {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number): Promise<BusinessOwner | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<BusinessOwner>): Promise<BusinessOwner> {
    const owner = this.repo.create(data);
    return this.repo.save(owner);
  }
}
