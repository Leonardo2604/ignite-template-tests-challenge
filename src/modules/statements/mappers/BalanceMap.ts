import { IBalanceItemDTO } from "../repositories/IBalanceItemDTO";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: IBalanceItemDTO[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      recipient_id,
      sender_id,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        sender_id,
        recipient_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
