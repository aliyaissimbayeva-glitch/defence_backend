/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `lng` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `listingId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `allergies` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - Added the required column `availableQty` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentPrice` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryAt` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initialPrice` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consumerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DecayState" AS ENUM ('FRESH', 'DISCOUNTED', 'FREE', 'COMPOST');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DRIVER_ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_listingId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "expiresAt",
DROP COLUMN "lat",
DROP COLUMN "lng",
DROP COLUMN "ownerId",
DROP COLUMN "price",
DROP COLUMN "status",
ADD COLUMN     "availableQty" INTEGER NOT NULL,
ADD COLUMN     "currentPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "decayState" "DecayState" NOT NULL DEFAULT 'FRESH',
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "expiryAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ingredients" TEXT[],
ADD COLUMN     "initialPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "restaurantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "listingId",
DROP COLUMN "quantity",
DROP COLUMN "userId",
ADD COLUMN     "consumerId" INTEGER NOT NULL,
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "allergies",
DROP COLUMN "password",
DROP COLUMN "refreshToken",
ADD COLUMN     "allergens" "Allergen"[],
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "verificationToken" TEXT;

-- DropEnum
DROP TYPE "FoodStatus";

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delivery" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "shelterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shelter" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Shelter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionBid" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "bidderId" INTEGER NOT NULL,
    "feeOffer" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuctionBid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "raterId" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverRoute" (
    "id" SERIAL NOT NULL,
    "driverId" INTEGER NOT NULL,
    "stops" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DriverRoute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_userId_key" ON "Restaurant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "Driver"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Shelter_userId_key" ON "Shelter"("userId");

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "Shelter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shelter" ADD CONSTRAINT "Shelter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverRoute" ADD CONSTRAINT "DriverRoute_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
