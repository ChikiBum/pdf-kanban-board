import { unlink } from 'node:fs/promises';
import type {
  CreateDocumentDto,
  CreateDocumentVersionDto,
  Document,
  DocumentVersion,
} from '@pdf-kanban-board/shared/src/types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createDocument = async (data: CreateDocumentDto): Promise<Document> => {
  console.log('data', data);
  const existingDocument = await prisma.documents.findFirst({
    where: {
      orgId: data.orgId,
      contentHash: data.contentHash,
      uploadedBy: data.uploadedBy,
    },
  });

  if (existingDocument) {
    try {
      await unlink(data.filePath);
    } catch (error) {
      console.error('Error deleting duplicate file:', error);
    }

    return {
      isDuplicate: true,
      message: 'Document with the same content already exists',
      ...existingDocument,
    };
  }

  return prisma.documents.create({
    data: {
      orgId: data.orgId,
      title: data.title,
      filePath: data.filePath,
      uploadedBy: data.uploadedBy,
      originalName: data.originalName,
      contentHash: data.contentHash,
    },
  });
};

const createDocumentVersion = async (data: CreateDocumentVersionDto): Promise<DocumentVersion> => {
  return prisma.document_versions.create({
    data: {
      documentId: data.documentId,
      versionNumber: data.versionNumber,
      filePath: data.filePath,
    },
  });
};

const getAllDocuments = async (): Promise<Document[]> => {
  return prisma.documents.findMany();
};

export { createDocument, createDocumentVersion, getAllDocuments };
