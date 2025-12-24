import type {
  CreateDocumentDto,
  CreateDocumentVersionDto,
  Document,
  DocumentVersion,
} from '@pdf-kanban-board/shared/src/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const documentService = {
  async createDocument(data: CreateDocumentDto): Promise<Document> {
    console.log('data', data);
    return prisma.documents.create({
      data: {
        orgId: data.orgId,
        title: data.title,
        filePath: data.filePath,
        uploadedBy: data.uploadedBy,
      },
    });
  },

  async createDocumentVersion(data: CreateDocumentVersionDto): Promise<DocumentVersion> {
    return prisma.document_versions.create({
      data: {
        documentId: data.documentId,
        versionNumber: data.versionNumber,
        filePath: data.filePath,
      },
    });
  },
};
