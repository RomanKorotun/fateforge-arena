import { Inject, Injectable } from '@nestjs/common';

import { UploadAvatarCommand } from './upload-avatar.command';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../domain/repositories/user.repository';

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ userId, avatar }: UploadAvatarCommand) {
    await this.userRepository.updateAvatar({ userId, avatar });

    return {
      avatarUrl: `/avatars/${avatar}`,
      filename: avatar,
    };
  }
}
