import { unlink } from 'node:fs/promises';
import type {
  CreateDocumentDto,
  CreateDocumentVersionDto,
  Document,
  DocumentVersion,
} from '@pdf-kanban-board/shared/src/types';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';
import { storeFile } from '../storage';

const prisma = new PrismaClient();

const createDocumentService = async (params: {
  file: Express.Multer.File;
  title: string;
  orgId: string;
  userId?: number;
}): Promise<Document> => {
  const orgId = parseInt(params.orgId, 10);
  const uploadedFile = await storeFile(params.file, { orgId });

  const contentHash = createHash('sha256').update(params.file.buffer).digest('hex');

  const data: CreateDocumentDto = {
    title: params.title,
    filePath: uploadedFile.path,
    orgId,
    uploadedBy: params.userId ?? null,
    originalName: uploadedFile.originalName,
    contentHash,
  };

  const existingDocument = await prisma.documents.findFirst({
    where: {
      orgId,
      contentHash,
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
      orgId,
      title: data.title,
      filePath: data.filePath,
      uploadedBy: data.uploadedBy,
      originalName: data.originalName,
      contentHash: data.contentHash,
    },
  });
};

const createDocumentVersionService = async (
  data: CreateDocumentVersionDto,
): Promise<DocumentVersion> => {
  return prisma.document_versions.create({
    data: {
      documentId: data.documentId,
      versionNumber: data.versionNumber,
      filePath: data.filePath,
    },
  });
};

const getAllDocumentsService = async (): Promise<Document[]> => {
  return prisma.documents.findMany();
};

const getDocumentByIdService = async (id: number): Promise<Document | null> => {
  return prisma.documents.findUnique({
    where: { id },
  });
};

const deleteDocumentByIdService = async (id: number): Promise<void> => {
  await prisma.documents.delete({
    where: { id },
  });
};

export {
  createDocumentService,
  createDocumentVersionService,
  getAllDocumentsService,
  getDocumentByIdService,
  deleteDocumentByIdService,
};
