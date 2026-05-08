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
import { getMeUseCase } from './application/use-cases/get-me/get-me.usecase';
import { GetUsersUseCase } from './application/use-cases/get-users/get-users.usecase';
import { UploadAvatarUseCase } from './application/use-cases/upload-avatar/upload-avatar.usecase';
import { GetAddressUseCase } from './application/use-cases/get-address/get-address.usecase';
import { UpdateAddressUseCase } from './application/use-cases/update-address/update-address.usecase';
import { CreateClientSeedUseCase } from './application/use-cases/create-client-seed/create-client-seed.usecase';
import { USER_SEED_REPOSITORY } from './domain/repositories/user-seed.repository.token';
import { PrismaUserSeedRepository } from './infrastructure/prisma/repositories/prisma-user-seed.repository';
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
    { provide: USER_SEED_REPOSITORY, useClass: PrismaUserSeedRepository },
  ],
  exports: [USER_REPOSITORY, USER_SEED_REPOSITORY],
})
export class UserModule {}
