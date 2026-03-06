import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Crown,
  Pencil,
  Plus,
  Clock,
  Trophy,
  CheckCircle,
  Star,
  Award,
  Gem,
  Users,
  Vote,
  Film,
  PartyPopper,
  X,
} from "lucide-react";
import {
  adminApi,
  CreateEdition,
  EditionBase,
  UpdateEdition,
} from "@/api/newadmin";
import { useAuth } from "@/contexts/AuthContext";

export default function ManageEditionsPage() {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [editingEdition, setEditingEdition] = useState<UpdateEdition | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: editions = [], isLoading } = useQuery({
    queryKey: ["editions"],
    queryFn: () => adminApi.fetchEditions(accessToken),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateEdition) => {
      console.log("the payload", payload);
      return adminApi.createEdition(accessToken, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["editions"]);
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateEdition) =>
      adminApi.updateEdition(accessToken, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["editions"]);
      setEditingEdition(null);
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => adminApi.activateEdition(accessToken, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["editions"]);
    },
  });

  return (
    <div className="p-10 space-y-10 bg-gray-50 min-h-screen">
      {/* HEADER WITH NESA AFRICA STYLING */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-30"></div>
            <div className="relative bg-white p-3 rounded-2xl shadow-lg border border-amber-200">
              <Trophy className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Award Editions</h1>
            <p className="text-amber-700 text-sm mt-1">
              Manage your prestigious ceremonies
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="group relative flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Create New Edition
        </button>
      </div>

      {/* EDITIONS GRID */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-10 animate-pulse"></div>
            <div className="relative bg-white shadow-lg px-8 py-4 rounded-2xl border border-amber-100">
              <p className="text-gray-600">Loading editions...</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {editions.map((edition: EditionBase, index: number) => {
            const isActive = edition.isActive;
            const isPast = new Date(edition.ceremonyDate) < new Date();

            return (
              <motion.div
                key={edition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                {/* Main Card */}
                <div className="relative bg-white rounded-2xl border border-amber-100 p-8 shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Active Badge */}
                  {isActive && (
                    <div className="absolute -top-3 -right-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-md opacity-30"></div>
                        <div className="relative bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                          <CheckCircle className="h-4 w-4" />
                          Active Edition
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Past Edition Badge */}
                  {isPast && !isActive && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
                        Past Edition
                      </div>
                    </div>
                  )}

                  {/* Card Header with NESA Africa Stripe */}
                  <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-amber-400 via-green-500 to-amber-400 rounded-full"></div>

                  {/* Edition Icon & Year */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500 blur-md opacity-10"></div>
                      <div
                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center ${
                          isActive
                            ? "bg-amber-100 text-amber-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Award className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-800">
                        {edition.displayYear}
                      </div>
                      <div className="text-xs text-gray-500">Edition</div>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="space-y-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                      {edition.name}
                    </h2>
                    <p className="text-gray-600 italic border-l-2 border-amber-400 pl-3">
                      "{edition.tagline}"
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Gem className="h-4 w-4 text-amber-500" />
                      <span className="text-gray-700">{edition.theme}</span>
                    </div>
                  </div>

                  {/* Timeline with Icons */}
                  <div className="space-y-4 mb-6">
                    <TimelineItem
                      icon={<Calendar className="h-3.5 w-3.5" />}
                      label="Nominations"
                      startDate={edition.nominationsOpen}
                      endDate={edition.nominationsClose}
                      color="green"
                    />
                    <TimelineItem
                      icon={<Vote className="h-3.5 w-3.5" />}
                      label="Voting"
                      startDate={edition.votingOpen}
                      endDate={edition.votingClose}
                      color="amber"
                    />
                    <TimelineItem
                      icon={<PartyPopper className="h-3.5 w-3.5" />}
                      label="Ceremony"
                      startDate={edition.ceremonyDate}
                      isSingle
                      color="brown"
                    />
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 mb-6 py-4 border-t border-b border-amber-100">
                    <StatBadge
                      icon={<Users className="h-4 w-4" />}
                      label="Nominees"
                      value="TBD"
                    />
                    <StatBadge
                      icon={<Film className="h-4 w-4" />}
                      label="Categories"
                      value="TBD"
                    />
                    <StatBadge
                      icon={<Star className="h-4 w-4" />}
                      label="Votes"
                      value="TBD"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingEdition(edition)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 text-gray-700 group/btn"
                    >
                      <Pencil className="h-4 w-4 text-gray-500 group-hover/btn:text-amber-600 transition-colors" />
                      <span className="text-sm font-medium">Edit Details</span>
                    </button>

                    {!isActive && !isPast && (
                      <button
                        onClick={() => activateMutation.mutate(edition.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg group/activate"
                      >
                        <Crown className="h-4 w-4 group-hover/activate:animate-pulse" />
                        <span className="text-sm font-semibold">
                          Make Active
                        </span>
                      </button>
                    )}

                    {isPast && !isActive && (
                      <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Concluded</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <EditionModal
            title="Create New Edition"
            onClose={() => setShowCreateModal(false)}
            onSubmit={(data) => createMutation.mutate(data)}
          />
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingEdition && (
          <EditionModal
            title="Edit Edition"
            edition={editingEdition}
            onClose={() => setEditingEdition(null)}
            onSubmit={(data) =>
              updateMutation.mutate({
                ...data,
                id: editingEdition.id,
              })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({
  icon,
  label,
  startDate,
  endDate,
  color,
  isSingle,
}: any) {
  const colorClasses = {
    green: "text-green-600 bg-green-50",
    amber: "text-amber-600 bg-amber-50",
    brown: "text-amber-700 bg-amber-100",
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-800 font-medium">
            {new Date(isSingle ? startDate : startDate).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              },
            )}
          </span>
          {!isSingle && (
            <>
              <span className="text-gray-400">→</span>
              <span className="text-gray-800 font-medium">
                {new Date(endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Stat Badge Component
function StatBadge({ icon, label, value }: any) {
  return (
    <div className="text-center">
      <div className="flex justify-center text-amber-600 mb-1">{icon}</div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-800">{value}</div>
    </div>
  );
}

// Edition Modal Component
function EditionModal({ title, edition, onClose, onSubmit }: any) {
  const [form, setForm] = useState(
    edition || {
      key: "",
      name: "",
      displayYear: "",
      ceremonyYear: "",
      tagline: "",
      theme: "",
      nominationsOpen: "",
      nominationsClose: "",
      votingOpen: "",
      votingClose: "",
      ceremonyDate: "",
      isActive: false,
    },
  );

  function updateField(key: string, value: any) {
    setForm({ ...form, [key]: value });
  }

  function handleSubmit() {
    onSubmit(form);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-[800px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="relative bg-amber-100 p-2 rounded-xl">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BASIC INFO */}
        <FormSection title="Edition Information" icon={<Trophy size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Edition Key"
              value={form.key}
              onChange={(v) => updateField("key", v)}
              placeholder="e.g., nesa-2024"
            />
            <Input
              label="Edition Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
              placeholder="e.g., NESA Africa Awards 2024"
            />
            <Input
              label="Display Year"
              value={form.displayYear}
              onChange={(v) => updateField("displayYear", v)}
              placeholder="e.g., 2024"
            />
            <Input
              label="Ceremony Year"
              value={form.ceremonyYear}
              onChange={(v) => updateField("ceremonyYear", v)}
              placeholder="e.g., 2024"
            />
            <Input
              label="Tagline"
              value={form.tagline}
              onChange={(v) => updateField("tagline", v)}
              placeholder="e.g., Celebrating African excellence"
              className="col-span-2"
            />
            <Input
              label="Theme"
              value={form.theme}
              onChange={(v) => updateField("theme", v)}
              placeholder="e.g., Rising Together"
              className="col-span-2"
            />
          </div>
        </FormSection>

        {/* NOMINATION PERIOD */}
        <FormSection title="Nomination Period" icon={<Calendar size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Nominations Open"
              value={form.nominationsOpen}
              onChange={(v) => updateField("nominationsOpen", v)}
            />
            <Input
              type="date"
              label="Nominations Close"
              value={form.nominationsClose}
              onChange={(v) => updateField("nominationsClose", v)}
            />
          </div>
        </FormSection>

        {/* VOTING PERIOD */}
        <FormSection title="Voting Period" icon={<Clock size={16} />}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Voting Open"
              value={form.votingOpen}
              onChange={(v) => updateField("votingOpen", v)}
            />
            <Input
              type="date"
              label="Voting Close"
              value={form.votingClose}
              onChange={(v) => updateField("votingClose", v)}
            />
          </div>
        </FormSection>

        {/* CEREMONY */}
        <FormSection title="Ceremony" icon={<Crown size={16} />}>
          <Input
            type="date"
            label="Ceremony Date"
            value={form.ceremonyDate}
            onChange={(v) => updateField("ceremonyDate", v)}
          />
        </FormSection>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 border-t border-amber-100 pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Save Edition
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Form Section Component
function FormSection({ title, icon, children }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 border-b border-amber-100 pb-2">
        <span className="text-amber-600">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

// Input Component
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
}: any) {
  return (
    <div className={`flex flex-col gap-1.5 text-sm ${className || ""}`}>
      <label className="text-gray-600 text-xs uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          rounded-xl
          border
          border-gray-200
          px-4
          py-2.5
          text-gray-800
          bg-white
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-amber-500/20
          focus:border-amber-500
          transition-all
          duration-300
          hover:border-amber-300
        "
      />
    </div>
  );
}
