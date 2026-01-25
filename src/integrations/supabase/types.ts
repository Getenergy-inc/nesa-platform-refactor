export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string | null
          download_url: string | null
          expires_at: string | null
          id: string
          is_lifetime: boolean | null
          issued_at: string | null
          nominee_id: string
          season_id: string
          tier: Database["public"]["Enums"]["certificate_tier"]
          verification_code: string
        }
        Insert: {
          created_at?: string | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          issued_at?: string | null
          nominee_id: string
          season_id: string
          tier: Database["public"]["Enums"]["certificate_tier"]
          verification_code: string
        }
        Update: {
          created_at?: string | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          issued_at?: string | null
          nominee_id?: string
          season_id?: string
          tier?: Database["public"]["Enums"]["certificate_tier"]
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          country: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          lead_user_id: string | null
          logo_url: string | null
          name: string
          region: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lead_user_id?: string | null
          logo_url?: string | null
          name: string
          region?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lead_user_id?: string | null
          logo_url?: string | null
          name?: string
          region?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          donor_country: string | null
          donor_email: string
          donor_name: string | null
          donor_phone: string | null
          id: string
          impact_description: string | null
          is_anonymous: boolean | null
          metadata: Json | null
          payment_provider: string | null
          payment_reference: string | null
          program: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          donor_country?: string | null
          donor_email: string
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          impact_description?: string | null
          is_anonymous?: boolean | null
          metadata?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          program?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          donor_country?: string | null
          donor_email?: string
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          impact_description?: string | null
          is_anonymous?: boolean | null
          metadata?: Json | null
          payment_provider?: string | null
          payment_reference?: string | null
          program?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          embed_code: string | null
          id: string
          is_featured: boolean | null
          is_live: boolean | null
          media_type: string
          published_at: string | null
          season_id: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          embed_code?: string | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          media_type: string
          published_at?: string | null
          season_id?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          embed_code?: string | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          media_type?: string
          published_at?: string | null
          season_id?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      nominations: {
        Row: {
          created_at: string | null
          created_nominee_id: string | null
          evidence_urls: string[] | null
          id: string
          justification: string | null
          nominator_id: string
          nominee_bio: string | null
          nominee_name: string
          nominee_organization: string | null
          nominee_photo_url: string | null
          nominee_title: string | null
          nrc_reviewer_id: string | null
          review_notes: string | null
          reviewed_at: string | null
          season_id: string
          status: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_nominee_id?: string | null
          evidence_urls?: string[] | null
          id?: string
          justification?: string | null
          nominator_id: string
          nominee_bio?: string | null
          nominee_name: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          season_id: string
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_nominee_id?: string | null
          evidence_urls?: string[] | null
          id?: string
          justification?: string | null
          nominator_id?: string
          nominee_bio?: string | null
          nominee_name?: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          season_id?: string
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominations_created_nominee_id_fkey"
            columns: ["created_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      nominees: {
        Row: {
          bio: string | null
          created_at: string | null
          evidence_urls: string[] | null
          final_score: number | null
          id: string
          is_platinum: boolean | null
          jury_score: number | null
          name: string
          nominator_user_id: string | null
          nrc_reviewer_id: string | null
          organization: string | null
          photo_url: string | null
          public_votes: number | null
          region: string | null
          renomination_count: number
          review_notes: string | null
          reviewed_at: string | null
          season_id: string
          slug: string
          status: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          evidence_urls?: string[] | null
          final_score?: number | null
          id?: string
          is_platinum?: boolean | null
          jury_score?: number | null
          name: string
          nominator_user_id?: string | null
          nrc_reviewer_id?: string | null
          organization?: string | null
          photo_url?: string | null
          public_votes?: number | null
          region?: string | null
          renomination_count?: number
          review_notes?: string | null
          reviewed_at?: string | null
          season_id: string
          slug: string
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          evidence_urls?: string[] | null
          final_score?: number | null
          id?: string
          is_platinum?: boolean | null
          jury_score?: number | null
          name?: string
          nominator_user_id?: string | null
          nrc_reviewer_id?: string | null
          organization?: string | null
          photo_url?: string | null
          public_votes?: number | null
          region?: string | null
          renomination_count?: number
          review_notes?: string | null
          reviewed_at?: string | null
          season_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominees_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominees_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      stage_config: {
        Row: {
          action: Database["public"]["Enums"]["stage_action"]
          closes_at: string | null
          created_at: string | null
          id: string
          is_open: boolean | null
          opens_at: string | null
          season_id: string
          updated_at: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["stage_action"]
          closes_at?: string | null
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          opens_at?: string | null
          season_id: string
          updated_at?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["stage_action"]
          closes_at?: string | null
          created_at?: string | null
          id?: string
          is_open?: boolean | null
          opens_at?: string | null
          season_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_config_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          category_id: string
          chapter_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          chapter_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          chapter_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcategories_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          metadata: Json | null
          provider: string | null
          provider_reference: string | null
          receipt_url: string | null
          split_breakdown: Json | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          provider?: string | null
          provider_reference?: string | null
          receipt_url?: string | null
          split_breakdown?: Json | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          metadata?: Json | null
          provider?: string | null
          provider_reference?: string | null
          receipt_url?: string | null
          split_breakdown?: Json | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          nominee_id: string
          score: number | null
          season_id: string
          vote_type: Database["public"]["Enums"]["vote_type"]
          voter_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          nominee_id: string
          score?: number | null
          season_id: string
          vote_type: Database["public"]["Enums"]["vote_type"]
          voter_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          nominee_id?: string
          score?: number | null
          season_id?: string
          vote_type?: Database["public"]["Enums"]["vote_type"]
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_season: { Args: never; Returns: string }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_public_votes: {
        Args: { nominee_id: string }
        Returns: undefined
      }
      is_stage_open: {
        Args: { _action: Database["public"]["Enums"]["stage_action"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "nrc" | "jury" | "chapter" | "sponsor" | "admin"
      certificate_tier: "gold" | "platinum" | "blue_garnet" | "icon"
      nomination_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "platinum"
      stage_action:
        | "nominations"
        | "public_voting"
        | "jury_scoring"
        | "results"
        | "certificates"
      transaction_status: "pending" | "confirmed" | "failed" | "refunded"
      transaction_type: "donation" | "sponsorship" | "ticket"
      vote_type: "public" | "jury"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "nrc", "jury", "chapter", "sponsor", "admin"],
      certificate_tier: ["gold", "platinum", "blue_garnet", "icon"],
      nomination_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "platinum",
      ],
      stage_action: [
        "nominations",
        "public_voting",
        "jury_scoring",
        "results",
        "certificates",
      ],
      transaction_status: ["pending", "confirmed", "failed", "refunded"],
      transaction_type: ["donation", "sponsorship", "ticket"],
      vote_type: ["public", "jury"],
    },
  },
} as const
