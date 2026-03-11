import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Loader2,
  Users,
  PlusCircle,
  Sparkles,
  Rocket,
  Shield,
  Trophy,
  AlertCircle,
  Building2,
  ChevronRight,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { nrcApi } from "@/api/newnrc";
import ProtectedView from "@/components/ProtectedView";
import { TeamInfo } from "@/components/nrc/TeamSection";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Form validation schema
const teamFormSchema = z.object({
  teamName: z
    .string()
    .min(3, "Team name must be at least 3 characters")
    .max(50, "Team name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s-]+$/,
      "Team name can only contain letters, numbers, spaces, and hyphens",
    ),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

function CreateNrcTeam() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();

  const [isCreating, setIsCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [hasTeam, setHasTeam] = useState<boolean | null>(null);
  const [existingTeam, setExistingTeam] = useState<TeamInfo>(null);
  const [checkingTeam, setCheckingTeam] = useState(true);

  // Initialize form
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: "",
      description: "",
    },
  });

  useEffect(() => {
    const checkExistingTeam = async () => {
      try {
        const teamInfo = await nrcApi.fetchTeamInfo(accessToken);

        if (teamInfo) {
          setHasTeam(true);
          setExistingTeam(teamInfo);
        } else {
          setHasTeam(false);
        }
      } catch {
        setHasTeam(false);
      } finally {
        setCheckingTeam(false);
      }
    };

    checkExistingTeam();
  }, [accessToken]);

  const handleCreateClick = () => {
    if (hasTeam) setShowLimitDialog(true);
    else {
      setShowDialog(true);
      // Reset form when opening dialog
      form.reset();
    }
  };

  const handleCreateTeam = async (values: TeamFormValues) => {
    if (!user) return;

    setIsCreating(true);

    try {
      await nrcApi.createTeam(
        accessToken,
        values.teamName,
        values.description || "",
      );

      toast.success("Team created successfully", {
        icon: <Trophy className="h-4 w-4" />,
        description: "Your new team is ready for collaboration!",
      });

      setShowDialog(false);
      setHasTeam(true);

      const newTeamInfo = await nrcApi.fetchTeamInfo(accessToken);
      setExistingTeam(newTeamInfo);

      // Reset form
      form.reset();
    } catch (error) {
      toast.error(error.message || "Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const handleNavigateToTeam = () => {
    navigate("/nrc/manageteam");
  };

  if (checkingTeam) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 to-gold/5 blur-xl" />
            <Loader2 className="h-16 w-16 animate-spin text-gold mx-auto relative" />
          </div>
          <p className="mt-4 text-muted-foreground animate-pulse">
            Checking your team status...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal border border-white/10 p-8">
          <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-gold/30 text-gold bg-gold/5"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Team Management
                </Badge>

                {hasTeam && (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    <Shield className="mr-1 h-3 w-3" />
                    Active Team
                  </Badge>
                )}
              </div>

              <h2 className="font-display text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {hasTeam ? "Your Team Space" : "Create Your Team"}
              </h2>

              <p className="text-muted-foreground max-w-xl">
                {hasTeam
                  ? "You're already part of a team. Manage your team or invite members."
                  : "Start your journey by creating a team. Add a name and description to get started."}
              </p>
            </div>

            {!hasTeam && (
              <Button
                size="lg"
                onClick={handleCreateClick}
                className="group relative overflow-hidden bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-charcoal font-semibold px-8 cursor-pointer"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center">
                  <Rocket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Create Your Team
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!hasTeam ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="relative overflow-hidden border-2 border-dashed border-white/10 bg-gradient-to-b from-charcoal-light to-charcoal">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,215,0,0.03),transparent_50%)]" />

                <CardContent className="relative z-10 py-16 text-center">
                  <div className="relative inline-block">
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-gold/20 blur-3xl animate-pulse" />

                    <div className="relative bg-gradient-to-br from-gold/20 to-gold/5 p-6 rounded-full border border-gold/30">
                      <Users className="h-16 w-16 text-gold" />
                    </div>
                  </div>

                  <h3 className="mt-6 font-display text-2xl font-bold">
                    Ready to Build Your Team?
                  </h3>

                  <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                    Create a team to collaborate with other NRC members. Add a
                    name and description to define your team's purpose.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={handleCreateClick}
                      className="bg-gold hover:bg-gold-dark text-charcoal font-semibold group cursor-pointer"
                    >
                      <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                      Create Your First Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="existing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-b from-charcoal-light to-charcoal">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-transparent" />

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                      <Trophy className="h-6 w-6 text-green-400" />
                    </div>

                    <div>
                      <CardTitle className="text-xl">
                        Your Active Team
                      </CardTitle>

                      <p className="text-sm text-muted-foreground mt-1">
                        You're already part of a team. Manage your team settings
                        below.
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className="border-gold/30 text-gold"
                        >
                          Current Team
                        </Badge>

                        <h4 className="text-2xl font-bold text-white">
                          {existingTeam?.name || "Your Team"}
                        </h4>

                        {existingTeam?.description && (
                          <p className="text-muted-foreground">
                            {existingTeam.description}
                          </p>
                        )}
                      </div>

                      <div className="p-3 rounded-full bg-gold/10">
                        <Users className="h-8 w-8 text-gold" />
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNavigateToTeam}
                    className="w-full border-white/10 hover:bg-white/5 cursor-pointer"
                  >
                    Manage Team
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Create Team Dialog with Form */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px] bg-charcoal border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-gold" />
              Create New Team
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create your team. You can always
              update these later.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateTeam)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., NRC Review Team Alpha"
                        className="bg-charcoal-light border-white/10 focus:border-gold"
                        disabled={isCreating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your team's purpose and goals..."
                        className="bg-charcoal-light border-white/10 focus:border-gold min-h-[100px]"
                        disabled={isCreating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="border-white/10 hover:bg-white/5"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Create Team
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Limit Warning Dialog */}
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent className="bg-charcoal border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-gold" />
              Team Limit Reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              You can only create one team at this time. Please manage your
              existing team or contact support if you need to create another
              team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowLimitDialog(false)}
              className="bg-gold hover:bg-gold-dark text-charcoal"
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function CreateTeam() {
  return (
    <ProtectedRoute requiredRoles={["NRC"]}>
      <NRCLayout>
        <ProtectedView>
          <CreateNrcTeam />
        </ProtectedView>
      </NRCLayout>
    </ProtectedRoute>
  );
}
