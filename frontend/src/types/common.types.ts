export interface PaymentType {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  isEnabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommonApiResponse {
  waitTime?: number;
  message?: string;
}
