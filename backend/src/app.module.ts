import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ToursModule } from './tours/tours.module';
import { AuthModule } from './auth/auth.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { GalleryModule } from './gallery/gallery.module';
import { AdminModule } from './admin/admin.module';
// Import entities explicitly (not via a filesystem glob) so they still
// register when the code is bundled into a serverless function on Vercel.
import { Tour } from './tours/tour.entity';
import { User } from './auth/entities/user.entity';
import { Inquiry } from './inquiries/inquiry.entity';
import { GalleryImage } from './gallery/gallery-image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // Rate limiting — 100 req/60s globally, auth routes override with stricter limits
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Prefer a single Postgres connection string (Supabase gives one).
        // Use the pooler URL (port 6543, transaction mode) on serverless.
        const url = configService.get<string>('DATABASE_URL');
        const isProd = process.env.NODE_ENV === 'production';

        return {
          type: 'postgres' as const,
          ...(url
            ? { url }
            : {
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5432),
                username: configService.get<string>('DB_USER', 'postgres'),
                password: configService.get<string>('DB_PASS', ''),
                database: configService.get<string>('DB_NAME', 'postgres'),
              }),
          // Supabase requires SSL; the pooler cert isn't in the local CA store.
          ssl: isProd || url ? { rejectUnauthorized: false } : false,
          entities: [Tour, User, Inquiry, GalleryImage],
          // Never auto-sync in prod; schema is created via the migrate script.
          synchronize: !isProd && !url,
          logging: false,
          // Serverless: keep the pool tiny and lean on Supabase's pgbouncer.
          extra: { max: isProd ? 1 : 10 },
        };
      },
    }),

    ToursModule,
    AuthModule,
    InquiriesModule,
    GalleryModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
