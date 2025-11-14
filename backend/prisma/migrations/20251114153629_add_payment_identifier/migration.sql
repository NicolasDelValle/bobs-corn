/*
  Warnings:

  - A unique constraint covering the columns `[identifierHash]` on the table `payment_methods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `identifierHash` to the `payment_methods` table without a default value. This is not possible if the table is not empty.

*/

-- Paso 1: Agregar columnas como opcionales primero
ALTER TABLE "payment_methods" ADD COLUMN "identifierHash" TEXT;
ALTER TABLE "payment_methods" ADD COLUMN "lastFourDigits" TEXT;

-- Paso 2: Generar hash único para registros existentes usando el nombre + UUID
UPDATE "payment_methods" 
SET "identifierHash" = encode(sha256((name || '-' || id)::bytea), 'hex')
WHERE "identifierHash" IS NULL;

-- Paso 3: Hacer la columna NOT NULL ahora que tiene valores
ALTER TABLE "payment_methods" ALTER COLUMN "identifierHash" SET NOT NULL;

-- Paso 4: Crear índices
CREATE UNIQUE INDEX "payment_methods_identifierHash_key" ON "payment_methods"("identifierHash");
CREATE INDEX "payment_methods_identifierHash_idx" ON "payment_methods"("identifierHash");

