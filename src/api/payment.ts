import {
  Currency,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
} from "@/types/wallet";
import { apiRequest } from "./client";
import { API_BASE } from "@/contexts/AuthContext";
import { ApiResponse } from "./http";
import { PaymentMethod } from "@/config/galaConfig";

export interface ExchangeRates {
  userCurrency: Currency;
  userAmount: number;
  baseCurrency: Currency;
  baseamount: number;
  numberOfCoins: number;
}
export interface CreatePayment {
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  agreedCoinAmount: number;
  baseCurrencyAmount: number;
  paymentType: PaymentType;
}

export interface CreatePaymentResponse {
  id: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  currency: Currency;
  transactionRef: string;
  idempotencyKey: string;
  provider: PaymentProvider;
  method: PaymentMethod | null;
}

export const paymentApi = {
  fetchExchangeRate: async (
    accessToken: string,
    currency: Currency,
    amount: number,
  ) => {
    const res: ApiResponse<ExchangeRates> = await apiRequest(
      `${API_BASE}/payment/rates?currency=${currency}&amount=${amount}`,
      {
        credentials: "include",
        accessToken,
      },
    );
    return res.data;
  },

  createPayment: async (accessToken: string, payment: CreatePayment) => {
    const res: ApiResponse<CreatePaymentResponse> = await apiRequest(
      `${API_BASE}/payment`,
      {
        method: "POST",
        credentials: "include",
        accessToken,
        body: JSON.stringify(payment),
      },
    );
    return res.data;
  },
};
