import { PrismaClient } from '@prisma/client';

type FrontendStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

type BoardTaskDto = {
  id: string;
  title: string;
  description: string;
  status: FrontendStatus;
};

type BoardStateDto = {
  tasks: BoardTaskDto[];
  archivedTasks: BoardTaskDto[];
};

const prisma = new PrismaClient();

const STATUS_TO_COLUMN_NAME: Record<FrontendStatus, string> = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

const DEFAULT_COLUMNS: FrontendStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const DEFAULT_BOARD_NAME = 'Default Board';

const ensureBoardForOrg = async (orgId: number): Promise<{ boardId: number }> => {
  await prisma.organizations.upsert({
    where: { id: orgId },
    update: {},
    create: {
      id: orgId,
      name: `Organization ${orgId}`,
    },
  });

  let board = await prisma.boards.findFirst({
    where: {
      orgId,
      name: DEFAULT_BOARD_NAME,
    },
  });

  if (!board) {
    board = await prisma.boards.create({
      data: {
        orgId,
        name: DEFAULT_BOARD_NAME,
      },
    });
  }

  const existingColumns = await prisma.columns.findMany({
    where: { boardId: board.id },
  });

  const existingNames = new Set(existingColumns.map((col) => col.name));

  for (const [index, colName] of DEFAULT_COLUMNS.entries()) {
    if (existingNames.has(colName)) continue;
    await prisma.columns.create({
      data: {
        boardId: board.id,
        name: colName,
        position: index,
      },
    });
  }

  return { boardId: board.id };
};

const mapCardToTask = (card: {
  id: number;
  title: string;
  description: string;
  columns: { name: string };
}): BoardTaskDto => {
  const columnName = card.columns.name as FrontendStatus;
  const status = DEFAULT_COLUMNS.includes(columnName) ? columnName : 'TODO';
  return {
    id: card.id.toString(),
    title: card.title,
    description: card.description,
    status,
  };
};

const getBoardStateService = async (orgId: number): Promise<BoardStateDto> => {
  const { boardId } = await ensureBoardForOrg(orgId);

  const activeCards = await prisma.cards.findMany({
    where: {
      columnId: {
        in: (
          await prisma.columns.findMany({
            where: { boardId },
            select: { id: true },
          })
        ).map((col) => col.id),
      },
      isArchived: false,
    },
    include: {
      columns: {
        select: { name: true },
      },
    },
    orderBy: [{ columns: { position: 'asc' } }, { position: 'asc' }, { id: 'asc' }],
  });

  const archivedCards = await prisma.cards.findMany({
    where: {
      columnId: {
        in: (
          await prisma.columns.findMany({
            where: { boardId },
            select: { id: true },
          })
        ).map((col) => col.id),
      },
      isArchived: true,
    },
    include: {
      columns: {
        select: { name: true },
      },
    },
    orderBy: [{ archivedAt: 'desc' }, { id: 'desc' }],
  });

  return {
    tasks: activeCards.map(mapCardToTask),
    archivedTasks: archivedCards.map(mapCardToTask),
  };
};

const getColumnIdByStatus = async (boardId: number, status: FrontendStatus): Promise<number> => {
  const column = await prisma.columns.findFirst({
    where: {
      boardId,
      name: STATUS_TO_COLUMN_NAME[status],
    },
  });

  if (!column) {
    throw new Error(`Column ${status} not found`);
  }

  return column.id;
};

const getNextPositionForColumn = async (columnId: number): Promise<number> => {
  const last = await prisma.cards.findFirst({
    where: { columnId, isArchived: false },
    orderBy: { position: 'desc' },
    select: { position: true },
  });

  return (last?.position ?? -1) + 1;
};

const addCardService = async (orgId: number, payload: { title: string; description: string }) => {
  const { boardId } = await ensureBoardForOrg(orgId);
  const todoColumnId = await getColumnIdByStatus(boardId, 'TODO');
  const nextPosition = await getNextPositionForColumn(todoColumnId);

  await prisma.cards.create({
    data: {
      title: payload.title,
      description: payload.description,
      documentId: null,
      columnId: todoColumnId,
      position: nextPosition,
      isArchived: false,
      archivedAt: null,
    },
  });

  return getBoardStateService(orgId);
};

const moveCardService = async (
  orgId: number,
  payload: { cardId: number; status: FrontendStatus },
) => {
  const { boardId } = await ensureBoardForOrg(orgId);
  const targetColumnId = await getColumnIdByStatus(boardId, payload.status);
  const nextPosition = await getNextPositionForColumn(targetColumnId);

  await prisma.cards.update({
    where: { id: payload.cardId },
    data: {
      columnId: targetColumnId,
      position: nextPosition,
      isArchived: false,
      archivedAt: null,
    },
  });

  return getBoardStateService(orgId);
};

const archiveCardsService = async (orgId: number, cardIds: number[]) => {
  if (cardIds.length === 0) {
    return getBoardStateService(orgId);
  }

  await prisma.cards.updateMany({
    where: {
      id: { in: cardIds },
    },
    data: {
      isArchived: true,
      archivedAt: new Date(),
    },
  });

  return getBoardStateService(orgId);
};

const restoreArchivedCardService = async (orgId: number, cardId: number) => {
  const { boardId } = await ensureBoardForOrg(orgId);
  const todoColumnId = await getColumnIdByStatus(boardId, 'TODO');
  const nextPosition = await getNextPositionForColumn(todoColumnId);

  await prisma.cards.update({
    where: { id: cardId },
    data: {
      isArchived: false,
      archivedAt: null,
      columnId: todoColumnId,
      position: nextPosition,
    },
  });

  return getBoardStateService(orgId);
};

const deleteArchivedCardService = async (orgId: number, cardId: number) => {
  await prisma.cards.delete({
    where: { id: cardId },
  });

  return getBoardStateService(orgId);
};

export {
  addCardService,
  archiveCardsService,
  deleteArchivedCardService,
  getBoardStateService,
  moveCardService,
  restoreArchivedCardService,
};
