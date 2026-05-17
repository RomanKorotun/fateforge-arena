import { Module } from '@nestjs/common';

import { SecurityModule } from '../../core/security/security.module';

import { AdminController } from './presentation/admin.controller';

import { UserModule } from '../user/user.module';

import { GetAllUsersUseCase } from './application/get-all-users/get-all-users.usecase';
import { BanUserUseCase } from './application/ban-user/ban-user.usecase';
import { UnBanUserUseCase } from './application/un-ban-user/un-ban-user.usecase';

@Module({
  imports: [SecurityModule, UserModule],
  controllers: [AdminController],
  providers: [GetAllUsersUseCase, BanUserUseCase, UnBanUserUseCase],
})
export class AdminModule {}
