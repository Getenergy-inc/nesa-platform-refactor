import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { nrcApi } from "@/api/newnrc";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Crown,
  Trash2,
  CheckCircle,
  UserPlus,
  Ban,
  Users,
  Clock,
  RefreshCcw,
} from "lucide-react";

interface NRCMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminNRCGovernance() {
  const { accessToken } = useAuth();

  const [pending, setPending] = useState<NRCMember[]>([]);
  const [members, setMembers] = useState<NRCMember[]>([]);
  const [suspended, setSuspended] = useState<NRCMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const pendingList = await nrcApi.fetchPendingNrc(accessToken);
      const activeList = await nrcApi.fetchApprovedNrc(accessToken);
      const suspendedList = await nrcApi.fetchSuspendedNrc(accessToken);

      const modifiedPending = pendingList.map((mem) => ({
        id: mem.user.id,
        name: `${mem.user.firstName} ${mem.user.lastName}`,
        email: mem.user.email,
        role: mem.user.role,
      }));

      const modifiedMembers = activeList.map((mem) => ({
        id: mem.user.id,
        name: `${mem.user.firstName} ${mem.user.lastName}`,
        email: mem.user.email,
        role: mem.role,
      }));

      const modifiedSuspended = suspendedList.map((mem) => ({
        id: mem.user.id,
        name: `${mem.user.firstName} ${mem.user.lastName}`,
        email: mem.user.email,
        role: mem.user.role,
      }));

      setPending(modifiedPending || []);
      setMembers(modifiedMembers || []);
      setSuspended(modifiedSuspended || []);
    } catch {
      toast.error("Failed to load NRC members");
    } finally {
      setLoading(false);
    }
  }

  async function approve(id: string) {
    try {
      await nrcApi.approveNrc(accessToken, id);
      toast.success("NRC approved");
      loadData();
    } catch {
      toast.error("Failed to approve NRC");
    }
  }

  async function remove(id: string) {
    try {
      await nrcApi.removeNrc(accessToken, id);
      toast.success("NRC removed");
      loadData();
    } catch {
      toast.error("Failed to remove NRC");
    }
  }

  async function promote(id: string) {
    try {
      await nrcApi.makeLead(accessToken, id);
      toast.success("Promoted to NRC Lead");
      loadData();
    } catch {
      toast.error("Failed to promote");
    }
  }

  async function suspend(id: string) {
    try {
      await nrcApi.suspendNrc(accessToken, id);
      toast.success("NRC suspended");
      loadData();
    } catch {
      toast.error("Failed to suspend");
    }
  }

  async function unsuspend(id: string) {
    try {
      await nrcApi.unSuspendNrc(accessToken, id);
      toast.success("NRC reinstated");
      loadData();
    } catch {
      toast.error("Failed to unsuspend NRC");
    }
  }

  const stats = {
    pending: pending.length,
    members: members.length,
    leads: members.filter((m) => m.role === "NRC_LEAD").length,
    suspended: suspended.length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold">{stats.members}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Leads</span>
            </div>
            <p className="text-2xl font-bold">{stats.leads}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Ban className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Suspended</span>
            </div>
            <p className="text-2xl font-bold">{stats.suspended}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-1" /> Pending
          </TabsTrigger>

          <TabsTrigger value="members">
            <Shield className="h-4 w-4 mr-1" /> Members
          </TabsTrigger>

          <TabsTrigger value="suspended">
            <Ban className="h-4 w-4 mr-1" /> Suspended
          </TabsTrigger>
        </TabsList>

        {/* Pending NRC */}

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>NRC Approval Queue</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {pending.map((member) => (
                <PendingNRCCard
                  key={member.id}
                  member={member}
                  onApprove={() => approve(member.id)}
                  onRemove={() => remove(member.id)}
                />
              ))}

              {pending.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No pending NRC approvals
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active NRC */}

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>NRC Members</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {members.map((member) => (
                <ActiveNRCCard
                  key={member.id}
                  member={member}
                  onPromote={() => promote(member.id)}
                  onSuspend={() => suspend(member.id)}
                />
              ))}

              {members.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No NRC members yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suspended NRC */}

        <TabsContent value="suspended">
          <Card>
            <CardHeader>
              <CardTitle>Suspended NRC Members</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {suspended.map((member) => (
                <SuspendedNRCCard
                  key={member.id}
                  member={member}
                  onUnsuspend={() => unsuspend(member.id)}
                />
              ))}

              {suspended.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No suspended NRC members
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SuspendedNRCCard({
  member,
  onUnsuspend,
}: {
  member: NRCMember;
  onUnsuspend: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50/20">
      <div>
        <h4 className="font-medium">{member.name}</h4>
        <p className="text-sm text-muted-foreground">{member.email}</p>
      </div>

      <Button size="sm" variant="outline" onClick={onUnsuspend}>
        <RefreshCcw className="h-3 w-3 mr-1" />
        Reinstate
      </Button>
    </div>
  );
}
function PendingNRCCard({
  member,
  onApprove,
  onRemove,
}: {
  member: NRCMember;
  onApprove: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/40 transition">
      <div>
        <h4 className="font-medium">{member.name}</h4>
        <p className="text-sm text-muted-foreground">{member.email}</p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={onApprove}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Approve
        </Button>

        <Button size="sm" variant="destructive" onClick={onRemove}>
          <Trash2 className="h-3 w-3 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  );
}

function ActiveNRCCard({
  member,
  onPromote,
  onSuspend,
}: {
  member: NRCMember;
  onPromote: () => void;
  onSuspend: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/40 transition">
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{member.name}</h4>

          {member.role === "NRC_LEAD" && (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">
              <Crown className="h-3 w-3 mr-1" />
              Lead
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{member.email}</p>
      </div>

      <div className="flex gap-2">
        {member.role !== "NRC_LEAD" && (
          <Button size="sm" variant="outline" onClick={onPromote}>
            <UserPlus className="h-3 w-3 mr-1" />
            Make Lead
          </Button>
        )}

        <Button size="sm" variant="destructive" onClick={onSuspend}>
          <Ban className="h-3 w-3 mr-1" />
          Suspend
        </Button>
      </div>
    </div>
  );
}
