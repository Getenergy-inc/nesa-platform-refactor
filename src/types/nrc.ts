// NRC Portal Types

export interface NRCMember {
  id: string;
  user_id: string;
  invited_by: string | null;
  status: "pending" | "active" | "suspended" | "removed";
  specialization: string[];
  assigned_region: string | null;
  max_queue_size: number;
  review_count: number;
  approval_rate: number;
  joined_at: string | null;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined profile data
  profile?: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

export interface NRCQueueItem {
  id: string;
  nomination_id: string;
  assigned_to: string;
  assigned_by: string | null;
  priority: number;
  status: "assigned" | "in_review" | "completed" | "reassigned";
  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined nomination data
  nomination?: {
    id: string;
    nominee_name: string;
    nominee_title: string | null;
    nominee_organization: string | null;
    nominee_bio: string | null;
    nominee_photo_url: string | null;
    evidence_urls: string[] | null;
    justification: string | null;
    status: string;
    created_at: string;
    subcategory?: {
      id: string;
      name: string;
      category?: {
        id: string;
        name: string;
        slug: string;
      };
    };
  };
}

export interface NRCInvitation {
  id: string;
  email: string;
  token: string;
  invited_by: string;
  expires_at: string;
  accepted_at: string | null;
  status: "pending" | "accepted" | "expired" | "revoked";
  created_at: string;
}

export interface NRCStats {
  total_members: number;
  active_members: number;
  pending_invitations: number;
  total_queue_items: number;
  completed_reviews: number;
  avg_review_time_days: number;
}

export interface NRCDecisionPayload {
  nominationId: string;
  queueItemId: string;
  decision: "APPROVE" | "REJECT" | "NEEDS_INFO" | "PUSH_RENOMINATION" | "PUSH_VOTING";
  notes?: string;
  targetTier?: "gold" | "blue_garnet" | "platinum";
}
