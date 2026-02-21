import { Router } from 'express';
import { extractTenantContextMiddleware } from '../../middleware';
import {
  addCard,
  archiveCards,
  deleteArchivedCard,
  getBoardState,
  moveCard,
  restoreArchivedCard,
} from './board.controller';

const boardRouter = Router();

boardRouter.use(extractTenantContextMiddleware);

boardRouter.get('/', getBoardState);
boardRouter.post('/cards', addCard);
boardRouter.patch('/cards/:cardId/move', moveCard);
boardRouter.post('/cards/archive', archiveCards);
boardRouter.post('/cards/:cardId/restore', restoreArchivedCard);
boardRouter.delete('/cards/:cardId/archive', deleteArchivedCard);

export default boardRouter;
