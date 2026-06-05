import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppConfigModule } from './core/config/config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './core/redis/redis.module';
import { AdminModule } from './modules/admin/admin.module';
import { RouletteModule } from './modules/roulette/roulette.module';
import { EmailModule } from './core/email/email.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { FinanceModule } from './modules/finance/finance.module';
import { GeoIpModule } from './core/geoip/geo-ip.module';
import { VideoslotModule } from './modules/videoslot/videoclot.module';
import { ChatModule } from './modules/chat/chat.module';
import { JwtAuthModule } from './core/JwtAuth/jwt-auth.module';

@Module({
  imports: [
    JwtAuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
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
  ],
})
export class AppModule {}
