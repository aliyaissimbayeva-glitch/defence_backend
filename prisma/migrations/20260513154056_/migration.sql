-- AlterEnum
ALTER TYPE "Allergen" ADD VALUE 'NONE';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
