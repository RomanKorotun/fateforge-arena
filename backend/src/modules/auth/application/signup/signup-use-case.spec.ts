import { Test } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';

import { SignupUseCase } from './signup.usecase';
import { PasswordHashService } from '../../../../core/security/services/password-hash.service';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository.token';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { UserEntity } from '../../../user/domain/entities/user.entity';
import { UserRole } from '../../../user/domain/enums/user-role.enum';

describe('SignupUseCase', () => {
  let signupUseCase: SignupUseCase;
  let passwordHashService: PasswordHashService;
  let userRepository: IUserRepository;

  const command = {
    username: 'test',
    email: 'test@gmail.com',
    password: 'R123456',
  };

  const hashedPassword = 'hashedPassword';

  const response: UserEntity = {
    id: 'test-id',
    username: 'test',
    email: 'test@gmail.com',
    password: hashedPassword,
    role: UserRole.USER,
    lastLoginIp: null,
    lastLoginAt: null,
    isBanned: false,
    banEndAt: null,
    isDeleted: false,
    detetedAt: null,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SignupUseCase,
        {
          provide: PasswordHashService,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: USER_REPOSITORY,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    signupUseCase = module.get(SignupUseCase);
    passwordHashService = module.get(PasswordHashService);
    userRepository = module.get(USER_REPOSITORY);
  });

  it('повинен кинути ConflictException якщо користувач з таким email вже існує', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(response);
    await expect(signupUseCase.execute(command)).rejects.toThrow(
      ConflictException,
    );
  });

  it('повинен викликати findByEmail з email користувача', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(passwordHashService, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(userRepository, 'createUser').mockResolvedValue(response);
    await signupUseCase.execute(command);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(command.email);
  });

  it('повинен хешувати пароль користувача', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(passwordHashService, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(userRepository, 'createUser').mockResolvedValue(response);
    await signupUseCase.execute(command);
    expect(passwordHashService.hash).toHaveBeenCalledWith(command.password);
  });

  it('повинен створити користувача з захешованим паролем', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(passwordHashService, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(userRepository, 'createUser').mockResolvedValue(response);
    await signupUseCase.execute(command);
    expect(userRepository.createUser).toHaveBeenCalledWith({
      ...command,
      password: hashedPassword,
    });
  });

  it('повинен повернути створеного користувача без пароля', async () => {
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(passwordHashService, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(userRepository, 'createUser').mockResolvedValue(response);
    const result = await signupUseCase.execute(command);
    expect(result).toEqual({
      id: response.id,
      username: response.username,
      email: response.email,
    });
  });
});
