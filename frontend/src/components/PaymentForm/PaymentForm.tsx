import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button/Button';
import { usePaymentTypes } from '@/hooks/usePaymentTypes';
import type { PaymentType } from '@/types/common.types';

interface PaymentFormProps {
  onSubmit: (data: { paymentMethod: PaymentType; cardDetails?: CardDetails }) => void;
  isLoading?: boolean;
}

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, isLoading = false }) => {
  const { paymentTypes, loading: loadingTypes } = usePaymentTypes();
  const [selectedMethod, setSelectedMethod] = useState<PaymentType | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return;

    onSubmit({
      paymentMethod: selectedMethod,
      ...(selectedMethod.name.includes('card') ? { cardDetails } : {})
    });
  };

  const isCardType = (method: PaymentType) => {
    return method.name.includes('card') || method.name === 'credit_card' || method.name === 'debit_card';
  };

  const isDigitalType = (method: PaymentType) => {
    return ['paypal', 'apple_pay', 'google_pay'].includes(method.name);
  };

  if (loadingTypes) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Método de Pago
        </h3>
        <div className="grid gap-3">
          {paymentTypes.map((method) => (
            <motion.button
              key={method.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMethod(method)}
              className={`p-4 rounded-lg border-2 transition-colors flex items-center gap-3 ${selectedMethod?.id === method.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <span className="text-2xl">{method.icon}</span>
              <span className="font-medium">{method.displayName}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedMethod && isCardType(selectedMethod) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <h4 className="font-medium text-gray-700">Datos de la Tarjeta</h4>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Número de tarjeta"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Nombre del titular"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/AA"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </motion.div>
      )}

      {selectedMethod && isDigitalType(selectedMethod) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-blue-50 rounded-lg"
        >
          <p className="text-sm text-blue-700">
            Serás redirigido a {selectedMethod.displayName} para completar el pago.
          </p>
        </motion.div>
      )}

      {selectedMethod && selectedMethod.name === 'bank_transfer' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="p-4 bg-green-50 rounded-lg"
        >
          <p className="text-sm text-green-700">
            Te enviaremos los datos bancarios para realizar la transferencia.
          </p>
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={!selectedMethod || isLoading}
        variant={!selectedMethod ? 'ghost' : 'primary'}
        className="w-full"
      >
        {isLoading ? '🌽 Procesando...' : '🌽 Comprar Choclo'}
      </Button>
    </motion.form>
  );
};