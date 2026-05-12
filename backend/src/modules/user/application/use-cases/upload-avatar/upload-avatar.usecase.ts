import { Inject, Injectable } from '@nestjs/common';

import { UploadAvatarCommand } from './upload-avatar.command';

import { PROFILE_REPOSITORY } from '../../../domain/repositories/profile.repository.token';
import type { IProfileRepository } from '../../../domain/repositories/profile.repository';

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute({ userId, avatar }: UploadAvatarCommand) {
    await this.profileRepository.updateAvatar({ userId, avatar });

    return {
      avatarUrl: `/avatars/${avatar}`,
      filename: avatar,
    };
  }
}
