import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '@/config/app';
import type { PaymentMethod } from '@/config/paymentMethods';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { PurchaseSection } from '@/components/PurchaseSection/PurchaseSection';
import { usePurchaseStore } from '@/hooks/usePurchaseStore';

export const BobsCornView: React.FC = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Usar el hook de purchase store
  const {
    sessionId,
    isWaiting,
    waitingTimeLeft,
    canPurchase,
    registerPurchase
  } = usePurchaseStore();

  const handlePurchase = async (data: { paymentMethod: PaymentMethod; cardDetails?: unknown }) => {
    setIsProcessing(true);

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Compra procesada:', {
      ...data,
      sessionId,
      timestamp: new Date().toISOString()
    });

    setIsProcessing(false);
    setIsAccordionOpen(false);
    registerPurchase(); // Registrar la compra en el store
  };

  const handleAccordionToggle = () => {
    if (canPurchase && !isProcessing) {
      setIsAccordionOpen(!isAccordionOpen);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-green-100"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              🌽 {APP_CONFIG.app.name}
            </h1>
            <p className="text-lg text-green-600">{APP_CONFIG.app.tagline}</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Producto */}
          <ProductCard delay={0.2} />

          {/* Formulario de Compra */}
          <PurchaseSection
            isAccordionOpen={isAccordionOpen}
            onAccordionToggle={handleAccordionToggle}
            canPurchase={canPurchase}
            isProcessing={isProcessing}
            isWaiting={isWaiting}
            waitingTimeLeft={waitingTimeLeft}
            formatTime={formatTime}
            onPurchase={handlePurchase}
          />
        </div>

        {/* Debug Info (solo en desarrollo) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
            <strong>Debug Info:</strong> Session ID: {sessionId.substring(0, 20)}...
          </div>
        )}
      </main>
    </div>
  );
};