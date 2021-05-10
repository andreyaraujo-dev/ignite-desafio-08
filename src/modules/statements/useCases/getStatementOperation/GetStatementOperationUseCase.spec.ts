import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from '../../../users/useCases/authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '../../../users/useCases/createUser/ICreateUserDTO';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';



let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

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
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('should be able get a statement by id', async () => {
    const userData: ICreateUserDTO = {
      name: "Test",
      email: "example.com.br",
      password: "123456",
    };

    await createUserUseCase.execute(userData);

    const { user } = await authenticateUserUseCase.execute({
      email: 'example.com.br',
      password: '123456',
    });

    const { id } = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Deposit'
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: id as string
    });

    expect(response).toHaveProperty('id');
  });

});
