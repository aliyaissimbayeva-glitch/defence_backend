/*
  Warnings:

  - You are about to drop the column `shelterId` on the `Delivery` table. All the data in the column will be lost.
  - Added the required column `driverId` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_shelterId_fkey";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "shelterId",
ADD COLUMN     "driverId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
