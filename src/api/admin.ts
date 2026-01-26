/**
 * NESA-Africa API Client - Admin Endpoints
 * 
 * Administrative operations including migrations, roles, and audit.
 */

import api, { type PaginatedResponse } from "./http";

// ==========================================
// TYPES
// ==========================================

export interface ImportNominee {
  name: string;
  slug?: string;
  title?: string;
  organization?: string;
  bio?: string;
  photo_url?: string;
  region?: "North" | "West" | "East" | "Central" | "Southern";
  subcategory_id?: string;
  subcategory_slug?: string;
  category_slug?: string;
  status?: "pending" | "under_review" | "approved" | "rejected" | "platinum";
  is_platinum?: boolean;
  evidence_urls?: string[];
  renomination_count?: number;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ index: number; name: string; error: string }>;
  created_ids: string[];
}

export interface DryRunResult {
  dry_run: true;
  would_import: number;
  validation_errors: Array<{ index: number; name: string; error: string }>;
  sample_records: any[];
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

// ==========================================
// MIGRATION API
// ==========================================

export const migrations = {
  /**
   * Import nominees (dry run for validation)
   */
  async dryRun(nominees: ImportNominee[], seasonId?: string) {
    return api.post<DryRunResult>("import-nominees", "", {
      nominees,
      season_id: seasonId,
      dry_run: true,
    });
  },

  /**
   * Import nominees (actual import)
   */
  async importNominees(nominees: ImportNominee[], seasonId?: string) {
    return api.post<ImportResult>("import-nominees", "", {
      nominees,
      season_id: seasonId,
      dry_run: false,
    });
  },

  /**
   * Import from final.json file
   * Note: File must be loaded client-side first
   */
  async importFromFile(fileContent: { nominees: ImportNominee[] }, seasonId?: string) {
    return api.post<ImportResult>("import-nominees", "", {
      nominees: fileContent.nominees,
      season_id: seasonId,
      dry_run: false,
    });
  },
};

// ==========================================
// ROLES API
// ==========================================

export const roles = {
  /**
   * Get all roles for a user
   */
  async getUserRoles(userId: string) {
    // This uses direct Supabase query since we don't have a dedicated edge function
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId);
    
    if (error) throw error;
    return { data, error: null, status: 200 };
  },

  /**
   * Assign role to user (admin only)
   */
  async assignRole(userId: string, role: "admin" | "nrc" | "jury" | "chapter" | "sponsor" | "user") {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role })
      .select()
      .single();
    
    if (error) throw error;
    
    // Log audit event
    await supabase.from("audit_logs").insert({
      action: "role_assigned",
      entity_type: "user_role",
      new_values: { user_id: userId, role },
    });
    
    return { data, error: null, status: 200 };
  },

  /**
   * Remove role from user (admin only)
   */
  async removeRole(userId: string, role: "admin" | "nrc" | "jury" | "chapter" | "sponsor" | "user") {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);
    
    if (error) throw error;
    
    // Log audit event
    await supabase.from("audit_logs").insert({
      action: "role_removed",
      entity_type: "user_role",
      old_values: { user_id: userId, role },
    });
    
    return { data: null, error: null, status: 200 };
  },
};

// ==========================================
// AUDIT API
// ==========================================

export const audit = {
  /**
   * Get audit logs
   */
  async getLogs(params?: {
    action?: string;
    entity_type?: string;
    user_id?: string;
    page?: number;
    limit?: number;
  }) {
    const { supabase } = await import("@/integrations/supabase/client");
    
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (params?.action) query = query.eq("action", params.action);
    if (params?.entity_type) query = query.eq("entity_type", params.entity_type);
    if (params?.user_id) query = query.eq("user_id", params.user_id);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return {
      data: {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      error: null,
      status: 200,
    };
  },

  /**
   * Export audit logs as JSON
   */
  async exportLogs(params?: {
    action?: string;
    entity_type?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { supabase } = await import("@/integrations/supabase/client");
    
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (params?.action) query = query.eq("action", params.action);
    if (params?.entity_type) query = query.eq("entity_type", params.entity_type);
    if (params?.startDate) query = query.gte("created_at", params.startDate);
    if (params?.endDate) query = query.lte("created_at", params.endDate);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return { data, error: null, status: 200 };
  },
};

export default {
  migrations,
  roles,
  audit,
};
