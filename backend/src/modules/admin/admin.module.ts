import { Module } from '@nestjs/common';

import { AdminController } from './presentation/admin.controller';
import { GetAllUsersUseCase } from './application/get-all-users/get-all-users.usecase';
import { UserModule } from '../user/user.module';
import { SecurityModule } from '../../core/security/security.module';
import { BanUserUseCase } from './application/ban-user/ban-user.usecase';
import { UnBanUserUseCase } from './application/un-ban-user/un-ban-user.usecase';

@Module({
  imports: [SecurityModule, UserModule],
  controllers: [AdminController],
  providers: [GetAllUsersUseCase, BanUserUseCase, UnBanUserUseCase],
})
export class AdminModule {}
