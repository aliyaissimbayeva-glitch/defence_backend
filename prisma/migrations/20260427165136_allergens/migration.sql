-- CreateEnum
CREATE TYPE "Allergen" AS ENUM ('NUTS', 'DAIRY', 'GLUTEN', 'EGGS', 'SOY', 'FISH');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "allergens" "Allergen"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "allergies" "Allergen"[];
