export enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER_IN = 'transferIn',
  TRANSFER_OUT = 'transferOut',
}

export interface IBalanceItemDTO {
  id?: string;
  sender_id?: string;
  recipient_id?: string;
  amount: number;
  description: string;
  type: OperationType,
  created_at: Date,
  updated_at: Date,
}
