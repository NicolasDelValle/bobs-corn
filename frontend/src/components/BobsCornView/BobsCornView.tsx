import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '@/config/app';
import type { PaymentMethod } from '@/config/paymentMethods';
import { Accordion } from '@/components/Accordion/Accordion';
import { PaymentForm } from '@/components/PaymentForm/PaymentForm';
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                            <span className="text-8xl">{APP_CONFIG.product.image}</span>
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {APP_CONFIG.product.name}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {APP_CONFIG.product.description}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-green-600">
                                    ${APP_CONFIG.product.price}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {APP_CONFIG.product.currency}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Formulario de Compra */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <Accordion
                                isOpen={isAccordionOpen}
                                onToggle={handleAccordionToggle}
                                disabled={!canPurchase || isProcessing}
                                trigger={
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🛒</span>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {isWaiting ? 'Compra Realizada' : 'Comprar Choclo'}
                                                </h3>
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
                                        <div className="text-lg font-bold text-green-600">
                                            ${APP_CONFIG.product.price}
                                        </div>
                                    </div>
                                }
                            >
                                <PaymentForm
                                    onSubmit={handlePurchase}
                                    isLoading={isProcessing}
                                />
                            </Accordion>
                        </div>

                        {/* Estado de espera */}
                        {isWaiting && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-100 border border-green-300 rounded-lg p-4"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">✅</span>
                                    <div>
                                        <p className="font-medium text-green-800">
                                            ¡Compra exitosa!
                                        </p>
                                        <p className="text-sm text-green-700">
                                            Tu choclo está siendo preparado. Podrás hacer otra compra en {formatTime(waitingTimeLeft)}.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
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