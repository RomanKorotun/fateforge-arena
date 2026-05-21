import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { IUserSeedRepository } from '../../../domain/repositories/user-seed.repository';
import { USER_SEED_REPOSITORY } from '../../../domain/repositories/user-seed.repository.token';

@Injectable()
export class GetClientSeedUseCase {
  constructor(
    @Inject(USER_SEED_REPOSITORY)
    private readonly userSeedRepository: IUserSeedRepository,
  ) {}

  async execute(userId: string) {
    const seed = await this.userSeedRepository.getSeed(userId);

    return {
      clientSeed: seed ? seed.clientSeed : null,
    };
  }
}
