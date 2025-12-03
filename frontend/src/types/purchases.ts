export interface PurchaseRequest {
  productId: string;
  paymentMethod: {
    name: string;
    identifier: string;
  };
}

export interface PurchaseResponse {
  id: string;
  clientId: string;
  productId: string;
  purchasedAt: string;
  client: {
    id: string;
    sessionId: string;
    createdAt: string;
    lastActive: string;
  };
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isEnabled: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  paymentMethod: {
    id: string;
    name: string;
    identifierHash: string;
    lastFourDigits: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
