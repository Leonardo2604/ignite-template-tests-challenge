import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";

export interface ITransfersRepository {
  create(data: ICreateTransferDTO): Promise<Transfer>;

  findByRecipientId(recipientId: string): Promise<Transfer[]>

  findBySenderId(senderId: string): Promise<Transfer[]>
}
