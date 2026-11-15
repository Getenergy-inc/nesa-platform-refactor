// Single data layer for Support Fund submissions. Switch to the shared EduAid-Africa API here later.
import { supabase } from "@/integrations/supabase/client";

export type PledgeInput = {
  ref: string; kind: "donation" | "sponsor" | "partner"; acknowledged: boolean;
  region?: string | null; category?: string | null; scope?: string | null;
  amount?: number | null; currency?: string | null; frequency?: string | null;
  contributions?: string[]; projects?: string[];
  donor_name?: string | null; donor_type?: string | null; email: string; phone?: string | null; country?: string | null; preferred_contact?: string | null;
  organisation?: string | null; organisation_type?: string | null; contact_person?: string | null; contact_role?: string | null; website?: string | null;
  in_kind_description?: string | null; recognition_name?: string | null; anonymous?: boolean; message?: string | null;
};
export type TransferReportInput = { ref: string; date_paid: string; amount_sent: number; currency?: string | null; sender_name: string; bank_transaction_id?: string | null };

const FORBIDDEN = /card|cvv|pin\b|password|otp/i;
export function assertNoSensitiveFields(obj: Record<string, unknown>) {
  for (const k of Object.keys(obj)) if (FORBIDDEN.test(k)) throw new Error(`Field not allowed: ${k}`);
}

export async function submitPledge(input: PledgeInput) {
  if (!input.acknowledged) throw new Error("Please confirm the acknowledgement.");
  assertNoSensitiveFields(input);
  const { error } = await supabase.from("support_fund_pledges").insert({ ...input, status: "pledge_received", site: "nesa" } as never);
  if (error) throw new Error("We could not save your form. Please try again.");
}

export async function submitTransferReport(input: TransferReportInput) {
  assertNoSensitiveFields(input);
  const { error } = await supabase.from("support_fund_transfer_reports").insert({ ...input, status: "transfer_reported", site: "nesa" } as never);
  if (error) throw new Error("We could not save your transfer report. Please try again.");
}
