import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private repo: Repository<Favorite>,
  ) {}

  async findByUser(userId: number): Promise<number[]> {
    const favs = await this.repo.find({ where: { userId } });
    return favs.map((f) => f.businessId);
  }

  async add(userId: number, businessId: number): Promise<void> {
    const existing = await this.repo.findOne({ where: { userId, businessId } });
    if (!existing) {
      const fav = this.repo.create({ userId, businessId });
      await this.repo.save(fav);
    }
  }

  async remove(userId: number, businessId: number): Promise<void> {
    await this.repo.delete({ userId, businessId });
  }
}
