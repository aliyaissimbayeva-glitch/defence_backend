-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_consumerId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shelterId" INTEGER,
ALTER COLUMN "consumerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
