import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe('Create user', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it('should be able create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: "Test",
      email: "email@email.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });
});
