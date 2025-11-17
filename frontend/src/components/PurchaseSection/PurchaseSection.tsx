import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '@/config/app';
import type { PaymentType } from '@/types/common.types';
import type { Product } from '@/services/productApiService';
import { Accordion } from '@/components/Accordion/Accordion';
import { PaymentForm } from '@/components/PaymentForm/PaymentForm';
import { PurchaseSuccess } from '@/components/PurchaseSuccess/PurchaseSuccess';
import { ShoppingBasket } from 'lucide-react';

interface PurchaseSectionProps {
  isAccordionOpen: boolean;
  onAccordionToggle: () => void;
  canPurchase: boolean;
  isProcessing: boolean;
  isWaiting: boolean;
  waitingTimeLeft: number;
  formatTime: (seconds: number) => string;
  onPurchase: (data: { paymentMethod: PaymentType; cardDetails?: unknown }) => Promise<void>;
  selectedProduct?: Product;
}

export const PurchaseSection: React.FC<PurchaseSectionProps> = ({
  isAccordionOpen,
  onAccordionToggle,
  canPurchase,
  isProcessing,
  isWaiting,
  waitingTimeLeft,
  formatTime,
  onPurchase,
  selectedProduct,
}) => {
  // Usar producto seleccionado o fallback a configuración estática
  const displayProduct = selectedProduct || {
    name: APP_CONFIG.product.name,
    price: APP_CONFIG.product.price,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <Accordion
          isOpen={isAccordionOpen}
          onToggle={onAccordionToggle}
          disabled={!canPurchase || isProcessing}
          trigger={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <ShoppingBasket width={24} />
                <div>
                  <div className='flex flex-col items-start'>
                    <h3 className="text-lg font-semibold text-green-800">
                      {selectedProduct && (
                        selectedProduct.name
                      )}
                    </h3>
                    <p className="text-sm text-gray-600/80 ">
                      {isWaiting ? 'Compra Realizada' : 'Comprar Choclo'}
                    </p>
                  </div>
                  {isWaiting && (
                    <p className="text-sm text-orange-600">
                      Próxima compra en: {formatTime(waitingTimeLeft)}
                    </p>
                  )}
                  {isProcessing && (
                    <p className="text-sm text-blue-600">
                      Procesando compra...
                    </p>
                  )}
                </div>
              </div>
              <div className="text-lg font-bold text-xl text-green-600">
                ${displayProduct.price.toFixed(2)}
              </div>
            </div>
          }
        >
          <PaymentForm
            onSubmit={onPurchase}
            isLoading={isProcessing}
          />
        </Accordion>
      </div>

      {/* Estado de espera */}
      {isWaiting && (
        <PurchaseSuccess
          waitingTimeLeft={waitingTimeLeft}
          formatTime={formatTime}
        />
      )}
    </motion.div>
  );
};