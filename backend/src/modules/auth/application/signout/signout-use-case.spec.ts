import { Test } from '@nestjs/testing';

import { SignoutUseCase } from './signout.usecase';

import { SESSION_REPOSITORY } from '../../domain/repositories/session.repository.token';
import type { ISessionRepository } from '../../domain/repositories/session.repository';

describe('SignoutUseCase', () => {
  let signoutUseCase: SignoutUseCase;
  let sessionRepository: ISessionRepository;

  const command = {
    sessionId: 'session-id',
    userId: 'user-id',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignoutUseCase,
        {
          provide: SESSION_REPOSITORY,
          useValue: {
            deleteSession: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    signoutUseCase = module.get(SignoutUseCase);
    sessionRepository = module.get(SESSION_REPOSITORY);
  });

  it('повинен викликати deleteSession з правильними параметрами', async () => {
    await signoutUseCase.execute(command);

    expect(sessionRepository.deleteSession).toHaveBeenCalledWith({
      sessionId: command.sessionId,
      userId: command.userId,
    });
  });

  it('повинен повернути success message', async () => {
    const result = await signoutUseCase.execute(command);

    expect(result).toEqual({
      message: 'Signout success',
    });
  });
});
