import { inject, injectable } from "tsyringe";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ senderId, recipientId, description, amount }: ICreateTransferDTO) {
    const sender = await this.usersRepository.findById(senderId);

    if (!sender) {
      throw new CreateTransferError.SenderNotFound();
    }

    const recipient = await this.usersRepository.findById(recipientId);

    if (!recipient) {
      throw new CreateTransferError.RecipientNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: senderId });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds()
    }

    const transfer = await this.transfersRepository.create({
      senderId,
      recipientId,
      description,
      amount,
    });

    return transfer;
  }
}
