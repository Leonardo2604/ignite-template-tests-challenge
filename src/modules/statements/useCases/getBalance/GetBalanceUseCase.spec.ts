import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('get balance', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      statementRepository
    );

    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      userRepository
    );
  })

  it('should be able to get a balance', async () => {
    const user = await userRepository.create({
      email: 'leonardo@gmail.com',
      name: 'leonardo',
      password: '123'
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 120,
      description: 'Testing...',
      type: OperationType.DEPOSIT
    });

    const result = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(result).toHaveProperty('balance');
    expect(result).toHaveProperty('statement');
    expect(result.balance).toBe(120);
    expect(result.statement.length).toBe(1);
  })
})
