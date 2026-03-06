import { NRCLayout } from "@/components/nrc/NRCLayout";
import { NRCMembersContent } from "./NRCMembers";
import { AssignNominationSection } from "@/components/nrc/AssignNomination";
import { AssignedNominationsSection } from "@/components/nrc/AssignedNominations";
import { TeamInfoSection } from "@/components/nrc/TeamSection";
import { TeamMembersManager } from "@/components/nrc/TeamMemeberManager";
import ProtectedView from "@/components/ProtectedView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ManageTeam() {
  return (
    <ProtectedRoute requiredRoles={["NRC"]}>
      <NRCLayout>
        <ProtectedView>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-8">
              <NRCMembersContent />
              <AssignNominationSection />
              <AssignedNominationsSection />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <TeamInfoSection />
              <TeamMembersManager />
            </div>
          </div>
        </ProtectedView>
      </NRCLayout>
    </ProtectedRoute>
  );
}
