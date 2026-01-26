import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TransactionsList } from "@/components/dashboard/wallet";
import type { WalletLedgerEntry } from "@/types/wallet";
import type { Chapter } from "@/types/olc";

function OLCWalletContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [transactions, setTransactions] = useState<WalletLedgerEntry[]>([]);

  const loadTransactions = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Find the chapter where user is coordinator
      const { data: chapterData } = await supabase
        .from("chapters")
        .select("*")
        .eq("coordinator_user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (!chapterData) {
        navigate("/unauthorized");
        return;
      }

      setChapter(chapterData as Chapter);

      // Get chapter's wallet account
      const { data: walletAccount } = await supabase
        .from("wallet_accounts")
        .select("id")
        .eq("owner_type", "CHAPTER")
        .eq("owner_id", chapterData.id)
        .maybeSingle();

      if (walletAccount) {
        // Get all transactions
        const { data: txData } = await supabase
          .from("wallet_ledger_entries")
          .select("*")
          .eq("account_id", walletAccount.id)
          .order("created_at", { ascending: false });

        if (txData) {
          setTransactions(txData as WalletLedgerEntry[]);
        }
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <DashboardLayout
      title="Chapter Wallet"
      breadcrumbs={[
        { label: "OLC", href: "/olc/dashboard" },
        { label: "Wallet" },
      ]}
    >
      <div className="space-y-6">
        <TransactionsList
          transactions={transactions}
          loading={loading}
          limit={50}
        />
      </div>
    </DashboardLayout>
  );
}

export default function OLCWallet() {
  return (
    <ProtectedRoute requiredRoles={["chapter", "admin"]}>
      <OLCWalletContent />
    </ProtectedRoute>
  );
}
