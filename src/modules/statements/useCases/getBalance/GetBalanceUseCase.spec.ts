import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from '../../../users/useCases/authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it('should be able get all balances user', async () => {
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

    const response = await getBalanceUseCase.execute({ user_id: id as string });

    expect(response).toHaveProperty('statement');
    expect(response).toHaveProperty('balance');
  });
});
