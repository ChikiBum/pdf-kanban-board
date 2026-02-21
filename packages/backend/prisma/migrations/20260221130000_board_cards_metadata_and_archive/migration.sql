-- Alter cards table for board-first workflow
ALTER TABLE "cards"
  ALTER COLUMN "document_id" DROP NOT NULL;

ALTER TABLE "cards"
  ADD COLUMN "title" VARCHAR(255) NOT NULL DEFAULT 'Untitled',
  ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "is_archived" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "archived_at" TIMESTAMP(6);

-- Adjust FK to support nullable document reference
ALTER TABLE "cards" DROP CONSTRAINT "cards_document_id_fkey";

ALTER TABLE "cards"
  ADD CONSTRAINT "cards_document_id_fkey"
  FOREIGN KEY ("document_id") REFERENCES "documents"("id")
  ON DELETE SET NULL
  ON UPDATE NO ACTION;

ALTER TABLE "cards"
  ALTER COLUMN "title" DROP DEFAULT;
