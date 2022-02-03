import { Router } from 'express';
import { CreateTransferController } from '../modules/transfers/useCases/createTransfer/CreateTransfersController';

import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const transferRouter = Router();
const createTransferController = new CreateTransferController();

transferRouter.use(ensureAuthenticated);

transferRouter.post('/transfers/:user_id', createTransferController.execute);

export { transferRouter };
