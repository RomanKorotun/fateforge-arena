import { ForbiddenException, Inject, Injectable } from '@nestjs/common';

import { UserRole } from '../../../../user/domain/enums/user-role.enum';

import { GetVideoslotHistoryCommand } from './get-videoslot-history.command';

import { VIDEOSLOT_HISTORY_REPOSITORY } from '../../../domain/repositories/videoslot-history/videosllot-history.repository.token';
import type { IVideoslotHistoryRepository } from '../../../domain/repositories/videoslot-history/videosllot-history.repository';

@Injectable()
export class GetVideoslotHistoryUseCase {
  constructor(
    @Inject(VIDEOSLOT_HISTORY_REPOSITORY)
    private readonly videoslotHistoryRepository: IVideoslotHistoryRepository,
  ) {}

  async execute(command: GetVideoslotHistoryCommand) {
    const {
      requesterId,
      requesterRole,
      userId,
      gameId,
      currency,
      from,
      to,
      page,
      limit,
    } = command;

    const isAdmin = requesterRole === UserRole.ADMIN;

    // 1. ПРАВИЛА ДОСТУПУ ДЛЯ ЗВИЧАЙНОГО КОРИСТУВАЧА
    // - користувач не має права дивитися історію інших користувачів
    if (!isAdmin) {
      if (userId && userId !== requesterId) {
        throw new ForbiddenException('No access to other users history');
      }
    }

    // 2. ФОРМУВАННЯ ФІЛЬТРУ ДЛЯ ЗАПИТУ
    // - USER: завжди бачить тільки свою історію
    // - ADMIN:
    // - бачити всі історії (якщо userId не передано)
    // - або фільтрувати по конкретному користувачу

    const finalUserId = isAdmin
      ? userId // якщо передано userId → фільтруємо по ньому
      : requesterId; // користувач бачить тільки свої дані

    // нормалізація дат
    const fromDate = from
      ? new Date(new Date(from).setHours(0, 0, 0, 0))
      : undefined;

    const toDate = to
      ? new Date(new Date(to).setHours(23, 59, 59, 999))
      : undefined;

    // 3. ОТРИМАННЯ ДАНИХ З РЕПОЗИТОРІЮ
    const result = await this.videoslotHistoryRepository.findMany({
      userId: finalUserId,
      gameId,
      currency,
      from: fromDate,
      to: toDate,
      page,
      limit,
    });

    // 4. РОЗРАХУНОК ПАГІНАЦІЇ
    const totalPages = Math.ceil(result.total / limit);

    return {
      data: result.data,
      pagination: {
        page,
        totalItems: result.total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }
}
