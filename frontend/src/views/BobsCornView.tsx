import React, { useState } from 'react';
import type { PaymentType } from '@/types/common.types';
import { AppHeader } from '@/components/Header';
import { ProductGrid } from '@/components/ProductGrid';
import { PurchaseSection } from '@/components/PurchaseSection/PurchaseSection';
import { UserStats } from '@/components/UserStats/UserStats';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { usePurchaseStore } from '@/hooks/usePurchaseStore';
import { useProducts } from '@/hooks/useProducts';
import { usePurchaseLogic } from '@/hooks/usePurchaseLogic';
import { useTimeFormatter } from '@/hooks/useTimeFormatter';

export const BobsCornView: React.FC = () => {
  const [purchaseError, setPurchaseError] = useState<Error | null>(null);

  const {
    sessionId,
    sessionName,
    cornCount,
    isWaiting,
    waitingTimeLeft,
    canPurchase,
    createPurchase
  } = usePurchaseStore();

  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { formatTime } = useTimeFormatter();

  const {
    isAccordionOpen,
    isProcessing,
    selectedProduct,
    selectedProductData,
    handlePurchase: handlePurchaseLogic,
    handleAccordionToggle,
    handleProductSelect
  } = usePurchaseLogic({ products, createPurchase });

  const handlePurchase = async (data: { paymentMethod: PaymentType; cardDetails?: unknown }) => {
    try {
      setPurchaseError(null);
      await handlePurchaseLogic(data);
    } catch (error) {
      setPurchaseError(error as Error);
    }
  };

  const handleAccordionToggleWrapper = () => {
    handleAccordionToggle(canPurchase);
  };

  const retryPurchase = () => {
    setPurchaseError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <ProductGrid
          products={products}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
          loading={productsLoading}
          error={productsError}
        />

        {purchaseError && (
          <ErrorDisplay error={purchaseError} onRetry={retryPurchase} />
        )}

        {selectedProductData && (
          <div className="max-w-2xl mx-auto">
            <PurchaseSection
              isAccordionOpen={isAccordionOpen}
              onAccordionToggle={handleAccordionToggleWrapper}
              canPurchase={canPurchase}
              isProcessing={isProcessing}
              isWaiting={isWaiting}
              waitingTimeLeft={waitingTimeLeft}
              formatTime={formatTime}
              onPurchase={handlePurchase}
              selectedProduct={selectedProductData}
            />
          </div>
        )}

        <div className="mt-8 max-w-2xl mx-auto">
          <UserStats
            sessionId={sessionId}
            sessionName={sessionName}
            cornCount={cornCount}
          />
        </div>
      </main>
    </div>
  );
};