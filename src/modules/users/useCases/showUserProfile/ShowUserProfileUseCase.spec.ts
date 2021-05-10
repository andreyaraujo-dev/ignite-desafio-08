import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able show user profile', async () => {
    const user: ICreateUserDTO = {
      name: "Test",
      email: "example.com.br",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const { user: { id } } = await authenticateUserUseCase.execute({
      email: 'example.com.br',
      password: '123456',
    });

    const userData = await showUserProfileUseCase.execute(id as string);

    expect(userData).toHaveProperty('id');
  })
});
