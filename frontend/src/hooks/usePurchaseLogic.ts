import { useState, useEffect } from "react";
import type { PaymentType } from "@/types/common.types";
import type { Product } from "@/services/productApiService";

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
}

interface PurchaseData {
  paymentMethod: PaymentType;
  cardDetails?: unknown;
}

interface UsePurchaseLogicProps {
  products: Product[];
  createPurchase: (data: {
    productId: string;
    paymentMethod: PaymentType;
    cardDetails?: CardDetails;
  }) => Promise<unknown>;
}

export const usePurchaseLogic = ({
  products,
  createPurchase,
}: UsePurchaseLogicProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0].id);
    }
  }, [products, selectedProduct]);

  const handlePurchase = async (data: PurchaseData) => {
    if (!selectedProduct) {
      throw new Error("No product selected");
    }

    setIsProcessing(true);

    try {
      const response = await createPurchase({
        productId: selectedProduct,
        paymentMethod: data.paymentMethod,
        cardDetails: data.cardDetails as CardDetails | undefined,
      });

      setIsAccordionOpen(false);
      return response;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccordionToggle = (canPurchase: boolean) => {
    if (canPurchase && !isProcessing) {
      setIsAccordionOpen(!isAccordionOpen);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  const selectedProductData = products.find((p) => p.id === selectedProduct);

  return {
    isAccordionOpen,
    isProcessing,
    selectedProduct,
    selectedProductData,
    handlePurchase,
    handleAccordionToggle,
    handleProductSelect,
  };
};
