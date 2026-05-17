import { Inject, Injectable } from '@nestjs/common';

import { CreateClientSeedCommand } from './create-client-seed.command';

import { USER_SEED_REPOSITORY } from '../../../domain/repositories/user-seed.repository.token';
import type { IUserSeedRepository } from '../../../domain/repositories/user-seed.repository';

@Injectable()
export class CreateClientSeedUseCase {
  constructor(
    @Inject(USER_SEED_REPOSITORY)
    private readonly userSeedRepository: IUserSeedRepository,
  ) {}
  async execute({ userId, clientSeed }: CreateClientSeedCommand) {
    const userSeed = await this.userSeedRepository.upsertSeed({
      userId,
      clientSeed,
    });
    return userSeed;
  }
}
