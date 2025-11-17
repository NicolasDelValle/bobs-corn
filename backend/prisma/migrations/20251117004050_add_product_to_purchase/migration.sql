/*
  Warnings:

  - Added the required column `productId` to the `purchases` table without a default value. This is not possible if the table is not empty.

*/

-- First, add the column as nullable
ALTER TABLE "purchases" ADD COLUMN "productId" TEXT;

-- Get the first product ID and assign it to all existing purchases
UPDATE "purchases" 
SET "productId" = (
  SELECT "id" 
  FROM "products" 
  ORDER BY "order" ASC, "createdAt" ASC 
  LIMIT 1
) 
WHERE "productId" IS NULL;

-- Now make the column NOT NULL
ALTER TABLE "purchases" ALTER COLUMN "productId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "purchases_productId_idx" ON "purchases"("productId");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
