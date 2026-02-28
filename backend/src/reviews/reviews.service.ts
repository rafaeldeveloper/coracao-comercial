import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { BusinessesService } from '../businesses/businesses.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private repo: Repository<Review>,
    private businessesService: BusinessesService,
  ) {}

  async findByBusiness(businessId: number): Promise<Review[]> {
    return this.repo.find({
      where: { businessId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(businessId: number, userId: number, rating: number, comment: string): Promise<Review> {
    const review = this.repo.create({ businessId, userId, rating, comment });
    const saved = await this.repo.save(review);

    // Recalculate business rating
    const all = await this.repo.find({ where: { businessId } });
    const avg = all.reduce((sum, r) => sum + r.rating, 0) / all.length;
    await this.businessesService.updateRating(businessId, avg, all.length);

    return saved;
  }
}
