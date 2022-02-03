import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase';

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: senderId } = request.user;
    const { user_id: recipientId } = request.params;
    const { amount, description } = request.body;


    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({
      senderId,
      recipientId,
      amount: Number(amount),
      description
    });

    return response.status(201).json(transfer);
  }
}
