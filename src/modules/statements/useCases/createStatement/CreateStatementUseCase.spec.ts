import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let userRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('create statement', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      statementRepository
    );
  })

  it('should be able to create a statement', async () => {
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

    expect(statement).toHaveProperty('id');
  })
})
