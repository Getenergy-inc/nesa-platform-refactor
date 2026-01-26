import { api } from "./http";

export interface Transaction {
  id: string;
  user_id: string | null;
  amount: number;
  currency: string;
  transaction_type: "donation" | "sponsorship" | "ticket";
  status: "pending" | "confirmed" | "failed" | "refunded";
  provider: string | null;
  provider_reference: string | null;
  receipt_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentInitResponse {
  success: boolean;
  transaction_id: string;
  payment_url: string | null;
  reference?: string;
  message?: string;
  development_mode?: boolean;
}

export interface WalletBalance {
  balance: number;
  currency: string;
}

// Initialize a payment
export async function initPayment(
  amount: number,
  program: string,
  currency?: string,
  metadata?: Record<string, unknown>
) {
  return api.post<PaymentInitResponse>("payments", "/init", {
    amount,
    program,
    currency,
    metadata,
  });
}

// Get user's transaction history
export async function getTransactions(limit = 50, offset = 0) {
  return api.get<{ transactions: Transaction[]; total: number }>(
    "payments",
    "/transactions",
    { limit, offset }
  );
}

// Get user's AGC wallet balance
export async function getBalance() {
  return api.get<WalletBalance>("payments", "/balance");
}
