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
      acceptance_letters: {
        Row: {
          created_at: string | null
          delivery_channel: string | null
          delivery_status: string | null
          id: string
          nominee_id: string
          opened_at: string | null
          responded_at: string | null
          response: Database["public"]["Enums"]["acceptance_status"] | null
          sent_at: string | null
          token: string
          token_expires_at: string
        }
        Insert: {
          created_at?: string | null
          delivery_channel?: string | null
          delivery_status?: string | null
          id?: string
          nominee_id: string
          opened_at?: string | null
          responded_at?: string | null
          response?: Database["public"]["Enums"]["acceptance_status"] | null
          sent_at?: string | null
          token: string
          token_expires_at: string
        }
        Update: {
          created_at?: string | null
          delivery_channel?: string | null
          delivery_status?: string | null
          id?: string
          nominee_id?: string
          opened_at?: string | null
          responded_at?: string | null
          response?: Database["public"]["Enums"]["acceptance_status"] | null
          sent_at?: string | null
          token?: string
          token_expires_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "acceptance_letters_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: true
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "acceptance_letters_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: true
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_nrc_assessments: {
        Row: {
          category_fit_score: number | null
          created_at: string | null
          evidence_score: number | null
          explanation_summary: string | null
          id: string
          identity_verified: boolean | null
          model_version: string | null
          nomination_id: string
          processing_time_ms: number | null
          reason_codes: Json | null
          recommendation: string
          risk_score: number | null
          rubric_version: string | null
          updated_at: string | null
        }
        Insert: {
          category_fit_score?: number | null
          created_at?: string | null
          evidence_score?: number | null
          explanation_summary?: string | null
          id?: string
          identity_verified?: boolean | null
          model_version?: string | null
          nomination_id: string
          processing_time_ms?: number | null
          reason_codes?: Json | null
          recommendation: string
          risk_score?: number | null
          rubric_version?: string | null
          updated_at?: string | null
        }
        Update: {
          category_fit_score?: number | null
          created_at?: string | null
          evidence_score?: number | null
          explanation_summary?: string | null
          id?: string
          identity_verified?: boolean | null
          model_version?: string | null
          nomination_id?: string
          processing_time_ms?: number | null
          reason_codes?: Json | null
          recommendation?: string
          risk_score?: number | null
          rubric_version?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_nrc_assessments_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
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
      bulk_order_leads: {
        Row: {
          branding_request: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          country: string | null
          created_at: string | null
          estimated_quantity: number | null
          id: string
          notes: string | null
          organization_name: string
          products_interested: string[] | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          branding_request?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          estimated_quantity?: number | null
          id?: string
          notes?: string | null
          organization_name: string
          products_interested?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          branding_request?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          estimated_quantity?: number | null
          id?: string
          notes?: string | null
          organization_name?: string
          products_interested?: string[] | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          unit_price_usd: number
        }
        Insert: {
          cart_id: string
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          unit_price_usd: number
        }
        Update: {
          cart_id?: string
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          unit_price_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          anon_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          anon_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          anon_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["user_id"]
          },
        ]
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
      certificate_verifications: {
        Row: {
          certificate_id: string
          created_at: string | null
          id: string
          result: string
          verification_hash: string
          verified_at: string | null
          verifier_ip: string | null
          verifier_user_agent: string | null
        }
        Insert: {
          certificate_id: string
          created_at?: string | null
          id?: string
          result: string
          verification_hash: string
          verified_at?: string | null
          verifier_ip?: string | null
          verifier_user_agent?: string | null
        }
        Update: {
          certificate_id?: string
          created_at?: string | null
          id?: string
          result?: string
          verification_hash?: string
          verified_at?: string | null
          verifier_ip?: string | null
          verifier_user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificate_verifications_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          created_at: string | null
          download_locked: boolean | null
          download_url: string | null
          expires_at: string | null
          id: string
          is_lifetime: boolean | null
          issued_at: string | null
          nominee_id: string
          qr_url: string | null
          renewed_from_id: string | null
          revoke_reason: string | null
          revoked_at: string | null
          season_id: string
          serial_number: string | null
          status: Database["public"]["Enums"]["certificate_status"] | null
          tier: Database["public"]["Enums"]["certificate_tier"]
          unlocked_at: string | null
          verification_code: string
          verification_hash: string | null
        }
        Insert: {
          created_at?: string | null
          download_locked?: boolean | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          issued_at?: string | null
          nominee_id: string
          qr_url?: string | null
          renewed_from_id?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          season_id: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["certificate_status"] | null
          tier: Database["public"]["Enums"]["certificate_tier"]
          unlocked_at?: string | null
          verification_code: string
          verification_hash?: string | null
        }
        Update: {
          created_at?: string | null
          download_locked?: boolean | null
          download_url?: string | null
          expires_at?: string | null
          id?: string
          is_lifetime?: boolean | null
          issued_at?: string | null
          nominee_id?: string
          qr_url?: string | null
          renewed_from_id?: string | null
          revoke_reason?: string | null
          revoked_at?: string | null
          season_id?: string
          serial_number?: string | null
          status?: Database["public"]["Enums"]["certificate_status"] | null
          tier?: Database["public"]["Enums"]["certificate_tier"]
          unlocked_at?: string | null
          verification_code?: string
          verification_hash?: string | null
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
            foreignKeyName: "certificates_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_renewed_from_id_fkey"
            columns: ["renewed_from_id"]
            isOneToOne: false
            referencedRelation: "certificates"
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
          {
            foreignKeyName: "chapters_coordinator_user_id_fkey"
            columns: ["coordinator_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
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
          {
            foreignKeyName: "coi_declarations_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
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
      contests: {
        Row: {
          category_id: string | null
          closes_at: string | null
          contest_type: Database["public"]["Enums"]["contest_type"]
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          opens_at: string | null
          season_id: string
          subcategory_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          closes_at?: string | null
          contest_type: Database["public"]["Enums"]["contest_type"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          opens_at?: string | null
          season_id: string
          subcategory_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          closes_at?: string | null
          contest_type?: Database["public"]["Enums"]["contest_type"]
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          opens_at?: string | null
          season_id?: string
          subcategory_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contests_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contests_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      disbursement_batches: {
        Row: {
          created_at: string | null
          currency: string
          id: string
          settlement_run_id: string
          status: Database["public"]["Enums"]["transfer_status"]
          total_fees: number
          total_gross: number
          total_net: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          id?: string
          settlement_run_id: string
          status?: Database["public"]["Enums"]["transfer_status"]
          total_fees?: number
          total_gross?: number
          total_net?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          id?: string
          settlement_run_id?: string
          status?: Database["public"]["Enums"]["transfer_status"]
          total_fees?: number
          total_gross?: number
          total_net?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disbursement_batches_settlement_run_id_fkey"
            columns: ["settlement_run_id"]
            isOneToOne: false
            referencedRelation: "settlement_runs"
            referencedColumns: ["id"]
          },
        ]
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
      disbursement_transfers: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string | null
          currency: string
          destination_account_ref: string | null
          disbursement_batch_id: string
          external_reference: string | null
          fund_account_key: string
          id: string
          partner_key: string | null
          percentage_applied: number
          status: Database["public"]["Enums"]["transfer_status"]
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string
          destination_account_ref?: string | null
          disbursement_batch_id: string
          external_reference?: string | null
          fund_account_key: string
          id?: string
          partner_key?: string | null
          percentage_applied: number
          status?: Database["public"]["Enums"]["transfer_status"]
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string
          destination_account_ref?: string | null
          disbursement_batch_id?: string
          external_reference?: string | null
          fund_account_key?: string
          id?: string
          partner_key?: string | null
          percentage_applied?: number
          status?: Database["public"]["Enums"]["transfer_status"]
        }
        Relationships: [
          {
            foreignKeyName: "disbursement_transfers_disbursement_batch_id_fkey"
            columns: ["disbursement_batch_id"]
            isOneToOne: false
            referencedRelation: "disbursement_batches"
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
      escalation_logs: {
        Row: {
          admin_notes: string | null
          conversation_history: Json
          conversation_id: string
          created_at: string | null
          escalation_reason: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          trigger_keywords: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          conversation_history: Json
          conversation_id: string
          created_at?: string | null
          escalation_reason?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          trigger_keywords: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          conversation_history?: Json
          conversation_id?: string
          created_at?: string | null
          escalation_reason?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          trigger_keywords?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      evidence_bundles: {
        Row: {
          created_at: string | null
          file_types: string[] | null
          file_urls: string[] | null
          id: string
          nomination_id: string | null
          nominee_id: string | null
          notes: string | null
          tags: string[] | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_types?: string[] | null
          file_urls?: string[] | null
          id?: string
          nomination_id?: string | null
          nominee_id?: string | null
          notes?: string | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_types?: string[] | null
          file_urls?: string[] | null
          id?: string
          nomination_id?: string | null
          nominee_id?: string | null
          notes?: string | null
          tags?: string[] | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_bundles_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_bundles_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_bundles_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          cta_hint: string | null
          display_order: number | null
          escalation_flag: boolean | null
          id: string
          intent_keywords: string[] | null
          is_active: boolean | null
          question: string
          tags: string[] | null
          tone: string | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          cta_hint?: string | null
          display_order?: number | null
          escalation_flag?: boolean | null
          id?: string
          intent_keywords?: string[] | null
          is_active?: boolean | null
          question: string
          tags?: string[] | null
          tone?: string | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          cta_hint?: string | null
          display_order?: number | null
          escalation_flag?: boolean | null
          id?: string
          intent_keywords?: string[] | null
          is_active?: boolean | null
          question?: string
          tags?: string[] | null
          tone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fraud_flags: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string | null
          device_hash: string | null
          evidence: Json | null
          flag_status: string | null
          flag_type: string
          id: string
          ip_hash: string | null
          nominee_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          season_id: string
          severity: string
          time_window_seconds: number | null
          updated_at: string | null
          vote_count: number | null
          voter_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          device_hash?: string | null
          evidence?: Json | null
          flag_status?: string | null
          flag_type: string
          id?: string
          ip_hash?: string | null
          nominee_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          season_id: string
          severity?: string
          time_window_seconds?: number | null
          updated_at?: string | null
          vote_count?: number | null
          voter_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string | null
          device_hash?: string | null
          evidence?: Json | null
          flag_status?: string | null
          flag_type?: string
          id?: string
          ip_hash?: string | null
          nominee_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          season_id?: string
          severity?: string
          time_window_seconds?: number | null
          updated_at?: string | null
          vote_count?: number | null
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_flags_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_flags_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_flags_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_accounts: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          is_active: boolean | null
          key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      judge_applications: {
        Row: {
          approved_at: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          cv_url: string | null
          email: string
          expertise_areas: string[] | null
          full_name: string
          id: string
          linkedin_url: string | null
          organization: string | null
          phone: string | null
          rejected_at: string | null
          rejection_reason: string | null
          review_notes: string | null
          reviewed_by: string | null
          status: string
          title: string | null
          updated_at: string | null
          user_id: string | null
          verification_token: string | null
          verification_token_expires_at: string | null
          verified_at: string | null
          years_experience: number | null
        }
        Insert: {
          approved_at?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          cv_url?: string | null
          email: string
          expertise_areas?: string[] | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          organization?: string | null
          phone?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_token?: string | null
          verification_token_expires_at?: string | null
          verified_at?: string | null
          years_experience?: number | null
        }
        Update: {
          approved_at?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          cv_url?: string | null
          email?: string
          expertise_areas?: string[] | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          organization?: string | null
          phone?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_token?: string | null
          verification_token_expires_at?: string | null
          verified_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      judge_chat_messages: {
        Row: {
          created_at: string
          id: string
          is_edited: boolean | null
          message: string
          reply_to_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_edited?: boolean | null
          message: string
          reply_to_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_edited?: boolean | null
          message?: string
          reply_to_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "judge_chat_messages"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "jury_assignments_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
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
      jury_submissions: {
        Row: {
          completed_assignments: number | null
          confirmation_hash: string | null
          contest_id: string | null
          created_at: string | null
          id: string
          is_locked: boolean | null
          judge_user_id: string
          recused_assignments: number | null
          season_id: string
          submitted_at: string | null
          total_assignments: number | null
        }
        Insert: {
          completed_assignments?: number | null
          confirmation_hash?: string | null
          contest_id?: string | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          judge_user_id: string
          recused_assignments?: number | null
          season_id: string
          submitted_at?: string | null
          total_assignments?: number | null
        }
        Update: {
          completed_assignments?: number | null
          confirmation_hash?: string | null
          contest_id?: string | null
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          judge_user_id?: string
          recused_assignments?: number | null
          season_id?: string
          submitted_at?: string | null
          total_assignments?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jury_submissions_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jury_submissions_season_id_fkey"
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
      misuse_reports: {
        Row: {
          admin_notes: string | null
          certificate_id: string
          created_at: string | null
          evidence_urls: string[] | null
          id: string
          reason: string
          reporter_email: string | null
          reporter_name: string | null
          reporter_user_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["misuse_report_status"] | null
          updated_at: string | null
          verification_hash: string | null
        }
        Insert: {
          admin_notes?: string | null
          certificate_id: string
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          reason: string
          reporter_email?: string | null
          reporter_name?: string | null
          reporter_user_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["misuse_report_status"] | null
          updated_at?: string | null
          verification_hash?: string | null
        }
        Update: {
          admin_notes?: string | null
          certificate_id?: string
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          reason?: string
          reporter_email?: string | null
          reporter_name?: string | null
          reporter_user_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["misuse_report_status"] | null
          updated_at?: string | null
          verification_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "misuse_reports_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
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
          identity_hash: string | null
          justification: string | null
          last_query_at: string | null
          nominator_id: string
          nominee_bio: string | null
          nominee_name: string
          nominee_organization: string | null
          nominee_photo_url: string | null
          nominee_title: string | null
          nrc_reviewer_id: string | null
          query_count: number | null
          review_notes: string | null
          reviewed_at: string | null
          rubric_version: string | null
          season_id: string
          sla_deadline: string | null
          source: Database["public"]["Enums"]["nomination_source"] | null
          status: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          updated_at: string | null
          workflow_status: string | null
        }
        Insert: {
          created_at?: string | null
          created_nominee_id?: string | null
          evidence_urls?: string[] | null
          id?: string
          identity_hash?: string | null
          justification?: string | null
          last_query_at?: string | null
          nominator_id: string
          nominee_bio?: string | null
          nominee_name: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          query_count?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          rubric_version?: string | null
          season_id: string
          sla_deadline?: string | null
          source?: Database["public"]["Enums"]["nomination_source"] | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          updated_at?: string | null
          workflow_status?: string | null
        }
        Update: {
          created_at?: string | null
          created_nominee_id?: string | null
          evidence_urls?: string[] | null
          id?: string
          identity_hash?: string | null
          justification?: string | null
          last_query_at?: string | null
          nominator_id?: string
          nominee_bio?: string | null
          nominee_name?: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          query_count?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          rubric_version?: string | null
          season_id?: string
          sla_deadline?: string | null
          source?: Database["public"]["Enums"]["nomination_source"] | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string
          updated_at?: string | null
          workflow_status?: string | null
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
            foreignKeyName: "nominations_created_nominee_id_fkey"
            columns: ["created_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
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
      nominee_enrichments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          as_of_date: string
          created_at: string
          education_for_all_contributions: string[] | null
          highlights: string[] | null
          id: string
          image_approved: boolean | null
          image_candidates: Json | null
          image_license: string | null
          image_source_url: string | null
          image_type: string | null
          image_url: string | null
          kind: string
          kind_override: boolean | null
          last_generated_at: string | null
          nominee_slug: string
          notes: string | null
          social_links: Json | null
          sources: Json | null
          status: string
          summary_2025: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          as_of_date?: string
          created_at?: string
          education_for_all_contributions?: string[] | null
          highlights?: string[] | null
          id?: string
          image_approved?: boolean | null
          image_candidates?: Json | null
          image_license?: string | null
          image_source_url?: string | null
          image_type?: string | null
          image_url?: string | null
          kind: string
          kind_override?: boolean | null
          last_generated_at?: string | null
          nominee_slug: string
          notes?: string | null
          social_links?: Json | null
          sources?: Json | null
          status?: string
          summary_2025?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          as_of_date?: string
          created_at?: string
          education_for_all_contributions?: string[] | null
          highlights?: string[] | null
          id?: string
          image_approved?: boolean | null
          image_candidates?: Json | null
          image_license?: string | null
          image_source_url?: string | null
          image_type?: string | null
          image_url?: string | null
          kind?: string
          kind_override?: boolean | null
          last_generated_at?: string | null
          nominee_slug?: string
          notes?: string | null
          social_links?: Json | null
          sources?: Json | null
          status?: string
          summary_2025?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      nominees: {
        Row: {
          acceptance_status:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          acceptance_token: string | null
          acceptance_token_expires_at: string | null
          accepted_at: string | null
          bio: string | null
          country: string | null
          created_at: string | null
          email: string | null
          evidence_urls: string[] | null
          final_score: number | null
          first_letter_sent: boolean | null
          id: string
          identity_hash: string | null
          is_platinum: boolean | null
          jury_score: number | null
          logo_url: string | null
          name: string
          nominator_user_id: string | null
          nrc_reviewer_id: string | null
          nrc_verified: boolean | null
          nrc_verified_at: string | null
          organization: string | null
          phone: string | null
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
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          acceptance_token?: string | null
          acceptance_token_expires_at?: string | null
          accepted_at?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          evidence_urls?: string[] | null
          final_score?: number | null
          first_letter_sent?: boolean | null
          id?: string
          identity_hash?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          logo_url?: string | null
          name: string
          nominator_user_id?: string | null
          nrc_reviewer_id?: string | null
          nrc_verified?: boolean | null
          nrc_verified_at?: string | null
          organization?: string | null
          phone?: string | null
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
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          acceptance_token?: string | null
          acceptance_token_expires_at?: string | null
          accepted_at?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          evidence_urls?: string[] | null
          final_score?: number | null
          first_letter_sent?: boolean | null
          id?: string
          identity_hash?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          logo_url?: string | null
          name?: string
          nominator_user_id?: string | null
          nrc_reviewer_id?: string | null
          nrc_verified?: boolean | null
          nrc_verified_at?: string | null
          organization?: string | null
          phone?: string | null
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
      notifications: {
        Row: {
          channels: string[] | null
          created_at: string | null
          error_message: string | null
          id: string
          idempotency_key: string | null
          payload: Json | null
          read_at: string | null
          recipient_email: string | null
          recipient_id: string | null
          recipient_phone: string | null
          retry_count: number | null
          scheduled_for: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"] | null
          subject: string | null
          template: string
          updated_at: string | null
        }
        Insert: {
          channels?: string[] | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          payload?: Json | null
          read_at?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"] | null
          subject?: string | null
          template: string
          updated_at?: string | null
        }
        Update: {
          channels?: string[] | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          payload?: Json | null
          read_at?: string | null
          recipient_email?: string | null
          recipient_id?: string | null
          recipient_phone?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"] | null
          subject?: string | null
          template?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      nrc_assignment_rules: {
        Row: {
          config: Json | null
          created_at: string | null
          escalation_hours: number | null
          id: string
          is_active: boolean | null
          max_reviewers: number | null
          min_reviewers: number | null
          rule_name: string
          rule_type: string
          sla_hours: number | null
          updated_at: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          escalation_hours?: number | null
          id?: string
          is_active?: boolean | null
          max_reviewers?: number | null
          min_reviewers?: number | null
          rule_name: string
          rule_type: string
          sla_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          escalation_hours?: number | null
          id?: string
          is_active?: boolean | null
          max_reviewers?: number | null
          min_reviewers?: number | null
          rule_name?: string
          rule_type?: string
          sla_hours?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nrc_evidence_queries: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          nomination_id: string
          query_text: string
          query_type: string
          required_evidence_types: string[] | null
          resolved_at: string | null
          responded_at: string | null
          response_evidence_urls: string[] | null
          response_text: string | null
          reviewer_user_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          nomination_id: string
          query_text: string
          query_type: string
          required_evidence_types?: string[] | null
          resolved_at?: string | null
          responded_at?: string | null
          response_evidence_urls?: string[] | null
          response_text?: string | null
          reviewer_user_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          nomination_id?: string
          query_text?: string
          query_type?: string
          required_evidence_types?: string[] | null
          resolved_at?: string | null
          responded_at?: string | null
          response_evidence_urls?: string[] | null
          response_text?: string | null
          reviewer_user_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nrc_evidence_queries_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
        ]
      }
      nrc_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by: string
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          status?: string
          token?: string
        }
        Relationships: []
      }
      nrc_members: {
        Row: {
          approval_rate: number | null
          assigned_region: string | null
          avg_review_time_hours: number | null
          category_checks: number | null
          created_at: string | null
          current_assignments: number | null
          evidence_checks: number | null
          id: string
          identity_checks: number | null
          invited_by: string | null
          is_available: boolean | null
          joined_at: string | null
          last_active_at: string | null
          max_queue_size: number | null
          nrc_role: string | null
          review_count: number | null
          specialization: string[] | null
          status: string
          total_reviews: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          approval_rate?: number | null
          assigned_region?: string | null
          avg_review_time_hours?: number | null
          category_checks?: number | null
          created_at?: string | null
          current_assignments?: number | null
          evidence_checks?: number | null
          id?: string
          identity_checks?: number | null
          invited_by?: string | null
          is_available?: boolean | null
          joined_at?: string | null
          last_active_at?: string | null
          max_queue_size?: number | null
          nrc_role?: string | null
          review_count?: number | null
          specialization?: string[] | null
          status?: string
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          approval_rate?: number | null
          assigned_region?: string | null
          avg_review_time_hours?: number | null
          category_checks?: number | null
          created_at?: string | null
          current_assignments?: number | null
          evidence_checks?: number | null
          id?: string
          identity_checks?: number | null
          invited_by?: string | null
          is_available?: boolean | null
          joined_at?: string | null
          last_active_at?: string | null
          max_queue_size?: number | null
          nrc_role?: string | null
          review_count?: number | null
          specialization?: string[] | null
          status?: string
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nrc_queue: {
        Row: {
          assigned_by: string | null
          assigned_to: string
          completed_at: string | null
          created_at: string | null
          due_date: string | null
          id: string
          nomination_id: string
          notes: string | null
          priority: number | null
          started_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_to: string
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          nomination_id: string
          notes?: string | null
          priority?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string
          completed_at?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          nomination_id?: string
          notes?: string | null
          priority?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nrc_queue_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: true
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
        ]
      }
      nrc_reviews: {
        Row: {
          category_fit: boolean | null
          completed_at: string | null
          created_at: string | null
          decision: string
          duplication_status: string | null
          evidence_authenticity: string | null
          evidence_sufficiency: number | null
          id: string
          identity_match: boolean | null
          nomination_id: string
          review_type: string
          reviewer_notes: string | null
          reviewer_user_id: string
          started_at: string | null
          suggested_category_id: string | null
          suggested_subcategory_id: string | null
          timeframe_fit: boolean | null
        }
        Insert: {
          category_fit?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          decision: string
          duplication_status?: string | null
          evidence_authenticity?: string | null
          evidence_sufficiency?: number | null
          id?: string
          identity_match?: boolean | null
          nomination_id: string
          review_type: string
          reviewer_notes?: string | null
          reviewer_user_id: string
          started_at?: string | null
          suggested_category_id?: string | null
          suggested_subcategory_id?: string | null
          timeframe_fit?: boolean | null
        }
        Update: {
          category_fit?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          decision?: string
          duplication_status?: string | null
          evidence_authenticity?: string | null
          evidence_sufficiency?: number | null
          id?: string
          identity_match?: boolean | null
          nomination_id?: string
          review_type?: string
          reviewer_notes?: string | null
          reviewer_user_id?: string
          started_at?: string | null
          suggested_category_id?: string | null
          suggested_subcategory_id?: string | null
          timeframe_fit?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "nrc_reviews_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_reviews_suggested_category_id_fkey"
            columns: ["suggested_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_reviews_suggested_subcategory_id_fkey"
            columns: ["suggested_subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      nrc_verification_summaries: {
        Row: {
          ai_evidence_score: number | null
          ai_recommendation: string | null
          approve_count: number | null
          category_verified: boolean | null
          created_at: string | null
          decision_at: string | null
          evidence_verified: boolean | null
          final_decision: string
          id: string
          identity_verified: boolean | null
          lead_reviewer_id: string | null
          nomination_id: string
          nominee_id: string | null
          primary_reviewer_id: string | null
          reject_count: number | null
          review_count: number | null
          risk_cleared: boolean | null
          secondary_reviewer_id: string | null
          summary_generated_at: string | null
          summary_pdf_url: string | null
          updated_at: string | null
        }
        Insert: {
          ai_evidence_score?: number | null
          ai_recommendation?: string | null
          approve_count?: number | null
          category_verified?: boolean | null
          created_at?: string | null
          decision_at?: string | null
          evidence_verified?: boolean | null
          final_decision: string
          id?: string
          identity_verified?: boolean | null
          lead_reviewer_id?: string | null
          nomination_id: string
          nominee_id?: string | null
          primary_reviewer_id?: string | null
          reject_count?: number | null
          review_count?: number | null
          risk_cleared?: boolean | null
          secondary_reviewer_id?: string | null
          summary_generated_at?: string | null
          summary_pdf_url?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_evidence_score?: number | null
          ai_recommendation?: string | null
          approve_count?: number | null
          category_verified?: boolean | null
          created_at?: string | null
          decision_at?: string | null
          evidence_verified?: boolean | null
          final_decision?: string
          id?: string
          identity_verified?: boolean | null
          lead_reviewer_id?: string | null
          nomination_id?: string
          nominee_id?: string | null
          primary_reviewer_id?: string | null
          reject_count?: number | null
          review_count?: number | null
          risk_cleared?: boolean | null
          secondary_reviewer_id?: string | null
          summary_generated_at?: string | null
          summary_pdf_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nrc_verification_summaries_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: true
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_verification_summaries_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_verification_summaries_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          product_image_url: string | null
          product_name: string
          quantity: number
          unit_price_usd: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          product_image_url?: string | null
          product_name: string
          quantity?: number
          unit_price_usd: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          product_image_url?: string | null
          product_name?: string
          quantity?: number
          unit_price_usd?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          agc_bonus_amount: number | null
          created_at: string | null
          email: string
          fulfilled_at: string | null
          full_name: string
          fx_markup_amount: number | null
          fx_rate: number | null
          id: string
          impact_destination:
            | Database["public"]["Enums"]["impact_destination"]
            | null
          paid_at: string | null
          pay_amount_total: number | null
          pay_currency: string | null
          phone: string | null
          provider: string | null
          provider_ref: string | null
          receipt_number: string | null
          receipt_payload_json: Json | null
          referral_code: string | null
          referrer_user_id: string | null
          refunded_at: string | null
          shipping_usd: number | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal_usd: number
          total_usd: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agc_bonus_amount?: number | null
          created_at?: string | null
          email: string
          fulfilled_at?: string | null
          full_name: string
          fx_markup_amount?: number | null
          fx_rate?: number | null
          id?: string
          impact_destination?:
            | Database["public"]["Enums"]["impact_destination"]
            | null
          paid_at?: string | null
          pay_amount_total?: number | null
          pay_currency?: string | null
          phone?: string | null
          provider?: string | null
          provider_ref?: string | null
          receipt_number?: string | null
          receipt_payload_json?: Json | null
          referral_code?: string | null
          referrer_user_id?: string | null
          refunded_at?: string | null
          shipping_usd?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_usd: number
          total_usd: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agc_bonus_amount?: number | null
          created_at?: string | null
          email?: string
          fulfilled_at?: string | null
          full_name?: string
          fx_markup_amount?: number | null
          fx_rate?: number | null
          id?: string
          impact_destination?:
            | Database["public"]["Enums"]["impact_destination"]
            | null
          paid_at?: string | null
          pay_amount_total?: number | null
          pay_currency?: string | null
          phone?: string | null
          provider?: string | null
          provider_ref?: string | null
          receipt_number?: string | null
          receipt_payload_json?: Json | null
          referral_code?: string | null
          referrer_user_id?: string | null
          refunded_at?: string | null
          shipping_usd?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_usd?: number
          total_usd?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      partnership_leads: {
        Row: {
          amount: number | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          interest_area: string | null
          lead_type: string
          name: string
          notes: string | null
          organization: string | null
          phone: string | null
          status: string
          tier: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          country?: string | null
          created_at?: string | null
          email: string
          id?: string
          interest_area?: string | null
          lead_type?: string
          name: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          status?: string
          tier?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          interest_area?: string | null
          lead_type?: string
          name?: string
          notes?: string | null
          organization?: string | null
          phone?: string | null
          status?: string
          tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          account_id: string
          agc_amount: number
          amount_usd: number
          chapter_id: string | null
          created_at: string | null
          exchange_rate: number | null
          expires_at: string | null
          id: string
          is_settled: boolean | null
          metadata: Json | null
          net_amount: number | null
          processor_fee: number | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_ref: string | null
          settled_at: string | null
          settled_run_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
        }
        Insert: {
          account_id: string
          agc_amount: number
          amount_usd: number
          chapter_id?: string | null
          created_at?: string | null
          exchange_rate?: number | null
          expires_at?: string | null
          id?: string
          is_settled?: boolean | null
          metadata?: Json | null
          net_amount?: number | null
          processor_fee?: number | null
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_ref?: string | null
          settled_at?: string | null
          settled_run_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          agc_amount?: number
          amount_usd?: number
          chapter_id?: string | null
          created_at?: string | null
          exchange_rate?: number | null
          expires_at?: string | null
          id?: string
          is_settled?: boolean | null
          metadata?: Json | null
          net_amount?: number | null
          processor_fee?: number | null
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_ref?: string | null
          settled_at?: string | null
          settled_run_id?: string | null
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
          {
            foreignKeyName: "payment_intents_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_intents_settled_run_id_fkey"
            columns: ["settled_run_id"]
            isOneToOne: false
            referencedRelation: "settlement_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          impact_default:
            | Database["public"]["Enums"]["impact_destination"]
            | null
          is_active: boolean | null
          is_limited: boolean | null
          name: string
          price_usd: number
          slug: string
          stock_qty: number | null
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          impact_default?:
            | Database["public"]["Enums"]["impact_destination"]
            | null
          is_active?: boolean | null
          is_limited?: boolean | null
          name: string
          price_usd: number
          slug: string
          stock_qty?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          impact_default?:
            | Database["public"]["Enums"]["impact_destination"]
            | null
          is_active?: boolean | null
          is_limited?: boolean | null
          name?: string
          price_usd?: number
          slug?: string
          stock_qty?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "profiles_referred_by_user_id_fkey"
            columns: ["referred_by_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
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
          {
            foreignKeyName: "referral_events_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
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
      renominations: {
        Row: {
          award_slug: string | null
          award_title: string | null
          contact_email: string | null
          created_at: string
          group_name: string | null
          group_slug: string | null
          id: string
          nominee_id: string | null
          nominee_name: string
          nominee_slug: string
          note: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          subcategory_slug: string | null
          subcategory_title: string | null
          submitter_id: string | null
          submitter_session_id: string | null
          updated_achievement: string | null
          updated_at: string | null
          updated_country: string | null
          updated_name: string | null
          updated_state: string | null
        }
        Insert: {
          award_slug?: string | null
          award_title?: string | null
          contact_email?: string | null
          created_at?: string
          group_name?: string | null
          group_slug?: string | null
          id?: string
          nominee_id?: string | null
          nominee_name: string
          nominee_slug: string
          note?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subcategory_slug?: string | null
          subcategory_title?: string | null
          submitter_id?: string | null
          submitter_session_id?: string | null
          updated_achievement?: string | null
          updated_at?: string | null
          updated_country?: string | null
          updated_name?: string | null
          updated_state?: string | null
        }
        Update: {
          award_slug?: string | null
          award_title?: string | null
          contact_email?: string | null
          created_at?: string
          group_name?: string | null
          group_slug?: string | null
          id?: string
          nominee_id?: string | null
          nominee_name?: string
          nominee_slug?: string
          note?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          subcategory_slug?: string | null
          subcategory_title?: string | null
          submitter_id?: string | null
          submitter_session_id?: string | null
          updated_achievement?: string | null
          updated_at?: string | null
          updated_country?: string | null
          updated_name?: string | null
          updated_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "renominations_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renominations_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      results: {
        Row: {
          category_id: string
          computation_id: string | null
          computation_inputs: Json | null
          computation_log: string | null
          computed_at: string | null
          contest_id: string | null
          created_at: string | null
          final_score: number | null
          id: string
          is_winner: boolean | null
          jury_score: number | null
          nominee_id: string
          public_score: number | null
          public_votes: number | null
          published_at: string | null
          published_by: string | null
          rank: number | null
          result_status: string | null
          season_id: string
          subcategory_id: string | null
          tier: string | null
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          category_id: string
          computation_id?: string | null
          computation_inputs?: Json | null
          computation_log?: string | null
          computed_at?: string | null
          contest_id?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string
          is_winner?: boolean | null
          jury_score?: number | null
          nominee_id: string
          public_score?: number | null
          public_votes?: number | null
          published_at?: string | null
          published_by?: string | null
          rank?: number | null
          result_status?: string | null
          season_id: string
          subcategory_id?: string | null
          tier?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          category_id?: string
          computation_id?: string | null
          computation_inputs?: Json | null
          computation_log?: string | null
          computed_at?: string | null
          contest_id?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string
          is_winner?: boolean | null
          jury_score?: number | null
          nominee_id?: string
          public_score?: number | null
          public_votes?: number | null
          published_at?: string | null
          published_by?: string | null
          rank?: number | null
          result_status?: string | null
          season_id?: string
          subcategory_id?: string | null
          tier?: string | null
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
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
            foreignKeyName: "results_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
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
            foreignKeyName: "results_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
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
      settlement_adjustments: {
        Row: {
          adjustment_type: string
          amount: number
          created_at: string | null
          currency: string
          fund_reversals: Json
          id: string
          original_payment_id: string | null
          reason: string | null
          settlement_run_id: string | null
        }
        Insert: {
          adjustment_type: string
          amount: number
          created_at?: string | null
          currency?: string
          fund_reversals?: Json
          id?: string
          original_payment_id?: string | null
          reason?: string | null
          settlement_run_id?: string | null
        }
        Update: {
          adjustment_type?: string
          amount?: number
          created_at?: string | null
          currency?: string
          fund_reversals?: Json
          id?: string
          original_payment_id?: string | null
          reason?: string | null
          settlement_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlement_adjustments_settlement_run_id_fkey"
            columns: ["settlement_run_id"]
            isOneToOne: false
            referencedRelation: "settlement_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          idempotency_key: string
          payments_processed: number | null
          status: Database["public"]["Enums"]["settlement_status"]
          totals_json: Json | null
          window_end: string
          window_start: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          idempotency_key: string
          payments_processed?: number | null
          status?: Database["public"]["Enums"]["settlement_status"]
          totals_json?: Json | null
          window_end: string
          window_start: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string
          payments_processed?: number | null
          status?: Database["public"]["Enums"]["settlement_status"]
          totals_json?: Json | null
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      settlement_split_rules: {
        Row: {
          allocations: Json
          created_at: string | null
          id: string
          is_enabled: boolean | null
          scope: string
          updated_at: string | null
        }
        Insert: {
          allocations: Json
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          scope?: string
          updated_at?: string | null
        }
        Update: {
          allocations?: Json
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          scope?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string | null
          id: string
          order_id: string
          postal_code: string | null
          state: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string | null
          id?: string
          order_id: string
          postal_code?: string | null
          state?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          order_id?: string
          postal_code?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_campaigns: {
        Row: {
          created_at: string | null
          credit_per_claim_agc: number
          end_at: string
          id: string
          landing_slug: string | null
          name: string
          pool_remaining_agc: number
          pool_total_agc: number
          sponsor_id: string
          start_at: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          credit_per_claim_agc?: number
          end_at: string
          id?: string
          landing_slug?: string | null
          name: string
          pool_remaining_agc?: number
          pool_total_agc?: number
          sponsor_id: string
          start_at: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          credit_per_claim_agc?: number
          end_at?: string
          id?: string
          landing_slug?: string | null
          name?: string
          pool_remaining_agc?: number
          pool_total_agc?: number
          sponsor_id?: string
          start_at?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_campaigns_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_claims: {
        Row: {
          amount_agc: number
          campaign_id: string
          created_at: string | null
          id: string
          reason: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_agc: number
          campaign_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_agc?: number
          campaign_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_claims_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sponsor_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_clicks: {
        Row: {
          anon_id: string | null
          campaign_id: string | null
          created_at: string | null
          id: string
          ip_hash: string | null
          link_id: string | null
          user_id: string | null
        }
        Insert: {
          anon_id?: string | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          link_id?: string | null
          user_id?: string | null
        }
        Update: {
          anon_id?: string | null
          campaign_id?: string | null
          created_at?: string | null
          id?: string
          ip_hash?: string | null
          link_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_clicks_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sponsor_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "sponsor_links"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_links: {
        Row: {
          campaign_id: string
          code: string
          created_at: string | null
          id: string
          source: string | null
        }
        Insert: {
          campaign_id: string
          code: string
          created_at?: string | null
          id?: string
          source?: string | null
        }
        Update: {
          campaign_id?: string
          code?: string
          created_at?: string | null
          id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sponsor_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          created_at: string | null
          cta_links_json: Json | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          status: string
          tier: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          cta_links_json?: Json | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          status?: string
          tier?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          cta_links_json?: Json | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          status?: string
          tier?: string
          updated_at?: string | null
          website_url?: string | null
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
      vote_rejections: {
        Row: {
          contest_id: string | null
          created_at: string | null
          device_hash: string | null
          id: string
          ip_hash: string | null
          metadata: Json | null
          nominee_id: string | null
          rejection_reason: Database["public"]["Enums"]["vote_rejection_reason"]
          season_id: string | null
          voter_id: string | null
        }
        Insert: {
          contest_id?: string | null
          created_at?: string | null
          device_hash?: string | null
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          nominee_id?: string | null
          rejection_reason: Database["public"]["Enums"]["vote_rejection_reason"]
          season_id?: string | null
          voter_id?: string | null
        }
        Update: {
          contest_id?: string | null
          created_at?: string | null
          device_hash?: string | null
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          nominee_id?: string | null
          rejection_reason?: Database["public"]["Enums"]["vote_rejection_reason"]
          season_id?: string | null
          voter_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vote_rejections_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vote_rejections_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          category_id: string | null
          comment: string | null
          contest_id: string | null
          created_at: string | null
          device_hash: string | null
          id: string
          ip_hash: string | null
          nominee_id: string
          score: number | null
          season_id: string
          subcategory_id: string | null
          vote_type: Database["public"]["Enums"]["vote_type"]
          voter_id: string
        }
        Insert: {
          category_id?: string | null
          comment?: string | null
          contest_id?: string | null
          created_at?: string | null
          device_hash?: string | null
          id?: string
          ip_hash?: string | null
          nominee_id: string
          score?: number | null
          season_id: string
          subcategory_id?: string | null
          vote_type: Database["public"]["Enums"]["vote_type"]
          voter_id: string
        }
        Update: {
          category_id?: string | null
          comment?: string | null
          contest_id?: string | null
          created_at?: string | null
          device_hash?: string | null
          id?: string
          ip_hash?: string | null
          nominee_id?: string
          score?: number | null
          season_id?: string
          subcategory_id?: string | null
          vote_type?: Database["public"]["Enums"]["vote_type"]
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
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
      wallet_transactions: {
        Row: {
          account_id: string
          amount_agc: number
          amount_agcc: number
          balance_agc_after: number
          balance_agcc_after: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          source: Database["public"]["Enums"]["agc_source"] | null
          tx_type: Database["public"]["Enums"]["wallet_tx_type"]
        }
        Insert: {
          account_id: string
          amount_agc?: number
          amount_agcc?: number
          balance_agc_after?: number
          balance_agcc_after?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          source?: Database["public"]["Enums"]["agc_source"] | null
          tx_type: Database["public"]["Enums"]["wallet_tx_type"]
        }
        Update: {
          account_id?: string
          amount_agc?: number
          amount_agcc?: number
          balance_agc_after?: number
          balance_agcc_after?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          source?: Database["public"]["Enums"]["agc_source"] | null
          tx_type?: Database["public"]["Enums"]["wallet_tx_type"]
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "wallet_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "wallet_balances"
            referencedColumns: ["account_id"]
          },
        ]
      }
    }
    Views: {
      public_nominees: {
        Row: {
          acceptance_status:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          bio: string | null
          country: string | null
          created_at: string | null
          final_score: number | null
          id: string | null
          is_platinum: boolean | null
          jury_score: number | null
          logo_url: string | null
          name: string | null
          nrc_verified: boolean | null
          organization: string | null
          photo_url: string | null
          public_votes: number | null
          region: string | null
          renomination_count: number | null
          season_id: string | null
          slug: string | null
          status: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          logo_url?: string | null
          name?: string | null
          nrc_verified?: boolean | null
          organization?: string | null
          photo_url?: string | null
          public_votes?: number | null
          region?: string | null
          renomination_count?: number | null
          season_id?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          bio?: string | null
          country?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          logo_url?: string | null
          name?: string | null
          nrc_verified?: boolean | null
          organization?: string | null
          photo_url?: string | null
          public_votes?: number | null
          region?: string | null
          renomination_count?: number | null
          season_id?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string | null
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
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          account_id: string | null
          agc_bonus: number | null
          agc_non_withdrawable: number | null
          agc_total: number | null
          agc_withdrawable: number | null
          balance_agc: number | null
          balance_agcc: number | null
          created_at: string | null
          currency: string | null
          is_active: boolean | null
          owner_id: string | null
          owner_type: Database["public"]["Enums"]["wallet_owner_type"] | null
          updated_at: string | null
          usd_balance: number | null
        }
        Insert: {
          account_id?: string | null
          agc_bonus?: never
          agc_non_withdrawable?: never
          agc_total?: never
          agc_withdrawable?: never
          balance_agc?: never
          balance_agcc?: never
          created_at?: string | null
          currency?: string | null
          is_active?: boolean | null
          owner_id?: string | null
          owner_type?: Database["public"]["Enums"]["wallet_owner_type"] | null
          updated_at?: string | null
          usd_balance?: never
        }
        Update: {
          account_id?: string | null
          agc_bonus?: never
          agc_non_withdrawable?: never
          agc_total?: never
          agc_withdrawable?: never
          balance_agc?: never
          balance_agcc?: never
          created_at?: string | null
          currency?: string | null
          is_active?: boolean | null
          owner_id?: string | null
          owner_type?: Database["public"]["Enums"]["wallet_owner_type"] | null
          updated_at?: string | null
          usd_balance?: never
        }
        Relationships: []
      }
    }
    Functions: {
      assign_nrc_reviewers: {
        Args: { p_nomination_id: string; p_num_reviewers?: number }
        Returns: Json
      }
      auto_assign_nrc_nomination: {
        Args: { p_nomination_id: string }
        Returns: string
      }
      check_certificate_unlock: {
        Args: { p_nominee_id: string }
        Returns: boolean
      }
      check_nrc_quorum: { Args: { p_nomination_id: string }; Returns: Json }
      compute_blue_garnet_results: {
        Args: { p_season_id: string }
        Returns: Json
      }
      compute_gold_results: { Args: { p_season_id: string }; Returns: Json }
      detect_vote_fraud: { Args: { p_season_id: string }; Returns: Json }
      ensure_user_wallet: { Args: { _user_id: string }; Returns: string }
      escalate_overdue_nrc_assignments: { Args: never; Returns: number }
      generate_identity_hash: {
        Args: {
          p_country?: string
          p_email?: string
          p_name: string
          p_phone?: string
        }
        Returns: string
      }
      generate_receipt_number: { Args: never; Returns: string }
      generate_referral_code: { Args: { p_prefix?: string }; Returns: string }
      get_current_season: { Args: never; Returns: string }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      get_user_wallet: { Args: { p_user_id: string }; Returns: string }
      get_user_wallet_balance: {
        Args: { _user_id: string }
        Returns: {
          account_id: string
          balance_agc: number
          balance_agcc: number
        }[]
      }
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
      publish_results: {
        Args: { p_contest_type: string; p_season_id: string }
        Returns: Json
      }
      record_wallet_transaction: {
        Args: {
          _account_id: string
          _amount_agc: number
          _amount_agcc: number
          _created_by?: string
          _description?: string
          _metadata?: Json
          _reference_id?: string
          _reference_type?: string
          _source: Database["public"]["Enums"]["agc_source"]
          _tx_type: Database["public"]["Enums"]["wallet_tx_type"]
        }
        Returns: {
          account_id: string
          amount_agc: number
          amount_agcc: number
          balance_agc_after: number
          balance_agcc_after: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          source: Database["public"]["Enums"]["agc_source"] | null
          tx_type: Database["public"]["Enums"]["wallet_tx_type"]
        }
        SetofOptions: {
          from: "*"
          to: "wallet_transactions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      acceptance_status: "PENDING" | "SENT" | "ACCEPTED" | "DECLINED"
      agc_source:
        | "DAILY_SIGNIN"
        | "NOMINATION_VERIFIED"
        | "REFERRAL_SIGNUP"
        | "REFERRAL_FIRST_PAYMENT"
        | "REFERRAL_SECOND_PAYMENT"
        | "WATCH_TV"
        | "SOCIAL_SHARE"
        | "SPONSOR_FUNDED"
        | "CONVERSION"
        | "VOTE_SPEND"
        | "ADMIN_BONUS"
        | "PURCHASE_BONUS"
        | "WELCOME_CREDITS"
      ai_recommendation:
        | "RECOMMEND_ELIGIBLE"
        | "RECOMMEND_INELIGIBLE"
        | "NEEDS_MORE_EVIDENCE"
        | "FLAG_FOR_RISK_REVIEW"
      app_role: "user" | "nrc" | "jury" | "chapter" | "sponsor" | "admin"
      certificate_status: "ACTIVE" | "EXPIRED" | "REVOKED" | "RENEWED"
      certificate_tier: "gold" | "platinum" | "blue_garnet" | "icon"
      contest_type:
        | "GOLD_PUBLIC"
        | "BLUE_PUBLIC"
        | "BLUE_JUDGES"
        | "ICON_LIFETIME_JUDGES"
      disbursement_status: "DRAFT" | "COMPLETED" | "FAILED"
      impact_destination:
        | "REBUILD_MY_SCHOOL"
        | "EDUAID_AFRICA"
        | "SPONSOR_STUDENT"
        | "TVET_GRANT"
      misuse_report_status:
        | "PENDING"
        | "REVIEWING"
        | "FLAGGED"
        | "DISMISSED"
        | "REVOKED"
      nomination_source: "START_MEMBER" | "NRC" | "PUBLIC"
      nomination_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "platinum"
      notification_status: "PENDING" | "SENT" | "FAILED" | "READ"
      nrc_review_decision:
        | "APPROVE"
        | "REJECT"
        | "REQUEST_MORE_EVIDENCE"
        | "RECLASSIFY"
        | "ESCALATE"
      nrc_reviewer_role: "nrc_reviewer" | "nrc_lead" | "nrc_auditor"
      nrc_workflow_status:
        | "DRAFT"
        | "SUBMITTED_PENDING_ACCEPTANCE"
        | "DECLINED"
        | "ACCEPTED_PENDING_NRC"
        | "NRC_ASSIGNED"
        | "NRC_IN_REVIEW"
        | "NRC_QUERY_SENT"
        | "VERIFIED_BY_NRC"
        | "REJECTED_BY_NRC"
        | "PUBLISHED_FOR_VOTING"
      order_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "FULFILLED"
      payment_provider: "PAYSTACK" | "FLUTTERWAVE" | "LEMFI" | "TAPTAPSEND"
      payment_status:
        | "INITIATED"
        | "PENDING"
        | "SUCCESS"
        | "FAILED"
        | "CANCELLED"
      product_category: "APPAREL" | "ACCESSORIES" | "LIMITED" | "BUNDLES"
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
      settlement_status: "STARTED" | "PROCESSING" | "COMPLETED" | "FAILED"
      stage_action:
        | "nominations"
        | "public_voting"
        | "jury_scoring"
        | "results"
        | "certificates"
      transaction_status: "pending" | "confirmed" | "failed" | "refunded"
      transaction_type: "donation" | "sponsorship" | "ticket"
      transfer_status:
        | "CREATED"
        | "PENDING"
        | "PROCESSING"
        | "SENT"
        | "CONFIRMED"
        | "FAILED"
      vote_rejection_reason:
        | "DUPLICATE_VOTE"
        | "STAGE_CLOSED"
        | "NOT_VERIFIED"
        | "NOT_ELIGIBLE"
        | "INSUFFICIENT_BALANCE"
        | "COI_CONFLICT"
        | "RATE_LIMITED"
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
      wallet_tx_type:
        | "EARN"
        | "CONVERT"
        | "SPEND"
        | "ADJUSTMENT"
        | "REVERSAL"
        | "TRANSFER_IN"
        | "TRANSFER_OUT"
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
      acceptance_status: ["PENDING", "SENT", "ACCEPTED", "DECLINED"],
      agc_source: [
        "DAILY_SIGNIN",
        "NOMINATION_VERIFIED",
        "REFERRAL_SIGNUP",
        "REFERRAL_FIRST_PAYMENT",
        "REFERRAL_SECOND_PAYMENT",
        "WATCH_TV",
        "SOCIAL_SHARE",
        "SPONSOR_FUNDED",
        "CONVERSION",
        "VOTE_SPEND",
        "ADMIN_BONUS",
        "PURCHASE_BONUS",
        "WELCOME_CREDITS",
      ],
      ai_recommendation: [
        "RECOMMEND_ELIGIBLE",
        "RECOMMEND_INELIGIBLE",
        "NEEDS_MORE_EVIDENCE",
        "FLAG_FOR_RISK_REVIEW",
      ],
      app_role: ["user", "nrc", "jury", "chapter", "sponsor", "admin"],
      certificate_status: ["ACTIVE", "EXPIRED", "REVOKED", "RENEWED"],
      certificate_tier: ["gold", "platinum", "blue_garnet", "icon"],
      contest_type: [
        "GOLD_PUBLIC",
        "BLUE_PUBLIC",
        "BLUE_JUDGES",
        "ICON_LIFETIME_JUDGES",
      ],
      disbursement_status: ["DRAFT", "COMPLETED", "FAILED"],
      impact_destination: [
        "REBUILD_MY_SCHOOL",
        "EDUAID_AFRICA",
        "SPONSOR_STUDENT",
        "TVET_GRANT",
      ],
      misuse_report_status: [
        "PENDING",
        "REVIEWING",
        "FLAGGED",
        "DISMISSED",
        "REVOKED",
      ],
      nomination_source: ["START_MEMBER", "NRC", "PUBLIC"],
      nomination_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
        "platinum",
      ],
      notification_status: ["PENDING", "SENT", "FAILED", "READ"],
      nrc_review_decision: [
        "APPROVE",
        "REJECT",
        "REQUEST_MORE_EVIDENCE",
        "RECLASSIFY",
        "ESCALATE",
      ],
      nrc_reviewer_role: ["nrc_reviewer", "nrc_lead", "nrc_auditor"],
      nrc_workflow_status: [
        "DRAFT",
        "SUBMITTED_PENDING_ACCEPTANCE",
        "DECLINED",
        "ACCEPTED_PENDING_NRC",
        "NRC_ASSIGNED",
        "NRC_IN_REVIEW",
        "NRC_QUERY_SENT",
        "VERIFIED_BY_NRC",
        "REJECTED_BY_NRC",
        "PUBLISHED_FOR_VOTING",
      ],
      order_status: ["PENDING", "PAID", "FAILED", "REFUNDED", "FULFILLED"],
      payment_provider: ["PAYSTACK", "FLUTTERWAVE", "LEMFI", "TAPTAPSEND"],
      payment_status: [
        "INITIATED",
        "PENDING",
        "SUCCESS",
        "FAILED",
        "CANCELLED",
      ],
      product_category: ["APPAREL", "ACCESSORIES", "LIMITED", "BUNDLES"],
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
      settlement_status: ["STARTED", "PROCESSING", "COMPLETED", "FAILED"],
      stage_action: [
        "nominations",
        "public_voting",
        "jury_scoring",
        "results",
        "certificates",
      ],
      transaction_status: ["pending", "confirmed", "failed", "refunded"],
      transaction_type: ["donation", "sponsorship", "ticket"],
      transfer_status: [
        "CREATED",
        "PENDING",
        "PROCESSING",
        "SENT",
        "CONFIRMED",
        "FAILED",
      ],
      vote_rejection_reason: [
        "DUPLICATE_VOTE",
        "STAGE_CLOSED",
        "NOT_VERIFIED",
        "NOT_ELIGIBLE",
        "INSUFFICIENT_BALANCE",
        "COI_CONFLICT",
        "RATE_LIMITED",
      ],
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
      wallet_tx_type: [
        "EARN",
        "CONVERT",
        "SPEND",
        "ADJUSTMENT",
        "REVERSAL",
        "TRANSFER_IN",
        "TRANSFER_OUT",
      ],
    },
  },
} as const
