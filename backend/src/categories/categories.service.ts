import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.repo.find();
  }

  findOne(id: string): Promise<Category | null> {
    return this.repo.findOne({ where: { id } });
  }

  upsert(data: Partial<Category>): Promise<Category> {
    const cat = this.repo.create(data);
    return this.repo.save(cat);
  }
}
