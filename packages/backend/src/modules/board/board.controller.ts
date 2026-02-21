import type { RequestHandler } from 'express-serve-static-core';
import {
  addCardService,
  archiveCardsService,
  deleteArchivedCardService,
  getBoardStateService,
  moveCardService,
  restoreArchivedCardService,
} from './board.service';

const getBoardState: RequestHandler = async (req, res, next) => {
  try {
    const orgId = req.tenantContext?.orgId ?? 1;
    const state = await getBoardStateService(orgId);
    res.status(200).json(state);
  } catch (error) {
    next(error);
  }
};

const addCard: RequestHandler = async (req, res, next) => {
  try {
    const orgId = req.tenantContext?.orgId ?? 1;
    const title = String(req.body.title ?? '').trim();
    const description = String(req.body.description ?? '').trim();

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const state = await addCardService(orgId, { title, description });
    res.status(201).json(state);
  } catch (error) {
    next(error);
  }
};

const moveCard: RequestHandler = async (req, res, next) => {
  try {
    const orgId = req.tenantContext?.orgId ?? 1;
    const cardId = Number.parseInt(req.params.cardId, 10);
    const status = String(req.body.status ?? '') as 'TODO' | 'IN_PROGRESS' | 'DONE';

    if (Number.isNaN(cardId)) {
      return res.status(400).json({ message: 'Invalid cardId' });
    }

    if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const state = await moveCardService(orgId, { cardId, status });
    res.status(200).json(state);
  } catch (error) {
    next(error);
  }
};

const archiveCards: RequestHandler = async (req, res, next) => {
  try {
    const orgId = req.tenantContext?.orgId ?? 1;
    const idsRaw = Array.isArray(req.body.cardIds) ? req.body.cardIds : [];
    const cardIds = idsRaw
      .map((id: unknown) => Number.parseInt(String(id), 10))
      .filter((id: number) => !Number.isNaN(id));

    const state = await archiveCardsService(orgId, cardIds);
    res.status(200).json(state);
  } catch (error) {
    next(error);
  }
};

const restoreArchivedCard: RequestHandler = async (req, res, next) => {
  try {
    const orgId = req.tenantContext?.orgId ?? 1;
    const cardId = Number.parseInt(req.params.cardId, 10);

    if (Number.isNaN(cardId)) {
      return res.status(400).json({ message: 'Invalid cardId' });
    }

    const state = await restoreArchivedCardService(orgId, cardId);
    res.status(200).json(state);
  } catch (error) {
    next(error);
  }
};

const deleteArchivedCard: RequestHandler = async (req, res, next) => {
  try {
    const orgId = req.tenantContext?.orgId ?? 1;
    const cardId = Number.parseInt(req.params.cardId, 10);

    if (Number.isNaN(cardId)) {
      return res.status(400).json({ message: 'Invalid cardId' });
    }

    const state = await deleteArchivedCardService(orgId, cardId);
    res.status(200).json(state);
  } catch (error) {
    next(error);
  }
};

export { addCard, archiveCards, deleteArchivedCard, getBoardState, moveCard, restoreArchivedCard };
