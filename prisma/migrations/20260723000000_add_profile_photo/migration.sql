-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" BYTEA,
ADD COLUMN     "photoType" TEXT,
ADD COLUMN     "hasPhoto" BOOLEAN NOT NULL DEFAULT false;
