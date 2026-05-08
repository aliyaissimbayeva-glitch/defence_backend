/*
  Warnings:

  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" TEXT NOT NULL;
