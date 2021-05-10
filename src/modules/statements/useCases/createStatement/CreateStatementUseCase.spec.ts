import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from '../../../users/useCases/authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from './CreateStatementUseCase';


let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able create a new deposit', async () => {
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

    const response = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Deposit'
    });

    expect(response).toHaveProperty('id');
  });

  it('should be able create a new withdraw', async () => {
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

    await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'deposit'
    });

    const response = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: 'withdraw'
    });

    expect(response).toHaveProperty('id');
  });
});
