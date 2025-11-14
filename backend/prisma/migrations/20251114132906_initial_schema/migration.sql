-- CreateTable
CREATE TABLE "config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "paymentMethodId" TEXT NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limits" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "paymentMethodId" TEXT,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "config_key_key" ON "config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "clients_sessionId_key" ON "clients"("sessionId");

-- CreateIndex
CREATE INDEX "clients_sessionId_idx" ON "clients"("sessionId");

-- CreateIndex
CREATE INDEX "purchases_clientId_purchasedAt_idx" ON "purchases"("clientId", "purchasedAt" DESC);

-- CreateIndex
CREATE INDEX "purchases_paymentMethodId_idx" ON "purchases"("paymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_name_key" ON "payment_methods"("name");

-- CreateIndex
CREATE INDEX "rate_limits_clientId_windowStart_idx" ON "rate_limits"("clientId", "windowStart" DESC);

-- CreateIndex
CREATE INDEX "rate_limits_paymentMethodId_windowStart_idx" ON "rate_limits"("paymentMethodId", "windowStart" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "rate_limits_clientId_paymentMethodId_windowStart_key" ON "rate_limits"("clientId", "paymentMethodId", "windowStart");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_limits" ADD CONSTRAINT "rate_limits_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_limits" ADD CONSTRAINT "rate_limits_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
