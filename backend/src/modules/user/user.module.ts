import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/prisma/prisma.module';

import { PrismaUserRepository } from '../user/infrastructure/prisma/repositories/prisma-user.repository';

import { UserController } from './presentation/user.controller';

import { USER_REPOSITORY } from './domain/repositories/user.repository.token';
import { ADDRESS_REPOSITORY } from './domain/repositories/address.repository.token';
import { USER_SEED_REPOSITORY } from './domain/repositories/user-seed.repository.token';
import { PROFILE_REPOSITORY } from './domain/repositories/profile.repository.token';

import { UserQueryService } from './infrastructure/prisma/query/prisma-user-query.service';
import { PrismaAddressRepository } from './infrastructure/prisma/repositories/prisma-address.repository';
import { PrismaUserSeedRepository } from './infrastructure/prisma/repositories/prisma-user-seed.repository';
import { PrismaProfileRepository } from './infrastructure/prisma/repositories/prisma-profile.reposotory';

import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.usecase';
import { AddAddressUseCase } from './application/use-cases/add-address/add-address.usecase';
import { getMeUseCase } from './application/use-cases/get-me/get-me.usecase';
import { GetUsersUseCase } from './application/use-cases/get-users/get-users.usecase';
import { UploadAvatarUseCase } from './application/use-cases/upload-avatar/upload-avatar.usecase';
import { GetAddressUseCase } from './application/use-cases/get-address/get-address.usecase';
import { UpdateAddressUseCase } from './application/use-cases/update-address/update-address.usecase';
import { CreateClientSeedUseCase } from './application/use-cases/create-client-seed/create-client-seed.usecase';
import { UpdateClientSeedUseCase } from './application/use-cases/update-client-seed/update-client-seed.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    DeleteUserUseCase,
    getMeUseCase,
    GetUsersUseCase,
    AddAddressUseCase,
    GetAddressUseCase,
    UpdateAddressUseCase,
    UploadAvatarUseCase,
    UserQueryService,
    CreateClientSeedUseCase,
    UpdateClientSeedUseCase,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: ADDRESS_REPOSITORY, useClass: PrismaAddressRepository },
    { provide: PROFILE_REPOSITORY, useClass: PrismaProfileRepository },
    { provide: USER_SEED_REPOSITORY, useClass: PrismaUserSeedRepository },
  ],
  exports: [USER_REPOSITORY, PROFILE_REPOSITORY, USER_SEED_REPOSITORY],
})
export class UserModule {}
