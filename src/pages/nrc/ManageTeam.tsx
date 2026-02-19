import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { NRCMembersContent } from "./NRCMembers";
import { AssignNominationSection } from "@/components/nrc/AssignNomination";
import { AssignedNominationsSection } from "@/components/nrc/AssignedNominations";

export default function ManageTeam() {
  return (
    <ProtectedRoute requiredRoles={["admin", "FREE_MEMBER"]}>
      <NRCLayout>
        <div className="space-y-8">
          <NRCMembersContent />

          <AssignNominationSection />

          <AssignedNominationsSection />
        </div>
      </NRCLayout>
    </ProtectedRoute>
  );
}
