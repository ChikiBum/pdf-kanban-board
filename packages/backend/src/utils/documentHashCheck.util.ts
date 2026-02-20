import type { CreateDocumentDto, Document } from '@pdf-kanban-board/shared/src/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkExistingHash = async (data: CreateDocumentDto): Promise<Document | null> => {
  return await prisma.documents.findFirst({
    where: { orgId: data.orgId, contentHash: data.contentHash, uploadedBy: data.uploadedBy },
  });
};

export { checkExistingHash };
