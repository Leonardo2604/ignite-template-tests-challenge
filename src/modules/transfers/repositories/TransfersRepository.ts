import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { ITransfersRepository } from "./ITransfersRepository";

export class TransfersRepository implements ITransfersRepository {

  private readonly repository: Repository<Transfer>;

  constructor() {
    this.repository = getRepository(Transfer);
  }

  async create({ senderId, recipientId, amount, description }: ICreateTransferDTO): Promise<Transfer> {
    const transfer = this.repository.create({
      senderId,
      recipientId,
      description,
      amount
    });

    return this.repository.save(transfer);
  }

  findByRecipientId(recipientId: string): Promise<Transfer[]> {
    return this.repository.find({
      where: { recipientId }
    });
  }

  findBySenderId(senderId: string): Promise<Transfer[]> {
    return this.repository.find({
      where: { senderId }
    });
  }
}
