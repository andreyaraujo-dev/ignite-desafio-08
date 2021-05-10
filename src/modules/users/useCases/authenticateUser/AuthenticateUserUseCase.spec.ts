import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create session user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able create a new session for user', async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "example.com.br",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const response = await authenticateUserUseCase.execute({
      email: 'example.com.br',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
  });
});
