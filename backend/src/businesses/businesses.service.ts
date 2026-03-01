import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Business } from './business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private repo: Repository<Business>,
  ) {}

  async findAll(query: {
    category?: string;
    search?: string;
    sort?: string;
    city?: string;
    limit?: number;
    offset?: number;
  }): Promise<Business[]> {
    const qb = this.repo.createQueryBuilder('b');

    if (query.category) {
      qb.andWhere('b.categoryId = :category', { category: query.category });
    }

    if (query.search) {
      const s = `%${query.search}%`;
      qb.andWhere(
        '(b.name LIKE :s OR b.description LIKE :s OR b.tags LIKE :s)',
        { s },
      );
    }

    if (query.city) {
      const c = `%${query.city}%`;
      qb.andWhere('(b.city LIKE :c OR b.address LIKE :c)', { c });
    }

    if (query.sort === 'rating') {
      qb.orderBy('b.rating', 'DESC');
    } else if (query.sort === 'reviews') {
      qb.orderBy('b.reviewCount', 'DESC');
    } else {
      // ranking ou padrão: rankPosition ASC, NULLs por último
      qb.orderBy('CASE WHEN b.rankPosition IS NULL THEN 1 ELSE 0 END', 'ASC')
        .addOrderBy('b.rankPosition', 'ASC');
    }

    if (query.limit) qb.limit(query.limit);
    if (query.offset) qb.offset(query.offset);

    const businesses = await qb.getMany();
    return businesses.map((b) => this.parseTags(b));
  }

  async findOne(id: number): Promise<Business> {
    const b = await this.repo.findOne({ where: { id } });
    if (!b) throw new NotFoundException('Negócio não encontrado');
    return this.parseTags(b);
  }

  async create(dto: CreateBusinessDto, ownerId: number): Promise<Business> {
    const business = this.repo.create({
      ...dto,
      tags: dto.tags ? JSON.stringify(dto.tags) : null,
      ownerId,
    });
    const saved = await this.repo.save(business);
    return this.parseTags(saved);
  }

  async update(id: number, dto: UpdateBusinessDto, ownerId: number): Promise<Business> {
    const business = await this.findOne(id);
    if (business.ownerId !== ownerId) throw new ForbiddenException();

    const updated = { ...dto } as any;
    if (dto.tags) updated.tags = JSON.stringify(dto.tags);

    await this.repo.update(id, updated);
    return this.findOne(id);
  }

  async updateLogo(id: number, ownerId: number, imagePath: string): Promise<Business> {
    const business = await this.repo.findOne({ where: { id, ownerId } });
    if (!business) throw new NotFoundException('Negócio não encontrado');
    business.image = imagePath;
    return this.parseTags(await this.repo.save(business));
  }

  async updateRating(businessId: number, avgRating: number, count: number) {
    await this.repo.update(businessId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: count,
    });
  }

  async save(business: Business): Promise<Business> {
    return this.repo.save(business);
  }

  private parseTags(b: Business): Business {
    if (b.tags && typeof b.tags === 'string') {
      try {
        (b as any).tags = JSON.parse(b.tags);
      } catch {
        (b as any).tags = [];
      }
    }
    return b;
  }
}
