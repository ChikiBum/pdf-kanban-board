import type { BoardTask, ColumnId } from '../store/boardWithoutLibrary.slice';

type BoardStateResponse = {
  tasks: BoardTask[];
  archivedTasks: BoardTask[];
};

const parseBoardResponse = async (response: Response): Promise<BoardStateResponse> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Board API request failed');
  }

  return response.json() as Promise<BoardStateResponse>;
};

const fetchBoardState = async (): Promise<BoardStateResponse> => {
  const response = await fetch('/api/board');
  return parseBoardResponse(response);
};

const createBoardCard = async (payload: { title: string; description: string }) => {
  const response = await fetch('/api/board/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return parseBoardResponse(response);
};

const moveBoardCard = async (payload: { cardId: string; status: ColumnId }) => {
  const response = await fetch(`/api/board/cards/${payload.cardId}/move`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: payload.status }),
  });

  return parseBoardResponse(response);
};

const archiveBoardCards = async (cardIds: string[]) => {
  const response = await fetch('/api/board/cards/archive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardIds }),
  });

  return parseBoardResponse(response);
};

const restoreArchivedBoardCard = async (cardId: string) => {
  const response = await fetch(`/api/board/cards/${cardId}/restore`, {
    method: 'POST',
  });

  return parseBoardResponse(response);
};

const deleteArchivedBoardCard = async (cardId: string) => {
  const response = await fetch(`/api/board/cards/${cardId}/archive`, {
    method: 'DELETE',
  });

  return parseBoardResponse(response);
};

export {
  archiveBoardCards,
  createBoardCard,
  deleteArchivedBoardCard,
  fetchBoardState,
  moveBoardCard,
  restoreArchivedBoardCard,
};
