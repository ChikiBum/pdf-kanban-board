// File: packages/backend/src/modules/document/document.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const documentService = {
  async createDocument({
    orgId,
    title,
    filePath,
    status = 'Received',
    uploadedBy,
  }: {
    orgId: number | string;
    title: string;
    filePath: string;
    status?: string;
    uploadedBy?: number;
  }) {
    return prisma.documents.create({
      data: {
        org_id: Number(orgId), // Convert to number here
        title,
        file_path: filePath,
        status,
        uploaded_by: uploadedBy,
      },
    });
  },

  async createDocumentVersion({
    documentId,
    versionNumber,
    filePath,
  }: {
    documentId: number;
    versionNumber: number;
    filePath: string;
  }) {
    return prisma.document_versions.create({
      data: {
        document_id: documentId,
        version_number: versionNumber,
        file_path: filePath,
      },
    });
  },
};
