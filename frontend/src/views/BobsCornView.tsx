import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '@/config/app';
import type { PaymentType } from '@/types/common.types';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { PurchaseSection } from '@/components/PurchaseSection/PurchaseSection';
import { UserStats } from '@/components/UserStats/UserStats';
import { usePurchaseStore } from '@/hooks/usePurchaseStore';
import { useProducts } from '@/hooks/useProducts';

import choclotin from '@/assets/chcolotin.png';

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
}

export const BobsCornView: React.FC = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Hooks
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

  // Seleccionar el primer producto por defecto
  React.useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0].id);
    }
  }, [products, selectedProduct]);

  const handlePurchase = async (data: { paymentMethod: PaymentType; cardDetails?: unknown }) => {
    if (!selectedProduct) {
      console.error('No product selected');
      return;
    }

    setIsProcessing(true);

    try {
      // Hacer la compra real a través de la API
      const currentProduct = products.find(p => p.id === selectedProduct);
      console.log('Iniciando compra:', {
        productId: selectedProduct,
        product: currentProduct,
        paymentMethod: data.paymentMethod,
        sessionId,
      });

      const response = await createPurchase({
        productId: selectedProduct,
        paymentMethod: data.paymentMethod,
        cardDetails: data.cardDetails as CardDetails | undefined
      });

      console.log('Compra exitosa:', response);

      setIsAccordionOpen(false);
    } catch (error) {
      console.error('Error en la compra:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
      alert('Error al procesar la compra. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
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

  const selectedProductData = products.find(p => p.id === selectedProduct);

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
            <h1 className="text-4xl font-bold text-green-800 mb-2 flex items-center justify-center">
              <img
                src={choclotin}
                alt="Choclotin Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <span className='flex flex-col items-start'>
                {APP_CONFIG.app.name}

                <p className="text-lg text-green-600">{APP_CONFIG.app.tagline}</p>
              </span>
            </h1>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Productos Grid */}
        {productsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin text-4xl mb-4">🌽</div>
            <p className="text-green-600">Cargando productos...</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-8 text-red-600">
            <p>Error cargando productos: {productsError}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className={`cursor-pointer transition-all duration-200 ${selectedProduct === product.id
                  ? 'ring-2 ring-green-500 ring-offset-2'
                  : 'hover:scale-105'
                  }`}
                onClick={() => setSelectedProduct(product.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ProductCard
                  delay={index * 0.1}
                  product={product}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Formulario de Compra */}
        {selectedProductData && (
          <div className="max-w-2xl mx-auto">
            <PurchaseSection
              isAccordionOpen={isAccordionOpen}
              onAccordionToggle={handleAccordionToggle}
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

        {/* Estadísticas del usuario */}
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