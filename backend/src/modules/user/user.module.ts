import { Module } from '@nestjs/common';

import { PrismaUserRepository } from '../user/infrastructure/prisma/repositories/prisma-user.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { USER_REPOSITORY } from './domain/repositories/user.repository.token';
import { UserController } from './presentation/user.controller';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.usecase';
import { UserQueryService } from './infrastructure/prisma/query/prisma-user-query.service';
import { AddAddressUseCase } from './application/use-cases/add-address/add-address.usecase';
import { ADDRESS_REPOSITORY } from './domain/repositories/address.repository.token';
import { PrismaAddressRepository } from './infrastructure/prisma/repositories/prisma-address.repository';
import { getMeUseCase } from './application/use-cases/get-user/get-me.usecase';
import { GetUsersUseCase } from './application/use-cases/get-users/get-users.usecase';
import { UploadAvatarUseCase } from './application/use-cases/upload-avatar/upload-avatar.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    DeleteUserUseCase,
    getMeUseCase,
    GetUsersUseCase,
    AddAddressUseCase,
    UploadAvatarUseCase,
    UserQueryService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: ADDRESS_REPOSITORY, useClass: PrismaAddressRepository },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
