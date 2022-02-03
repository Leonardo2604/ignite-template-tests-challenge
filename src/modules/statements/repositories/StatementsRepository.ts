import { inject, injectable } from "tsyringe";
import { getRepository, Repository } from "typeorm";
import { Transfer } from "../../transfers/entities/Transfer";
import { ITransfersRepository } from "../../transfers/repositories/ITransfersRepository";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IBalanceItemDTO, OperationType } from "./IBalanceItemDTO";
import { IStatementsRepository } from "./IStatementsRepository";

@injectable()
export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor(
    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,
  ) {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: IBalanceItemDTO[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const transfersOut = await this.transfersRepository.findBySenderId(user_id);
    const transfersIn = await this.transfersRepository.findByRecipientId(user_id);

    console.log({
      transfersOut,
      transfersIn
    })

    const balanceItems: IBalanceItemDTO[] = [];

    balanceItems.push(...statement.map<IBalanceItemDTO>(({
      id,
      amount,
      description,
      created_at,
      updated_at,
      type
    }: Statement) => ({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at,
    })));

    balanceItems.push(...transfersOut.map<IBalanceItemDTO>(({
      id,
      amount,
      description,
      createdAt,
      senderId,
      updatedAt
    }: Transfer) => ({
      id,
      amount,
      sender_id: senderId,
      description,
      type: OperationType.TRANSFER_OUT,
      created_at: createdAt,
      updated_at: updatedAt
    })))

    balanceItems.push(...transfersIn.map<IBalanceItemDTO>(({
      id,
      amount,
      description,
      createdAt,
      recipientId,
      updatedAt
    }: Transfer) => ({
      id,
      amount,
      recipient_id: recipientId,
      description,
      type: OperationType.TRANSFER_IN,
      created_at: createdAt,
      updated_at: updatedAt
    })))

    console.log(balanceItems);

    const balance = balanceItems
      .sort((a, b) => {
        return a.created_at.getTime() - b.created_at.getTime();
      })
      .reduce((acc, operation) => {
        if (operation.type === 'deposit' || operation.type === 'transferIn') {
          return acc + operation.amount;
        } else {
          return acc - operation.amount;
        }
      }, 0);

    if (with_statement) {
      return {
        statement: balanceItems,
        balance
      }
    }

    return { balance }
  }
}
