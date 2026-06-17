import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { RateLimitModule } from './shared/infrastructure/rate-limit/rate-limit.module';

import { HttpRateLimitGuard } from './common/guards/http-rate-limit.guard';

import { AppConfigModule } from './core/config/env/config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { JwtAuthModule } from './core/JwtAuth/jwt-auth.module';
import { RedisModule } from './core/redis/redis.module';
import { GeoIpModule } from './core/geoip/geo-ip.module';
import { EmailModule } from './core/email/email.module';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { RouletteModule } from './modules/roulette/roulette.module';
import { FinanceModule } from './modules/finance/finance.module';
import { VideoslotModule } from './modules/videoslot/videoclot.module';
import { ChatModule } from './modules/chat/chat.module';
import { BattleModule } from './modules/battle/battle.module';

@Module({
  imports: [
    JwtAuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AppConfigModule,
    DatabaseModule,
    GeoIpModule,
    PrismaModule,
    RedisModule,
    EmailModule,
    AuthModule,
    UserModule,
    AdminModule,
    RouletteModule,
    FinanceModule,
    VideoslotModule,
    ChatModule,
    BattleModule,
    RateLimitModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: HttpRateLimitGuard }],
})
export class AppModule {}
