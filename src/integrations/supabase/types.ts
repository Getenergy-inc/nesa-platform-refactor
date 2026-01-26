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
          coordinator_user_id: string | null
          country: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          lead_user_id: string | null
          logo_url: string | null
          name: string
          referral_code: string | null
          region: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          coordinator_user_id?: string | null
          country: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lead_user_id?: string | null
          logo_url?: string | null
          name: string
          referral_code?: string | null
          region?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          coordinator_user_id?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lead_user_id?: string | null
          logo_url?: string | null
          name?: string
          referral_code?: string | null
          region?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_coordinator_user_id_fkey"
            columns: ["coordinator_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      coi_declarations: {
        Row: {
          created_at: string | null
          declared_at: string | null
          id: string
          judge_user_id: string
          nominee_id: string
          reason: string
        }
        Insert: {
          created_at?: string | null
          declared_at?: string | null
          id?: string
          judge_user_id: string
          nominee_id: string
          reason: string
        }
        Update: {
          created_at?: string | null
          declared_at?: string | null
          id?: string
          judge_user_id?: string
          nominee_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "coi_declarations_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pages: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          metadata: Json | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      disbursement_lines: {
        Row: {
          amount_usd: number
          created_at: string | null
          destination_account_id: string | null
          destination_external: string | null
          id: string
          run_id: string
          split_key: string
          status: string | null
        }
        Insert: {
          amount_usd: number
          created_at?: string | null
          destination_account_id?: string | null
          destination_external?: string | null
          id?: string
          run_id: string
          split_key: string
          status?: string | null
        }
        Update: {
          amount_usd?: number
          created_at?: string | null
          destination_account_id?: string | null
          destination_external?: string | null
          id?: string
          run_id?: string
          split_key?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disbursement_lines_destination_account_id_fkey"
            columns: ["destination_account_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disbursement_lines_destination_account_id_fkey"
            columns: ["destination_account_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "disbursement_lines_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "disbursement_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      disbursement_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          run_date: string
          season_id: string
          status: Database["public"]["Enums"]["disbursement_status"]
          total_amount_usd: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          run_date: string
          season_id: string
          status?: Database["public"]["Enums"]["disbursement_status"]
          total_amount_usd?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          run_date?: string
          season_id?: string
          status?: Database["public"]["Enums"]["disbursement_status"]
          total_amount_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "disbursement_runs_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
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
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jury_assignments: {
        Row: {
          assigned_at: string | null
          category_id: string | null
          comment: string | null
          created_at: string | null
          id: string
          judge_user_id: string
          nominee_id: string
          score: number | null
          scored_at: string | null
          season_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          category_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          judge_user_id: string
          nominee_id: string
          score?: number | null
          scored_at?: string | null
          season_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          category_id?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          judge_user_id?: string
          nominee_id?: string
          score?: number | null
          scored_at?: string | null
          season_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jury_assignments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jury_assignments_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jury_assignments_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
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
      payment_intents: {
        Row: {
          account_id: string
          agc_amount: number
          amount_usd: number
          created_at: string | null
          exchange_rate: number | null
          expires_at: string | null
          id: string
          metadata: Json | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_ref: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
        }
        Insert: {
          account_id: string
          agc_amount: number
          amount_usd: number
          created_at?: string | null
          exchange_rate?: number | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          agc_amount?: number
          amount_usd?: number
          created_at?: string | null
          exchange_rate?: number | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_intents_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["account_id"]
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
          referred_by_chapter_id: string | null
          referred_by_user_id: string | null
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
          referred_by_chapter_id?: string | null
          referred_by_user_id?: string | null
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
          referred_by_chapter_id?: string | null
          referred_by_user_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_user_id_fkey"
            columns: ["referred_by_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_events: {
        Row: {
          created_at: string | null
          event_type: Database["public"]["Enums"]["referral_event_type"]
          id: string
          is_paid: boolean | null
          referred_user_id: string
          referrer_id: string
          referrer_type: Database["public"]["Enums"]["referral_owner_type"]
          reward_agc: number | null
          value_usd: number | null
        }
        Insert: {
          created_at?: string | null
          event_type: Database["public"]["Enums"]["referral_event_type"]
          id?: string
          is_paid?: boolean | null
          referred_user_id: string
          referrer_id: string
          referrer_type: Database["public"]["Enums"]["referral_owner_type"]
          reward_agc?: number | null
          value_usd?: number | null
        }
        Update: {
          created_at?: string | null
          event_type?: Database["public"]["Enums"]["referral_event_type"]
          id?: string
          is_paid?: boolean | null
          referred_user_id?: string
          referrer_id?: string
          referrer_type?: Database["public"]["Enums"]["referral_owner_type"]
          reward_agc?: number | null
          value_usd?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_events_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["referral_owner_type"]
          referral_code: string
          total_earnings_agc: number | null
          total_referrals: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["referral_owner_type"]
          referral_code: string
          total_earnings_agc?: number | null
          total_referrals?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          owner_id?: string
          owner_type?: Database["public"]["Enums"]["referral_owner_type"]
          referral_code?: string
          total_earnings_agc?: number | null
          total_referrals?: number | null
        }
        Relationships: []
      }
      results: {
        Row: {
          category_id: string
          computed_at: string | null
          created_at: string | null
          final_score: number | null
          id: string
          is_winner: boolean | null
          jury_score: number | null
          nominee_id: string
          public_score: number | null
          public_votes: number | null
          rank: number | null
          season_id: string
          subcategory_id: string | null
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          computed_at?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string
          is_winner?: boolean | null
          jury_score?: number | null
          nominee_id: string
          public_score?: number | null
          public_votes?: number | null
          rank?: number | null
          season_id: string
          subcategory_id?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          computed_at?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string
          is_winner?: boolean | null
          jury_score?: number | null
          nominee_id?: string
          public_score?: number | null
          public_votes?: number | null
          rank?: number | null
          season_id?: string
          subcategory_id?: string | null
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "results_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_splits: {
        Row: {
          created_at: string | null
          destination_description: string | null
          id: string
          is_active: boolean | null
          percent: number
          season_id: string
          split_key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination_description?: string | null
          id?: string
          is_active?: boolean | null
          percent: number
          season_id: string
          split_key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination_description?: string | null
          id?: string
          is_active?: boolean | null
          percent?: number
          season_id?: string
          split_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_splits_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          code: Database["public"]["Enums"]["role_code"]
          created_at: string | null
          description: string | null
          id: string
          label: string
        }
        Insert: {
          code: Database["public"]["Enums"]["role_code"]
          created_at?: string | null
          description?: string | null
          id?: string
          label: string
        }
        Update: {
          code?: Database["public"]["Enums"]["role_code"]
          created_at?: string | null
          description?: string | null
          id?: string
          label?: string
        }
        Relationships: []
      }
      seasons: {
        Row: {
          blue_garnet_open: boolean | null
          certificate_download_open: boolean | null
          code: string | null
          config: Json | null
          created_at: string | null
          ends_at: string | null
          gold_voting_open: boolean | null
          id: string
          is_active: boolean | null
          name: string
          nomination_open: boolean | null
          starts_at: string | null
          updated_at: string | null
          year: number
        }
        Insert: {
          blue_garnet_open?: boolean | null
          certificate_download_open?: boolean | null
          code?: string | null
          config?: Json | null
          created_at?: string | null
          ends_at?: string | null
          gold_voting_open?: boolean | null
          id?: string
          is_active?: boolean | null
          name: string
          nomination_open?: boolean | null
          starts_at?: string | null
          updated_at?: string | null
          year: number
        }
        Update: {
          blue_garnet_open?: boolean | null
          certificate_download_open?: boolean | null
          code?: string | null
          config?: Json | null
          created_at?: string | null
          ends_at?: string | null
          gold_voting_open?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          nomination_open?: boolean | null
          starts_at?: string | null
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
          role_code: Database["public"]["Enums"]["role_code"] | null
          scope_chapter_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          role_code?: Database["public"]["Enums"]["role_code"] | null
          scope_chapter_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          role_code?: Database["public"]["Enums"]["role_code"] | null
          scope_chapter_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_scope_chapter_fkey"
            columns: ["scope_chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
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
      wallet_accounts: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          is_active: boolean | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["wallet_owner_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          owner_id: string
          owner_type: Database["public"]["Enums"]["wallet_owner_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          is_active?: boolean | null
          owner_id?: string
          owner_type?: Database["public"]["Enums"]["wallet_owner_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      wallet_ledger_entries: {
        Row: {
          account_id: string
          agc_amount: number
          created_at: string | null
          created_by: string | null
          description: string | null
          direction: Database["public"]["Enums"]["wallet_direction"]
          entry_type: Database["public"]["Enums"]["wallet_entry_type"]
          id: string
          is_withdrawable: boolean | null
          reference_id: string | null
          reference_type: string | null
          usd_amount: number
        }
        Insert: {
          account_id: string
          agc_amount?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          direction: Database["public"]["Enums"]["wallet_direction"]
          entry_type: Database["public"]["Enums"]["wallet_entry_type"]
          id?: string
          is_withdrawable?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          usd_amount?: number
        }
        Update: {
          account_id?: string
          agc_amount?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          direction?: Database["public"]["Enums"]["wallet_direction"]
          entry_type?: Database["public"]["Enums"]["wallet_entry_type"]
          id?: string
          is_withdrawable?: boolean | null
          reference_id?: string | null
          reference_type?: string | null
          usd_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_ledger_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["account_id"]
          },
        ]
      }
    }
    Views: {
      wallet_balances: {
        Row: {
          account_id: string | null
          agc_bonus: number | null
          agc_non_withdrawable: number | null
          agc_total: number | null
          agc_withdrawable: number | null
          currency: string | null
          owner_id: string | null
          owner_type: Database["public"]["Enums"]["wallet_owner_type"] | null
          usd_balance: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_referral_code: { Args: { p_prefix?: string }; Returns: string }
      get_current_season: { Args: never; Returns: string }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      get_user_wallet: { Args: { p_user_id: string }; Returns: string }
      get_wallet_balance: {
        Args: { p_account_id: string }
        Returns: {
          agc_bonus: number
          agc_non_withdrawable: number
          agc_total: number
          agc_withdrawable: number
          usd_balance: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role_code: {
        Args: {
          p_role_code: Database["public"]["Enums"]["role_code"]
          p_user_id: string
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
      disbursement_status: "DRAFT" | "COMPLETED" | "FAILED"
      nomination_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "platinum"
      payment_provider: "PAYSTACK" | "FLUTTERWAVE" | "LEMFI" | "TAPTAPSEND"
      payment_status:
        | "INITIATED"
        | "PENDING"
        | "SUCCESS"
        | "FAILED"
        | "CANCELLED"
      referral_event_type:
        | "SIGNUP"
        | "NOMINATION_PAID"
        | "VOTE_PAID"
        | "DONATION"
        | "TICKET"
      referral_owner_type: "USER" | "CHAPTER"
      role_code:
        | "USER"
        | "NOMINEE"
        | "AMBASSADOR"
        | "OLC_COORDINATOR"
        | "NRC"
        | "JURY"
        | "SPONSOR"
        | "ADMIN"
        | "SUPER_ADMIN"
      stage_action:
        | "nominations"
        | "public_voting"
        | "jury_scoring"
        | "results"
        | "certificates"
      transaction_status: "pending" | "confirmed" | "failed" | "refunded"
      transaction_type: "donation" | "sponsorship" | "ticket"
      vote_type: "public" | "jury"
      wallet_direction: "CREDIT" | "DEBIT"
      wallet_entry_type:
        | "TOPUP"
        | "NOMINATION_FEE"
        | "VOTE_FEE"
        | "DONATION"
        | "TICKET"
        | "REFERRAL_BONUS"
        | "AMBASSADOR_BONUS"
        | "CHAPTER_BONUS"
        | "WITHDRAW_REQUEST"
        | "WITHDRAW_APPROVED"
        | "ADJUSTMENT"
      wallet_owner_type: "USER" | "CHAPTER" | "PLATFORM"
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
      disbursement_status: ["DRAFT", "COMPLETED", "FAILED"],
      nomination_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "platinum",
      ],
      payment_provider: ["PAYSTACK", "FLUTTERWAVE", "LEMFI", "TAPTAPSEND"],
      payment_status: [
        "INITIATED",
        "PENDING",
        "SUCCESS",
        "FAILED",
        "CANCELLED",
      ],
      referral_event_type: [
        "SIGNUP",
        "NOMINATION_PAID",
        "VOTE_PAID",
        "DONATION",
        "TICKET",
      ],
      referral_owner_type: ["USER", "CHAPTER"],
      role_code: [
        "USER",
        "NOMINEE",
        "AMBASSADOR",
        "OLC_COORDINATOR",
        "NRC",
        "JURY",
        "SPONSOR",
        "ADMIN",
        "SUPER_ADMIN",
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
      wallet_direction: ["CREDIT", "DEBIT"],
      wallet_entry_type: [
        "TOPUP",
        "NOMINATION_FEE",
        "VOTE_FEE",
        "DONATION",
        "TICKET",
        "REFERRAL_BONUS",
        "AMBASSADOR_BONUS",
        "CHAPTER_BONUS",
        "WITHDRAW_REQUEST",
        "WITHDRAW_APPROVED",
        "ADJUSTMENT",
      ],
      wallet_owner_type: ["USER", "CHAPTER", "PLATFORM"],
    },
  },
} as const
