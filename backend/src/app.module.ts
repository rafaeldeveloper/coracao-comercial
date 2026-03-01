import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { BusinessAuthModule } from './business-auth/business-auth.module';
import { UsersModule } from './users/users.module';
import { BusinessOwnersModule } from './business-owners/business-owners.module';
import { CategoriesModule } from './categories/categories.module';
import { BusinessesModule } from './businesses/businesses.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SeedModule } from './seed/seed.module';
import { User } from './users/user.entity';
import { BusinessOwner } from './business-owners/business-owner.entity';
import { Category } from './categories/category.entity';
import { Business } from './businesses/business.entity';
import { Favorite } from './favorites/favorite.entity';
import { Review } from './reviews/review.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH || 'coracao.sqlite',
      entities: [User, BusinessOwner, Category, Business, Favorite, Review],
      synchronize: true,
    }),
    AuthModule,
    BusinessAuthModule,
    UsersModule,
    BusinessOwnersModule,
    CategoriesModule,
    BusinessesModule,
    FavoritesModule,
    ReviewsModule,
    SeedModule,
  ],
})
export class AppModule {}
