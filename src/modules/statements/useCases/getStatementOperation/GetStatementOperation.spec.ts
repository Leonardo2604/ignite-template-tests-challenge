import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('get statement Operation', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      statementRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userRepository,
      statementRepository
    );
  })

  it('should be able to get user statement', async () => {
    const user = await userRepository.create({
      email: 'leonardo@gmail.com',
      name: 'leonardo',
      password: '123'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 120,
      description: 'Testing...',
      type: OperationType.DEPOSIT
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(result.id).toBe(statement.id);
    expect(result.user_id).toBe(user.id);
  })
})
