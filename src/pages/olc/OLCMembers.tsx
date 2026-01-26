import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChapterMembersList, type ChapterMember } from "@/components/olc";
import type { Chapter } from "@/types/olc";

function OLCMembersContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [members, setMembers] = useState<ChapterMember[]>([]);

  const loadMembers = useCallback(async () => {
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

      // Get members who signed up with this chapter's referral code
      // They are in profiles table with referred_by_chapter_id
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, user_id, email, full_name, created_at")
        .eq("referred_by_chapter_id", chapterData.id);

      if (profilesData) {
        // Transform to ChapterMember format
        // Note: In a real implementation, you'd have a chapter_members table
        // For now, we'll use profiles with referred_by_chapter_id
        const transformedMembers: ChapterMember[] = profilesData.map((p) => ({
          id: p.id,
          user_id: p.user_id,
          email: p.email,
          full_name: p.full_name,
          status: "verified" as const, // Simplified - in real impl, track verification
          joined_at: p.created_at || new Date().toISOString(),
          verified_at: p.created_at,
        }));
        setMembers(transformedMembers);
      }
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleVerify = async (memberId: string, status: "verified" | "rejected") => {
    // In a real implementation, this would update a chapter_members table
    console.log(`Verifying member ${memberId} with status ${status}`);
    // Refresh the list
    await loadMembers();
  };

  return (
    <DashboardLayout
      title="Chapter Members"
      breadcrumbs={[
        { label: "OLC", href: "/olc/dashboard" },
        { label: "Members" },
      ]}
    >
      <div className="space-y-6">
        <ChapterMembersList
          members={members}
          loading={loading}
          onVerify={handleVerify}
        />
      </div>
    </DashboardLayout>
  );
}

export default function OLCMembers() {
  return (
    <ProtectedRoute requiredRoles={["chapter", "admin"]}>
      <OLCMembersContent />
    </ProtectedRoute>
  );
}
