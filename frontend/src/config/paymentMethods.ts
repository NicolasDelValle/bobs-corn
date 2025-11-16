export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: "card" | "digital" | "cash";
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "credit-card",
    name: "Tarjeta de Crédito",
    icon: "💳",
    type: "card",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "🟦",
    type: "digital",
  },
  {
    id: "cash",
    name: "Efectivo",
    icon: "💵",
    type: "cash",
  },
];
