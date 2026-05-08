import { Inject, Injectable } from '@nestjs/common';

import { UpdateClientSeedCommand } from './update-client-seed.command';

import { USER_SEED_REPOSITORY } from '../../../domain/repositories/user-seed.repository.token';
import type { IUserSeedRepository } from '../../../domain/repositories/user-seed.repository';

@Injectable()
export class UpdateClientSeedUseCase {
  constructor(
    @Inject(USER_SEED_REPOSITORY)
    private readonly userSeedRepository: IUserSeedRepository,
  ) {}
  async execute({ userId, clientSeed }: UpdateClientSeedCommand) {
    const userSeed = await this.userSeedRepository.upsertSeed({
      userId,
      clientSeed,
    });
    return userSeed;
  }
}
