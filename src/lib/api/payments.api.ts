import { http } from "./client";
import type { ListQuery } from "@/types/api/common";
import type { InitializePaymentPayload, PaymentInit } from "@/types/api/domain";

export type PaymentListQuery = ListQuery & { status?: string; purpose?: string };

export const paymentsApi = {
  initialize: (body: InitializePaymentPayload) =>
    http.post<PaymentInit>("/payments/initialize", body),
  verify: (reference: string) => http.post<{ status: string }>("/payments/verify", { reference }),
  list: (q: PaymentListQuery = {}) => http.get<unknown[]>("/payments", q),
};
