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
      ambassadors: {
        Row: {
          appointed_date: string | null
          bio: string | null
          chapter_id: string | null
          created_at: string
          id: string
          region_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointed_date?: string | null
          bio?: string | null
          chapter_id?: string | null
          created_at?: string
          id?: string
          region_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointed_date?: string | null
          bio?: string | null
          chapter_id?: string | null
          created_at?: string
          id?: string
          region_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ambassadors_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ambassadors_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
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
      award_categories: {
        Row: {
          created_at: string
          group_key: string
          is_published: boolean
          payload: Json
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          group_key: string
          is_published?: boolean
          payload: Json
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          group_key?: string
          is_published?: boolean
          payload?: Json
          slug?: string
          sort_order?: number
          updated_at?: string
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
          country: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
          scope: string
          slug: string
          tier: number | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          scope?: string
          slug: string
          tier?: number | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          scope?: string
          slug?: string
          tier?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories_excel_alias: {
        Row: {
          db_slug: string
          excel_label: string
        }
        Insert: {
          db_slug: string
          excel_label: string
        }
        Update: {
          db_slug?: string
          excel_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_excel_alias_db_slug_fkey"
            columns: ["db_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      certificate_downloads: {
        Row: {
          certificate_id: string
          downloaded_at: string
          id: string
          ip_address: string | null
          nominee_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          certificate_id: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          nominee_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          certificate_id?: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          nominee_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_downloads_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_downloads_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificate_downloads_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
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
          region_id: string | null
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
          region_id?: string | null
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
          region_id?: string | null
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
          {
            foreignKeyName: "chapters_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
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
      contributor_entries: {
        Row: {
          appreciation: string | null
          bio: string | null
          contribution_description: string | null
          contributions: string[]
          country: string | null
          created_at: string
          highlight: string | null
          id: string
          image_url: string | null
          is_custom: boolean
          name: string
          recommendation: string | null
          region: string | null
          role: string
          socials: Json
          title: string | null
          updated_at: string
          updated_by: string | null
          year_end: number | null
          year_start: number
        }
        Insert: {
          appreciation?: string | null
          bio?: string | null
          contribution_description?: string | null
          contributions?: string[]
          country?: string | null
          created_at?: string
          highlight?: string | null
          id: string
          image_url?: string | null
          is_custom?: boolean
          name: string
          recommendation?: string | null
          region?: string | null
          role: string
          socials?: Json
          title?: string | null
          updated_at?: string
          updated_by?: string | null
          year_end?: number | null
          year_start: number
        }
        Update: {
          appreciation?: string | null
          bio?: string | null
          contribution_description?: string | null
          contributions?: string[]
          country?: string | null
          created_at?: string
          highlight?: string | null
          id?: string
          image_url?: string | null
          is_custom?: boolean
          name?: string
          recommendation?: string | null
          region?: string | null
          role?: string
          socials?: Json
          title?: string | null
          updated_at?: string
          updated_by?: string | null
          year_end?: number | null
          year_start?: number
        }
        Relationships: []
      }
      contributor_photos: {
        Row: {
          contributor_id: string
          created_at: string
          image_url: string
          storage_path: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contributor_id: string
          created_at?: string
          image_url: string
          storage_path?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contributor_id?: string
          created_at?: string
          image_url?: string
          storage_path?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      correspondence_branding: {
        Row: {
          chapter_id: string
          created_at: string
          footer_text: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          region_id: string | null
          sender_email: string | null
          sender_name: string
          updated_at: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          footer_text?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          region_id?: string | null
          sender_email?: string | null
          sender_name: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          footer_text?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          region_id?: string | null
          sender_email?: string | null
          sender_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "correspondence_branding_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correspondence_branding_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      country_region_map: {
        Row: {
          country: string
          created_at: string
          id: string
          region_id: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          region_id: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          region_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "country_region_map_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
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
      gallery_collections: {
        Row: {
          cover_image_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_published: boolean
          location: string | null
          slug: string
          sort_order: number
          story: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          slug: string
          sort_order?: number
          story?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          slug?: string
          sort_order?: number
          story?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      gallery_media: {
        Row: {
          alt_text: string
          caption: string | null
          category: string
          collection_slug: string | null
          country: string | null
          created_at: string
          id: string
          image_url: string
          is_featured: boolean
          is_published: boolean
          photographer: string | null
          photographer_credit_url: string | null
          region: string | null
          sort_order: number
          tags: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
          year: number | null
        }
        Insert: {
          alt_text: string
          caption?: string | null
          category: string
          collection_slug?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_featured?: boolean
          is_published?: boolean
          photographer?: string | null
          photographer_credit_url?: string | null
          region?: string | null
          sort_order?: number
          tags?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
          year?: number | null
        }
        Update: {
          alt_text?: string
          caption?: string | null
          category?: string
          collection_slug?: string | null
          country?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_featured?: boolean
          is_published?: boolean
          photographer?: string | null
          photographer_credit_url?: string | null
          region?: string | null
          sort_order?: number
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_media_collection_slug_fkey"
            columns: ["collection_slug"]
            isOneToOne: false
            referencedRelation: "gallery_collections"
            referencedColumns: ["slug"]
          },
        ]
      }
      influencer_impact_nominees: {
        Row: {
          artist_profile_link: string | null
          athlete_status: string | null
          award_category: string
          award_family: string
          club_team_or_foundation: string | null
          content_impact_area: string | null
          created_at: string
          education_impact_summary: string
          evidence_links: string[]
          follower_count_range: string | null
          id: string
          image_url: string | null
          label_or_foundation: string | null
          music_education_impact_area: string | null
          music_genre: string | null
          nominee_country: string
          nominee_name: string
          nominee_region: string
          other_music_genres: string[] | null
          other_platforms: string[] | null
          platform_profile_link: string | null
          primary_social_media_platform: string | null
          primary_sport_area: string | null
          recognition_class: string
          reviewed_at: string | null
          reviewed_by: string | null
          slug: string
          sports_education_impact_area: string | null
          sports_profile_link: string | null
          stage_name: string | null
          submitted_by: string | null
          updated_at: string
          verification_status: string
          verified_nominations: number
        }
        Insert: {
          artist_profile_link?: string | null
          athlete_status?: string | null
          award_category: string
          award_family?: string
          club_team_or_foundation?: string | null
          content_impact_area?: string | null
          created_at?: string
          education_impact_summary?: string
          evidence_links?: string[]
          follower_count_range?: string | null
          id?: string
          image_url?: string | null
          label_or_foundation?: string | null
          music_education_impact_area?: string | null
          music_genre?: string | null
          nominee_country: string
          nominee_name: string
          nominee_region: string
          other_music_genres?: string[] | null
          other_platforms?: string[] | null
          platform_profile_link?: string | null
          primary_social_media_platform?: string | null
          primary_sport_area?: string | null
          recognition_class: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug: string
          sports_education_impact_area?: string | null
          sports_profile_link?: string | null
          stage_name?: string | null
          submitted_by?: string | null
          updated_at?: string
          verification_status?: string
          verified_nominations?: number
        }
        Update: {
          artist_profile_link?: string | null
          athlete_status?: string | null
          award_category?: string
          award_family?: string
          club_team_or_foundation?: string | null
          content_impact_area?: string | null
          created_at?: string
          education_impact_summary?: string
          evidence_links?: string[]
          follower_count_range?: string | null
          id?: string
          image_url?: string | null
          label_or_foundation?: string | null
          music_education_impact_area?: string | null
          music_genre?: string | null
          nominee_country?: string
          nominee_name?: string
          nominee_region?: string
          other_music_genres?: string[] | null
          other_platforms?: string[] | null
          platform_profile_link?: string | null
          primary_social_media_platform?: string | null
          primary_sport_area?: string | null
          recognition_class?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          slug?: string
          sports_education_impact_area?: string | null
          sports_profile_link?: string | null
          stage_name?: string | null
          submitted_by?: string | null
          updated_at?: string
          verification_status?: string
          verified_nominations?: number
        }
        Relationships: []
      }
      judge_activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          judge_id: string
          metadata: Json
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          judge_id: string
          metadata?: Json
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          judge_id?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "judge_activity_logs_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_activity_logs_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges_public"
            referencedColumns: ["id"]
          },
        ]
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
      judge_assignments: {
        Row: {
          assigned_by: string | null
          category_id: string | null
          created_at: string
          due_date: string | null
          id: string
          judge_id: string
          nominee_id: string | null
          notes: string | null
          status: Database["public"]["Enums"]["judge_assignment_status"]
          subcategory_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          category_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          judge_id: string
          nominee_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["judge_assignment_status"]
          subcategory_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          category_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          judge_id?: string
          nominee_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["judge_assignment_status"]
          subcategory_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_assignments_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_assignments_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges_public"
            referencedColumns: ["id"]
          },
        ]
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
      judge_conflicts: {
        Row: {
          category_id: string | null
          conflict_type: string
          created_at: string
          declared_at: string
          description: string | null
          id: string
          judge_id: string
          nominee_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          conflict_type: string
          created_at?: string
          declared_at?: string
          description?: string | null
          id?: string
          judge_id: string
          nominee_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          conflict_type?: string
          created_at?: string
          declared_at?: string
          description?: string | null
          id?: string
          judge_id?: string
          nominee_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_conflicts_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_conflicts_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges_public"
            referencedColumns: ["id"]
          },
        ]
      }
      judge_otp_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
          verified_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
          verified_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
          verified_at?: string
        }
        Relationships: []
      }
      judge_reviews: {
        Row: {
          assignment_id: string | null
          category_id: string | null
          comments: string | null
          created_at: string
          evidence_review: Json
          id: string
          judge_id: string
          nominee_id: string
          recommendation: string | null
          rubric_scores: Json
          score: number | null
          status: Database["public"]["Enums"]["judge_review_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assignment_id?: string | null
          category_id?: string | null
          comments?: string | null
          created_at?: string
          evidence_review?: Json
          id?: string
          judge_id: string
          nominee_id: string
          recommendation?: string | null
          rubric_scores?: Json
          score?: number | null
          status?: Database["public"]["Enums"]["judge_review_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string | null
          category_id?: string | null
          comments?: string | null
          created_at?: string
          evidence_review?: Json
          id?: string
          judge_id?: string
          nominee_id?: string
          recommendation?: string | null
          rubric_scores?: Json
          score?: number | null
          status?: Database["public"]["Enums"]["judge_review_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_reviews_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "judge_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_reviews_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_reviews_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "judges_public"
            referencedColumns: ["id"]
          },
        ]
      }
      judges: {
        Row: {
          application_id: string | null
          bio: string | null
          contribution_score: number
          country_origin: string | null
          country_residence: string | null
          created_at: string
          email: string | null
          expertise_areas: string[]
          featured: boolean
          full_name: string
          id: string
          judge_status: Database["public"]["Enums"]["judge_status"]
          languages: string[]
          organization: string | null
          phone: string | null
          photo_url: string | null
          professional_title: string | null
          profile_visibility: Database["public"]["Enums"]["judge_profile_visibility"]
          public_contribution_statement: string | null
          region: string | null
          slug: string
          social_links: Json
          updated_at: string
          user_id: string | null
          verification_status: Database["public"]["Enums"]["judge_verification_status"]
        }
        Insert: {
          application_id?: string | null
          bio?: string | null
          contribution_score?: number
          country_origin?: string | null
          country_residence?: string | null
          created_at?: string
          email?: string | null
          expertise_areas?: string[]
          featured?: boolean
          full_name: string
          id?: string
          judge_status?: Database["public"]["Enums"]["judge_status"]
          languages?: string[]
          organization?: string | null
          phone?: string | null
          photo_url?: string | null
          professional_title?: string | null
          profile_visibility?: Database["public"]["Enums"]["judge_profile_visibility"]
          public_contribution_statement?: string | null
          region?: string | null
          slug: string
          social_links?: Json
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["judge_verification_status"]
        }
        Update: {
          application_id?: string | null
          bio?: string | null
          contribution_score?: number
          country_origin?: string | null
          country_residence?: string | null
          created_at?: string
          email?: string | null
          expertise_areas?: string[]
          featured?: boolean
          full_name?: string
          id?: string
          judge_status?: Database["public"]["Enums"]["judge_status"]
          languages?: string[]
          organization?: string | null
          phone?: string | null
          photo_url?: string | null
          professional_title?: string | null
          profile_visibility?: Database["public"]["Enums"]["judge_profile_visibility"]
          public_contribution_statement?: string | null
          region?: string | null
          slug?: string
          social_links?: Json
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["judge_verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "judges_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "judge_applications"
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
      legacy_category_mappings: {
        Row: {
          created_at: string | null
          id: string
          legacy_category: string
          legacy_subcategory: string
          new_subcategory_id: string | null
          notes: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          legacy_category: string
          legacy_subcategory: string
          new_subcategory_id?: string | null
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          legacy_category?: string
          legacy_subcategory?: string
          new_subcategory_id?: string | null
          notes?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legacy_category_mappings_new_subcategory_id_fkey"
            columns: ["new_subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
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
      media_assets: {
        Row: {
          alt_text: string | null
          aspect_ratio: number | null
          bucket: string
          created_at: string
          file_hash: string
          file_path: string
          file_size_bytes: number
          height: number | null
          id: string
          kind: string
          media_status: string
          media_verified: boolean
          metadata: Json
          mime_type: string
          nominee_id: string | null
          owner_user_id: string | null
          public_url: string
          quality_score: number
          rejection_reason: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          aspect_ratio?: number | null
          bucket?: string
          created_at?: string
          file_hash: string
          file_path: string
          file_size_bytes: number
          height?: number | null
          id?: string
          kind: string
          media_status?: string
          media_verified?: boolean
          metadata?: Json
          mime_type: string
          nominee_id?: string | null
          owner_user_id?: string | null
          public_url: string
          quality_score?: number
          rejection_reason?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          aspect_ratio?: number | null
          bucket?: string
          created_at?: string
          file_hash?: string
          file_path?: string
          file_size_bytes?: number
          height?: number | null
          id?: string
          kind?: string
          media_status?: string
          media_verified?: boolean
          metadata?: Json
          mime_type?: string
          nominee_id?: string | null
          owner_user_id?: string | null
          public_url?: string
          quality_score?: number
          rejection_reason?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      migration_email_jobs: {
        Row: {
          batch_id: string | null
          created_at: string | null
          email: string
          error_message: string | null
          id: string
          max_retries: number | null
          nominee_id: string | null
          nominee_name: string
          retry_count: number | null
          sent_at: string | null
          status: string
          template_key: string
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          email: string
          error_message?: string | null
          id?: string
          max_retries?: number | null
          nominee_id?: string | null
          nominee_name: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          template_key?: string
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          email?: string
          error_message?: string | null
          id?: string
          max_retries?: number | null
          nominee_id?: string | null
          nominee_name?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          template_key?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "migration_email_jobs_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "migration_email_jobs_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
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
      nomination_ingest_audit: {
        Row: {
          action: string
          actor_id: string | null
          batch_id: string
          canonical_id: string | null
          created_at: string
          id: string
          identity_hash: string | null
          intake_id: string
          new_duplicate_status: string | null
          previous_duplicate_status: string | null
          reason: string
          record_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          batch_id: string
          canonical_id?: string | null
          created_at?: string
          id?: string
          identity_hash?: string | null
          intake_id: string
          new_duplicate_status?: string | null
          previous_duplicate_status?: string | null
          reason: string
          record_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          batch_id?: string
          canonical_id?: string | null
          created_at?: string
          id?: string
          identity_hash?: string | null
          intake_id?: string
          new_duplicate_status?: string | null
          previous_duplicate_status?: string | null
          reason?: string
          record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nomination_ingest_audit_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "nomination_intake"
            referencedColumns: ["id"]
          },
        ]
      }
      nomination_intake: {
        Row: {
          assigned_reviewer: string | null
          award_category: string | null
          award_group: string | null
          award_subcategory: string | null
          duplicate_of: string | null
          duplicate_status: string | null
          evidence_status: string | null
          form_type: string
          id: string
          identity_hash: string | null
          impact_summary_clean: string | null
          ingested_at: string
          ingested_by: string | null
          nomination_status: string | null
          nominee_city_clean: string | null
          nominee_country_clean: string | null
          nominee_name_clean: string | null
          nominee_region_clean: string | null
          nominee_type_clean: string | null
          raw_payload: Json | null
          record_id: string
          reviewer_notes: string | null
          updated_at: string
          verification_status: string | null
          website_sync_status: string | null
        }
        Insert: {
          assigned_reviewer?: string | null
          award_category?: string | null
          award_group?: string | null
          award_subcategory?: string | null
          duplicate_of?: string | null
          duplicate_status?: string | null
          evidence_status?: string | null
          form_type: string
          id?: string
          identity_hash?: string | null
          impact_summary_clean?: string | null
          ingested_at?: string
          ingested_by?: string | null
          nomination_status?: string | null
          nominee_city_clean?: string | null
          nominee_country_clean?: string | null
          nominee_name_clean?: string | null
          nominee_region_clean?: string | null
          nominee_type_clean?: string | null
          raw_payload?: Json | null
          record_id: string
          reviewer_notes?: string | null
          updated_at?: string
          verification_status?: string | null
          website_sync_status?: string | null
        }
        Update: {
          assigned_reviewer?: string | null
          award_category?: string | null
          award_group?: string | null
          award_subcategory?: string | null
          duplicate_of?: string | null
          duplicate_status?: string | null
          evidence_status?: string | null
          form_type?: string
          id?: string
          identity_hash?: string | null
          impact_summary_clean?: string | null
          ingested_at?: string
          ingested_by?: string | null
          nomination_status?: string | null
          nominee_city_clean?: string | null
          nominee_country_clean?: string | null
          nominee_name_clean?: string | null
          nominee_region_clean?: string | null
          nominee_type_clean?: string | null
          raw_payload?: Json | null
          record_id?: string
          reviewer_notes?: string | null
          updated_at?: string
          verification_status?: string | null
          website_sync_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomination_intake_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "nomination_intake"
            referencedColumns: ["id"]
          },
        ]
      }
      nominations: {
        Row: {
          award_category_slug: string | null
          award_family: string | null
          award_subcategory_slug: string | null
          created_at: string | null
          created_nominee_id: string | null
          dedupe_match_id: string | null
          dedupe_score: number | null
          evidence_urls: string[] | null
          id: string
          identity_hash: string | null
          justification: string | null
          last_query_at: string | null
          nominator_id: string | null
          nominee_bio: string | null
          nominee_name: string
          nominee_organization: string | null
          nominee_photo_url: string | null
          nominee_title: string | null
          nrc_reviewer_id: string | null
          publication_status: string
          query_count: number | null
          recognition_class: string | null
          region_slug: string | null
          review_notes: string | null
          reviewed_at: string | null
          rubric_version: string | null
          season_id: string
          sla_deadline: string | null
          source: Database["public"]["Enums"]["nomination_source"] | null
          source_channel: string
          source_form_id: string | null
          source_row_id: string | null
          source_sheet_id: string | null
          state_slug: string | null
          status: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          submission_kind: string
          updated_at: string | null
          verification_tier: string | null
          workflow_status: string | null
          zone_slug: string | null
        }
        Insert: {
          award_category_slug?: string | null
          award_family?: string | null
          award_subcategory_slug?: string | null
          created_at?: string | null
          created_nominee_id?: string | null
          dedupe_match_id?: string | null
          dedupe_score?: number | null
          evidence_urls?: string[] | null
          id?: string
          identity_hash?: string | null
          justification?: string | null
          last_query_at?: string | null
          nominator_id?: string | null
          nominee_bio?: string | null
          nominee_name: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          publication_status?: string
          query_count?: number | null
          recognition_class?: string | null
          region_slug?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          rubric_version?: string | null
          season_id: string
          sla_deadline?: string | null
          source?: Database["public"]["Enums"]["nomination_source"] | null
          source_channel?: string
          source_form_id?: string | null
          source_row_id?: string | null
          source_sheet_id?: string | null
          state_slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          submission_kind?: string
          updated_at?: string | null
          verification_tier?: string | null
          workflow_status?: string | null
          zone_slug?: string | null
        }
        Update: {
          award_category_slug?: string | null
          award_family?: string | null
          award_subcategory_slug?: string | null
          created_at?: string | null
          created_nominee_id?: string | null
          dedupe_match_id?: string | null
          dedupe_score?: number | null
          evidence_urls?: string[] | null
          id?: string
          identity_hash?: string | null
          justification?: string | null
          last_query_at?: string | null
          nominator_id?: string | null
          nominee_bio?: string | null
          nominee_name?: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          publication_status?: string
          query_count?: number | null
          recognition_class?: string | null
          region_slug?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          rubric_version?: string | null
          season_id?: string
          sla_deadline?: string | null
          source?: Database["public"]["Enums"]["nomination_source"] | null
          source_channel?: string
          source_form_id?: string | null
          source_row_id?: string | null
          source_sheet_id?: string | null
          state_slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string
          submission_kind?: string
          updated_at?: string | null
          verification_tier?: string | null
          workflow_status?: string | null
          zone_slug?: string | null
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
            foreignKeyName: "nominations_nominator_id_fkey"
            columns: ["nominator_id"]
            isOneToOne: false
            referencedRelation: "nominators"
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
      nominators: {
        Row: {
          consent_at: string | null
          consent_given: boolean
          country_origin: string | null
          country_residence: string | null
          created_at: string
          email_lower: string | null
          full_name: string
          id: string
          metadata: Json
          phone_hash: string | null
          phone_raw: string | null
          source: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          consent_at?: string | null
          consent_given?: boolean
          country_origin?: string | null
          country_residence?: string | null
          created_at?: string
          email_lower?: string | null
          full_name: string
          id?: string
          metadata?: Json
          phone_hash?: string | null
          phone_raw?: string | null
          source?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          consent_at?: string | null
          consent_given?: boolean
          country_origin?: string | null
          country_residence?: string | null
          created_at?: string
          email_lower?: string | null
          full_name?: string
          id?: string
          metadata?: Json
          phone_hash?: string | null
          phone_raw?: string | null
          source?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
      nominee_import_staging: {
        Row: {
          achievement: string | null
          country: string | null
          imported_at: string
          main_category: string
          name: string
          record_id: string
          state_city: string | null
          status_label: string | null
          subcategory_label: string | null
        }
        Insert: {
          achievement?: string | null
          country?: string | null
          imported_at?: string
          main_category: string
          name: string
          record_id: string
          state_city?: string | null
          status_label?: string | null
          subcategory_label?: string | null
        }
        Update: {
          achievement?: string | null
          country?: string | null
          imported_at?: string
          main_category?: string
          name?: string
          record_id?: string
          state_city?: string | null
          status_label?: string | null
          subcategory_label?: string | null
        }
        Relationships: []
      }
      nominee_media: {
        Row: {
          alt_text: string | null
          approved_at: string | null
          approved_by: string | null
          attribution: string | null
          banner_url: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string | null
          kind: string
          license_status: string
          license_type: string | null
          logo_url: string | null
          nominee_name: string
          nominee_slug: string
          notes: string | null
          og_image_url: string | null
          quality_score: number | null
          source_type: string | null
          source_url: string | null
          thumbnail_url: string | null
          updated_at: string
          uploaded_by: string | null
          verified: boolean
        }
        Insert: {
          alt_text?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attribution?: string | null
          banner_url?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          kind: string
          license_status?: string
          license_type?: string | null
          logo_url?: string | null
          nominee_name: string
          nominee_slug: string
          notes?: string | null
          og_image_url?: string | null
          quality_score?: number | null
          source_type?: string | null
          source_url?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by?: string | null
          verified?: boolean
        }
        Update: {
          alt_text?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attribution?: string | null
          banner_url?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          kind?: string
          license_status?: string
          license_type?: string | null
          logo_url?: string | null
          nominee_name?: string
          nominee_slug?: string
          notes?: string | null
          og_image_url?: string | null
          quality_score?: number | null
          source_type?: string | null
          source_url?: string | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by?: string | null
          verified?: boolean
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
          active_nominee_id: string | null
          award_family: string | null
          bio: string | null
          category_fit_summary: string | null
          country: string | null
          country_of_impact: string | null
          created_at: string | null
          edi_band: Database["public"]["Enums"]["nrc_edi_band"] | null
          email: string | null
          evidence_urls: string[] | null
          final_score: number | null
          first_letter_sent: boolean | null
          id: string
          identity_hash: string | null
          impact_area: string | null
          is_platinum: boolean | null
          jury_score: number | null
          legacy_ids: Json | null
          legacy_source: string | null
          linkedin_url: string | null
          logo_url: string | null
          media_gallery: Json
          name: string
          nigeria_classification_group: string | null
          nominator_user_id: string | null
          nrc_classification_level:
            | Database["public"]["Enums"]["nrc_classification_level"]
            | null
          nrc_evidence_status:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          nrc_no: number | null
          nrc_reviewer_id: string | null
          nrc_verified: boolean | null
          nrc_verified_at: string | null
          organization: string | null
          phone: string | null
          photo_url: string | null
          profile_completion_score: number
          profile_status: Database["public"]["Enums"]["nominee_profile_status"]
          public_display_status:
            | Database["public"]["Enums"]["nrc_public_display_status"]
            | null
          public_documents: Json
          public_votes: number | null
          publication_status: Database["public"]["Enums"]["nominee_publication_status"]
          published_at: string | null
          published_by: string | null
          recognition_class: string | null
          region: string | null
          region_slug: string | null
          renomination_count: number
          research_priority:
            | Database["public"]["Enums"]["nrc_research_priority"]
            | null
          review_notes: string | null
          reviewed_at: string | null
          season_id: string
          slug: string
          social_profile_links: Json
          source_nomination_id: string | null
          state_slug: string | null
          status: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          title: string | null
          updated_at: string | null
          verification_tier: string | null
          website: string | null
          work_done: string | null
          zone_slug: string | null
        }
        Insert: {
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          acceptance_token?: string | null
          acceptance_token_expires_at?: string | null
          accepted_at?: string | null
          active_nominee_id?: string | null
          award_family?: string | null
          bio?: string | null
          category_fit_summary?: string | null
          country?: string | null
          country_of_impact?: string | null
          created_at?: string | null
          edi_band?: Database["public"]["Enums"]["nrc_edi_band"] | null
          email?: string | null
          evidence_urls?: string[] | null
          final_score?: number | null
          first_letter_sent?: boolean | null
          id?: string
          identity_hash?: string | null
          impact_area?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          legacy_ids?: Json | null
          legacy_source?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          media_gallery?: Json
          name: string
          nigeria_classification_group?: string | null
          nominator_user_id?: string | null
          nrc_classification_level?:
            | Database["public"]["Enums"]["nrc_classification_level"]
            | null
          nrc_evidence_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          nrc_no?: number | null
          nrc_reviewer_id?: string | null
          nrc_verified?: boolean | null
          nrc_verified_at?: string | null
          organization?: string | null
          phone?: string | null
          photo_url?: string | null
          profile_completion_score?: number
          profile_status?: Database["public"]["Enums"]["nominee_profile_status"]
          public_display_status?:
            | Database["public"]["Enums"]["nrc_public_display_status"]
            | null
          public_documents?: Json
          public_votes?: number | null
          publication_status?: Database["public"]["Enums"]["nominee_publication_status"]
          published_at?: string | null
          published_by?: string | null
          recognition_class?: string | null
          region?: string | null
          region_slug?: string | null
          renomination_count?: number
          research_priority?:
            | Database["public"]["Enums"]["nrc_research_priority"]
            | null
          review_notes?: string | null
          reviewed_at?: string | null
          season_id: string
          slug: string
          social_profile_links?: Json
          source_nomination_id?: string | null
          state_slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string
          title?: string | null
          updated_at?: string | null
          verification_tier?: string | null
          website?: string | null
          work_done?: string | null
          zone_slug?: string | null
        }
        Update: {
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          acceptance_token?: string | null
          acceptance_token_expires_at?: string | null
          accepted_at?: string | null
          active_nominee_id?: string | null
          award_family?: string | null
          bio?: string | null
          category_fit_summary?: string | null
          country?: string | null
          country_of_impact?: string | null
          created_at?: string | null
          edi_band?: Database["public"]["Enums"]["nrc_edi_band"] | null
          email?: string | null
          evidence_urls?: string[] | null
          final_score?: number | null
          first_letter_sent?: boolean | null
          id?: string
          identity_hash?: string | null
          impact_area?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          legacy_ids?: Json | null
          legacy_source?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          media_gallery?: Json
          name?: string
          nigeria_classification_group?: string | null
          nominator_user_id?: string | null
          nrc_classification_level?:
            | Database["public"]["Enums"]["nrc_classification_level"]
            | null
          nrc_evidence_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          nrc_no?: number | null
          nrc_reviewer_id?: string | null
          nrc_verified?: boolean | null
          nrc_verified_at?: string | null
          organization?: string | null
          phone?: string | null
          photo_url?: string | null
          profile_completion_score?: number
          profile_status?: Database["public"]["Enums"]["nominee_profile_status"]
          public_display_status?:
            | Database["public"]["Enums"]["nrc_public_display_status"]
            | null
          public_documents?: Json
          public_votes?: number | null
          publication_status?: Database["public"]["Enums"]["nominee_publication_status"]
          published_at?: string | null
          published_by?: string | null
          recognition_class?: string | null
          region?: string | null
          region_slug?: string | null
          renomination_count?: number
          research_priority?:
            | Database["public"]["Enums"]["nrc_research_priority"]
            | null
          review_notes?: string | null
          reviewed_at?: string | null
          season_id?: string
          slug?: string
          social_profile_links?: Json
          source_nomination_id?: string | null
          state_slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string
          title?: string | null
          updated_at?: string | null
          verification_tier?: string | null
          website?: string | null
          work_done?: string | null
          zone_slug?: string | null
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
            foreignKeyName: "nominees_source_nomination_id_fkey"
            columns: ["source_nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
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
      notification_logs: {
        Row: {
          channel: string
          created_at: string
          error_message: string | null
          id: string
          nomination_id: string | null
          payload: Json
          provider: string | null
          provider_message_id: string | null
          recipient: string
          related_entity_id: string | null
          related_entity_type: string | null
          sent_at: string | null
          status: string
          template: string
          updated_at: string
        }
        Insert: {
          channel: string
          created_at?: string
          error_message?: string | null
          id?: string
          nomination_id?: string | null
          payload?: Json
          provider?: string | null
          provider_message_id?: string | null
          recipient: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_at?: string | null
          status?: string
          template: string
          updated_at?: string
        }
        Update: {
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          nomination_id?: string | null
          payload?: Json
          provider?: string | null
          provider_message_id?: string | null
          recipient?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          sent_at?: string | null
          status?: string
          template?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
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
      nrc_edi_scores: {
        Row: {
          access_to_education: number | null
          au_agenda_2063_alignment: number | null
          average_score: number | null
          community_relevance: number | null
          created_at: string
          date_scored: string | null
          edi_band: Database["public"]["Enums"]["nrc_edi_band"] | null
          education_for_all_alignment: number | null
          equity_in_education: number | null
          evidence_strength: number | null
          id: string
          inclusion_safeguarding: number | null
          innovation: number | null
          nominee_id: string | null
          nrc_row_id: string | null
          reviewer_note: string | null
          scale_of_impact: number | null
          sdg4_alignment: number | null
          sustainability: number | null
          total_score: number | null
          updated_at: string
        }
        Insert: {
          access_to_education?: number | null
          au_agenda_2063_alignment?: number | null
          average_score?: number | null
          community_relevance?: number | null
          created_at?: string
          date_scored?: string | null
          edi_band?: Database["public"]["Enums"]["nrc_edi_band"] | null
          education_for_all_alignment?: number | null
          equity_in_education?: number | null
          evidence_strength?: number | null
          id?: string
          inclusion_safeguarding?: number | null
          innovation?: number | null
          nominee_id?: string | null
          nrc_row_id?: string | null
          reviewer_note?: string | null
          scale_of_impact?: number | null
          sdg4_alignment?: number | null
          sustainability?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          access_to_education?: number | null
          au_agenda_2063_alignment?: number | null
          average_score?: number | null
          community_relevance?: number | null
          created_at?: string
          date_scored?: string | null
          edi_band?: Database["public"]["Enums"]["nrc_edi_band"] | null
          education_for_all_alignment?: number | null
          equity_in_education?: number | null
          evidence_strength?: number | null
          id?: string
          inclusion_safeguarding?: number | null
          innovation?: number | null
          nominee_id?: string | null
          nrc_row_id?: string | null
          reviewer_note?: string | null
          scale_of_impact?: number | null
          sdg4_alignment?: number | null
          sustainability?: number | null
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nrc_edi_scores_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_edi_scores_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_edi_scores_nrc_row_id_fkey"
            columns: ["nrc_row_id"]
            isOneToOne: true
            referencedRelation: "nrc_evidence_rows"
            referencedColumns: ["id"]
          },
        ]
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
      nrc_evidence_rows: {
        Row: {
          access_score: number | null
          active_nominee_id: string | null
          award_category: string | null
          award_subcategory: string | null
          consent_required: string | null
          country_base: string | null
          created_at: string
          education_contribution_summary: string | null
          education_impact_area: string | null
          equity_score: number | null
          evidence_strength_score: number | null
          id: string
          impact_beneficiaries: string | null
          impact_geography: string | null
          imported_at: string | null
          inclusion_safeguarding_score: number | null
          nesa_region: string | null
          nigeria_classification_group: string | null
          nominee_id: string | null
          nominee_name: string
          nominee_type: string | null
          nrc_classification_level:
            | Database["public"]["Enums"]["nrc_classification_level"]
            | null
          nrc_no: number
          original_legacy_subcategory: string | null
          original_official_category: string | null
          original_status: string | null
          public_display_status:
            | Database["public"]["Enums"]["nrc_public_display_status"]
            | null
          public_website_wording: string | null
          research_priority:
            | Database["public"]["Enums"]["nrc_research_priority"]
            | null
          researcher_note: string | null
          search_query_pack: string | null
          source_type: string | null
          sustainability_reach_score: number | null
          total_edi_20: number | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          work_description: string | null
        }
        Insert: {
          access_score?: number | null
          active_nominee_id?: string | null
          award_category?: string | null
          award_subcategory?: string | null
          consent_required?: string | null
          country_base?: string | null
          created_at?: string
          education_contribution_summary?: string | null
          education_impact_area?: string | null
          equity_score?: number | null
          evidence_strength_score?: number | null
          id?: string
          impact_beneficiaries?: string | null
          impact_geography?: string | null
          imported_at?: string | null
          inclusion_safeguarding_score?: number | null
          nesa_region?: string | null
          nigeria_classification_group?: string | null
          nominee_id?: string | null
          nominee_name: string
          nominee_type?: string | null
          nrc_classification_level?:
            | Database["public"]["Enums"]["nrc_classification_level"]
            | null
          nrc_no: number
          original_legacy_subcategory?: string | null
          original_official_category?: string | null
          original_status?: string | null
          public_display_status?:
            | Database["public"]["Enums"]["nrc_public_display_status"]
            | null
          public_website_wording?: string | null
          research_priority?:
            | Database["public"]["Enums"]["nrc_research_priority"]
            | null
          researcher_note?: string | null
          search_query_pack?: string | null
          source_type?: string | null
          sustainability_reach_score?: number | null
          total_edi_20?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          work_description?: string | null
        }
        Update: {
          access_score?: number | null
          active_nominee_id?: string | null
          award_category?: string | null
          award_subcategory?: string | null
          consent_required?: string | null
          country_base?: string | null
          created_at?: string
          education_contribution_summary?: string | null
          education_impact_area?: string | null
          equity_score?: number | null
          evidence_strength_score?: number | null
          id?: string
          impact_beneficiaries?: string | null
          impact_geography?: string | null
          imported_at?: string | null
          inclusion_safeguarding_score?: number | null
          nesa_region?: string | null
          nigeria_classification_group?: string | null
          nominee_id?: string | null
          nominee_name?: string
          nominee_type?: string | null
          nrc_classification_level?:
            | Database["public"]["Enums"]["nrc_classification_level"]
            | null
          nrc_no?: number
          original_legacy_subcategory?: string | null
          original_official_category?: string | null
          original_status?: string | null
          public_display_status?:
            | Database["public"]["Enums"]["nrc_public_display_status"]
            | null
          public_website_wording?: string | null
          research_priority?:
            | Database["public"]["Enums"]["nrc_research_priority"]
            | null
          researcher_note?: string | null
          search_query_pack?: string | null
          source_type?: string | null
          sustainability_reach_score?: number | null
          total_edi_20?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          work_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nrc_evidence_rows_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_evidence_rows_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      nrc_evidence_sources: {
        Row: {
          created_at: string
          date_checked: string | null
          evidence_type: string | null
          id: string
          nominee_id: string | null
          nrc_row_id: string | null
          reference_no: number | null
          reliability_rating: number | null
          researcher: string | null
          researcher_note: string | null
          source_name: string | null
          source_status: string | null
          source_title: string | null
          source_url: string | null
          source_year: number | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
        }
        Insert: {
          created_at?: string
          date_checked?: string | null
          evidence_type?: string | null
          id?: string
          nominee_id?: string | null
          nrc_row_id?: string | null
          reference_no?: number | null
          reliability_rating?: number | null
          researcher?: string | null
          researcher_note?: string | null
          source_name?: string | null
          source_status?: string | null
          source_title?: string | null
          source_url?: string | null
          source_year?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
        }
        Update: {
          created_at?: string
          date_checked?: string | null
          evidence_type?: string | null
          id?: string
          nominee_id?: string | null
          nrc_row_id?: string | null
          reference_no?: number | null
          reliability_rating?: number | null
          researcher?: string | null
          researcher_note?: string | null
          source_name?: string | null
          source_status?: string | null
          source_title?: string | null
          source_url?: string | null
          source_year?: number | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "nrc_evidence_sources_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_evidence_sources_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_evidence_sources_nrc_row_id_fkey"
            columns: ["nrc_row_id"]
            isOneToOne: false
            referencedRelation: "nrc_evidence_rows"
            referencedColumns: ["id"]
          },
        ]
      }
      nrc_icon_classifications: {
        Row: {
          award_category: string
          award_subcategory: string | null
          classification_note: string | null
          country_base: string | null
          country_of_impact: string | null
          created_at: string
          edi_status: Database["public"]["Enums"]["nrc_edi_band"] | null
          evidence_status:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          icon_classification_group: Database["public"]["Enums"]["nrc_icon_group"]
          id: string
          nominee_id: string | null
          nrc_row_id: string | null
          region_of_impact: string | null
          updated_at: string
        }
        Insert: {
          award_category: string
          award_subcategory?: string | null
          classification_note?: string | null
          country_base?: string | null
          country_of_impact?: string | null
          created_at?: string
          edi_status?: Database["public"]["Enums"]["nrc_edi_band"] | null
          evidence_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          icon_classification_group?: Database["public"]["Enums"]["nrc_icon_group"]
          id?: string
          nominee_id?: string | null
          nrc_row_id?: string | null
          region_of_impact?: string | null
          updated_at?: string
        }
        Update: {
          award_category?: string
          award_subcategory?: string | null
          classification_note?: string | null
          country_base?: string | null
          country_of_impact?: string | null
          created_at?: string
          edi_status?: Database["public"]["Enums"]["nrc_edi_band"] | null
          evidence_status?:
            | Database["public"]["Enums"]["nrc_verification_status"]
            | null
          icon_classification_group?: Database["public"]["Enums"]["nrc_icon_group"]
          id?: string
          nominee_id?: string | null
          nrc_row_id?: string | null
          region_of_impact?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nrc_icon_classifications_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_icon_classifications_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_icon_classifications_nrc_row_id_fkey"
            columns: ["nrc_row_id"]
            isOneToOne: false
            referencedRelation: "nrc_evidence_rows"
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
      nrc_nigeria_summary: {
        Row: {
          category_coverage_note: string | null
          created_at: string
          evidence_required_rows: number | null
          geopolitical_zone: string | null
          id: string
          nigeria_classification_group: string
          refreshed_at: string | null
          state: string | null
          total_rows: number | null
          updated_at: string
          verified_rows: number | null
        }
        Insert: {
          category_coverage_note?: string | null
          created_at?: string
          evidence_required_rows?: number | null
          geopolitical_zone?: string | null
          id?: string
          nigeria_classification_group: string
          refreshed_at?: string | null
          state?: string | null
          total_rows?: number | null
          updated_at?: string
          verified_rows?: number | null
        }
        Update: {
          category_coverage_note?: string | null
          created_at?: string
          evidence_required_rows?: number | null
          geopolitical_zone?: string | null
          id?: string
          nigeria_classification_group?: string
          refreshed_at?: string | null
          state?: string | null
          total_rows?: number | null
          updated_at?: string
          verified_rows?: number | null
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
      nrc_regional_summary: {
        Row: {
          africa_wide_rows: number | null
          balance_note: string | null
          created_at: string
          diaspora_international_rows: number | null
          evidence_required_rows: number | null
          id: string
          nigeria_classified_rows: number | null
          refreshed_at: string | null
          region: string
          total_rows: number | null
          updated_at: string
          verified_rows: number | null
        }
        Insert: {
          africa_wide_rows?: number | null
          balance_note?: string | null
          created_at?: string
          diaspora_international_rows?: number | null
          evidence_required_rows?: number | null
          id?: string
          nigeria_classified_rows?: number | null
          refreshed_at?: string | null
          region: string
          total_rows?: number | null
          updated_at?: string
          verified_rows?: number | null
        }
        Update: {
          africa_wide_rows?: number | null
          balance_note?: string | null
          created_at?: string
          diaspora_international_rows?: number | null
          evidence_required_rows?: number | null
          id?: string
          nigeria_classified_rows?: number | null
          refreshed_at?: string | null
          region?: string
          total_rows?: number | null
          updated_at?: string
          verified_rows?: number | null
        }
        Relationships: []
      }
      nrc_research_queue: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          evidence_need: string | null
          id: string
          nominee_id: string | null
          nominee_name: string
          nrc_row_id: string | null
          priority: Database["public"]["Enums"]["nrc_research_priority"] | null
          region: string | null
          researcher_note: string | null
          search_query_pack: string | null
          status: Database["public"]["Enums"]["nrc_research_status"] | null
          subcategory: string | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          evidence_need?: string | null
          id?: string
          nominee_id?: string | null
          nominee_name: string
          nrc_row_id?: string | null
          priority?: Database["public"]["Enums"]["nrc_research_priority"] | null
          region?: string | null
          researcher_note?: string | null
          search_query_pack?: string | null
          status?: Database["public"]["Enums"]["nrc_research_status"] | null
          subcategory?: string | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          evidence_need?: string | null
          id?: string
          nominee_id?: string | null
          nominee_name?: string
          nrc_row_id?: string | null
          priority?: Database["public"]["Enums"]["nrc_research_priority"] | null
          region?: string | null
          researcher_note?: string | null
          search_query_pack?: string | null
          status?: Database["public"]["Enums"]["nrc_research_status"] | null
          subcategory?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nrc_research_queue_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_research_queue_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_research_queue_nrc_row_id_fkey"
            columns: ["nrc_row_id"]
            isOneToOne: false
            referencedRelation: "nrc_evidence_rows"
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
      pathway_cards: {
        Row: {
          accent_label: string
          action_words: string[]
          animated_phrases: string[]
          award_line: string
          category: string
          created_at: string
          cta: string
          description: string
          display_order: number
          engagement_cta_label: string | null
          headline: string
          href: string
          id: string
          image_url: string | null
          is_active: boolean
          poster_alt: string | null
          preview_summary: string | null
          secondary_cta_href: string | null
          secondary_cta_label: string | null
          story: string | null
          updated_at: string
          updated_by: string | null
          video_id: string | null
          video_title: string | null
          visual_gradient: string
        }
        Insert: {
          accent_label?: string
          action_words?: string[]
          animated_phrases?: string[]
          award_line: string
          category: string
          created_at?: string
          cta: string
          description: string
          display_order?: number
          engagement_cta_label?: string | null
          headline: string
          href: string
          id: string
          image_url?: string | null
          is_active?: boolean
          poster_alt?: string | null
          preview_summary?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          story?: string | null
          updated_at?: string
          updated_by?: string | null
          video_id?: string | null
          video_title?: string | null
          visual_gradient?: string
        }
        Update: {
          accent_label?: string
          action_words?: string[]
          animated_phrases?: string[]
          award_line?: string
          category?: string
          created_at?: string
          cta?: string
          description?: string
          display_order?: number
          engagement_cta_label?: string | null
          headline?: string
          href?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          poster_alt?: string | null
          preview_summary?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          story?: string | null
          updated_at?: string
          updated_by?: string | null
          video_id?: string | null
          video_title?: string | null
          visual_gradient?: string
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
          chapter_id: string | null
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          membership_level: string
          phone: string | null
          referred_by_chapter_id: string | null
          referred_by_user_id: string | null
          region_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          chapter_id?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          membership_level?: string
          phone?: string | null
          referred_by_chapter_id?: string | null
          referred_by_user_id?: string | null
          region_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          chapter_id?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          membership_level?: string
          phone?: string | null
          referred_by_chapter_id?: string | null
          referred_by_user_id?: string | null
          region_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
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
          {
            foreignKeyName: "profiles_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      rebuild_nominations: {
        Row: {
          created_at: string | null
          evidence_urls: string[] | null
          id: string
          nominator_email: string
          nominator_name: string
          nominator_phone: string | null
          nominator_user_id: string | null
          reason: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          school_contact: string | null
          school_country: string
          school_description: string | null
          school_id: string | null
          school_name: string
          school_region_id: string | null
          school_type: string
          season_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          nominator_email: string
          nominator_name: string
          nominator_phone?: string | null
          nominator_user_id?: string | null
          reason: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_contact?: string | null
          school_country: string
          school_description?: string | null
          school_id?: string | null
          school_name: string
          school_region_id?: string | null
          school_type: string
          season_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          nominator_email?: string
          nominator_name?: string
          nominator_phone?: string | null
          nominator_user_id?: string | null
          reason?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          school_contact?: string | null
          school_country?: string
          school_description?: string | null
          school_id?: string | null
          school_name?: string
          school_region_id?: string | null
          school_type?: string
          season_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rebuild_nominations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_school_vote_counts"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rebuild_nominations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_nominations_school_region_id_fkey"
            columns: ["school_region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_nominations_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      rebuild_schools: {
        Row: {
          address: string | null
          admin_notes: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string
          created_at: string | null
          description: string | null
          gps_coordinates: string | null
          id: string
          is_active: boolean | null
          name: string
          photo_urls: string[] | null
          region_id: string | null
          school_type: string
          student_count: number | null
          updated_at: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country: string
          created_at?: string | null
          description?: string | null
          gps_coordinates?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          photo_urls?: string[] | null
          region_id?: string | null
          school_type: string
          student_count?: number | null
          updated_at?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          gps_coordinates?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          photo_urls?: string[] | null
          region_id?: string | null
          school_type?: string
          student_count?: number | null
          updated_at?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rebuild_schools_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      rebuild_votes: {
        Row: {
          created_at: string | null
          device_hash: string | null
          id: string
          ip_hash: string | null
          school_id: string
          season_id: string
          voter_id: string
        }
        Insert: {
          created_at?: string | null
          device_hash?: string | null
          id?: string
          ip_hash?: string | null
          school_id: string
          season_id: string
          voter_id: string
        }
        Update: {
          created_at?: string | null
          device_hash?: string | null
          id?: string
          ip_hash?: string | null
          school_id?: string
          season_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rebuild_votes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_school_vote_counts"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rebuild_votes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_votes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      rebuild_winners: {
        Row: {
          created_at: string | null
          id: string
          intervention_budget_usd: number | null
          intervention_end_date: string | null
          intervention_notes: string | null
          intervention_photos: string[] | null
          intervention_start_date: string | null
          intervention_status: string
          published_at: string | null
          published_by: string | null
          region_id: string
          school_id: string
          season_id: string
          updated_at: string | null
          vote_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          intervention_budget_usd?: number | null
          intervention_end_date?: string | null
          intervention_notes?: string | null
          intervention_photos?: string[] | null
          intervention_start_date?: string | null
          intervention_status?: string
          published_at?: string | null
          published_by?: string | null
          region_id: string
          school_id: string
          season_id: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          intervention_budget_usd?: number | null
          intervention_end_date?: string | null
          intervention_notes?: string | null
          intervention_photos?: string[] | null
          intervention_start_date?: string | null
          intervention_status?: string
          published_at?: string | null
          published_by?: string | null
          region_id?: string
          school_id?: string
          season_id?: string
          updated_at?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rebuild_winners_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_winners_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_school_vote_counts"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rebuild_winners_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_winners_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
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
      regions: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
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
      scef_board_members: {
        Row: {
          appointed_date: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          photo_url: string | null
          region_id: string | null
          role_title: string
          updated_at: string
        }
        Insert: {
          appointed_date?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          photo_url?: string | null
          region_id?: string | null
          role_title?: string
          updated_at?: string
        }
        Update: {
          appointed_date?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          photo_url?: string | null
          region_id?: string | null
          role_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scef_board_members_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
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
      sync_batches: {
        Row: {
          created_at: string
          error_message: string | null
          finished_at: string | null
          id: string
          metadata: Json
          rows_failed: number
          rows_inserted: number
          rows_seen: number
          rows_skipped: number
          rows_updated: number
          source_form_id: string | null
          source_kind: string
          source_label: string
          source_sheet_id: string | null
          started_at: string
          status: string
          trigger_kind: string
          triggered_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json
          rows_failed?: number
          rows_inserted?: number
          rows_seen?: number
          rows_skipped?: number
          rows_updated?: number
          source_form_id?: string | null
          source_kind: string
          source_label: string
          source_sheet_id?: string | null
          started_at?: string
          status?: string
          trigger_kind?: string
          triggered_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json
          rows_failed?: number
          rows_inserted?: number
          rows_seen?: number
          rows_skipped?: number
          rows_updated?: number
          source_form_id?: string | null
          source_kind?: string
          source_label?: string
          source_sheet_id?: string | null
          started_at?: string
          status?: string
          trigger_kind?: string
          triggered_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          action: string
          batch_id: string
          created_at: string
          dedupe_score: number | null
          id: string
          nomination_id: string | null
          normalized_payload: Json | null
          raw_payload: Json | null
          reason: string | null
          source_row_id: string | null
        }
        Insert: {
          action: string
          batch_id: string
          created_at?: string
          dedupe_score?: number | null
          id?: string
          nomination_id?: string | null
          normalized_payload?: Json | null
          raw_payload?: Json | null
          reason?: string | null
          source_row_id?: string | null
        }
        Update: {
          action?: string
          batch_id?: string
          created_at?: string
          dedupe_score?: number | null
          id?: string
          nomination_id?: string | null
          normalized_payload?: Json | null
          raw_payload?: Json | null
          reason?: string | null
          source_row_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "sync_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_logs_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
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
      unmapped_nominee_queue: {
        Row: {
          admin_notes: string | null
          country: string | null
          created_at: string | null
          id: string
          legacy_category: string | null
          legacy_nominee_id: string | null
          legacy_subcategory: string | null
          nominee_name: string
          organization: string | null
          raw_data: Json
          resolution_status: string
          resolved_at: string | null
          resolved_by: string | null
          resolved_subcategory_id: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          legacy_category?: string | null
          legacy_nominee_id?: string | null
          legacy_subcategory?: string | null
          nominee_name: string
          organization?: string | null
          raw_data: Json
          resolution_status?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_subcategory_id?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          legacy_category?: string | null
          legacy_nominee_id?: string | null
          legacy_subcategory?: string | null
          nominee_name?: string
          organization?: string | null
          raw_data?: Json
          resolution_status?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_subcategory_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unmapped_nominee_queue_resolved_subcategory_id_fkey"
            columns: ["resolved_subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_chapters: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          is_primary: boolean
          joined_at: string
          membership_level: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          joined_at?: string
          membership_level?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          joined_at?: string
          membership_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chapters_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
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
      volunteer_activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json
          volunteer_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json
          volunteer_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_activity_logs_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteer_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_activity_logs_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_badges: {
        Row: {
          code: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          label: string
          tier: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          label: string
          tier?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          label?: string
          tier?: string
        }
        Relationships: []
      }
      volunteer_referrals: {
        Row: {
          channel: string | null
          converted_at: string | null
          created_at: string
          id: string
          referred_email: string | null
          referred_name: string | null
          referred_user_id: string | null
          status: Database["public"]["Enums"]["volunteer_referral_status"]
          volunteer_id: string
        }
        Insert: {
          channel?: string | null
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_email?: string | null
          referred_name?: string | null
          referred_user_id?: string | null
          status?: Database["public"]["Enums"]["volunteer_referral_status"]
          volunteer_id: string
        }
        Update: {
          channel?: string | null
          converted_at?: string | null
          created_at?: string
          id?: string
          referred_email?: string | null
          referred_name?: string | null
          referred_user_id?: string | null
          status?: Database["public"]["Enums"]["volunteer_referral_status"]
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_referrals_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteer_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_referrals_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_tasks: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assigned_by: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          points: number
          proof_notes: string | null
          proof_url: string | null
          status: Database["public"]["Enums"]["volunteer_task_status"]
          submitted_at: string | null
          title: string
          updated_at: string
          volunteer_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          points?: number
          proof_notes?: string | null
          proof_url?: string | null
          status?: Database["public"]["Enums"]["volunteer_task_status"]
          submitted_at?: string | null
          title: string
          updated_at?: string
          volunteer_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assigned_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          points?: number
          proof_notes?: string | null
          proof_url?: string | null
          status?: Database["public"]["Enums"]["volunteer_task_status"]
          submitted_at?: string | null
          title?: string
          updated_at?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_tasks_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteer_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_tasks_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_teams: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          lead_user_id: string | null
          member_count: number
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          lead_user_id?: string | null
          member_count?: number
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          lead_user_id?: string | null
          member_count?: number
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          badges: string[]
          bio: string | null
          chapter_id: string | null
          city: string | null
          contribution_score: number
          country: string | null
          created_at: string
          events_count: number
          full_name: string
          headline: string | null
          id: string
          is_featured: boolean
          joined_at: string
          photo_url: string | null
          profile_views: number
          referral_code: string
          referral_count: number
          region: string | null
          role: string | null
          shares_count: number
          slug: string
          social_links: Json
          tasks_completed: number
          team_slug: string | null
          updated_at: string
          user_id: string | null
          verification_status: Database["public"]["Enums"]["volunteer_verification"]
          visibility_status: Database["public"]["Enums"]["volunteer_visibility"]
        }
        Insert: {
          badges?: string[]
          bio?: string | null
          chapter_id?: string | null
          city?: string | null
          contribution_score?: number
          country?: string | null
          created_at?: string
          events_count?: number
          full_name: string
          headline?: string | null
          id?: string
          is_featured?: boolean
          joined_at?: string
          photo_url?: string | null
          profile_views?: number
          referral_code: string
          referral_count?: number
          region?: string | null
          role?: string | null
          shares_count?: number
          slug: string
          social_links?: Json
          tasks_completed?: number
          team_slug?: string | null
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["volunteer_verification"]
          visibility_status?: Database["public"]["Enums"]["volunteer_visibility"]
        }
        Update: {
          badges?: string[]
          bio?: string | null
          chapter_id?: string | null
          city?: string | null
          contribution_score?: number
          country?: string | null
          created_at?: string
          events_count?: number
          full_name?: string
          headline?: string | null
          id?: string
          is_featured?: boolean
          joined_at?: string
          photo_url?: string | null
          profile_views?: number
          referral_code?: string
          referral_count?: number
          region?: string | null
          role?: string | null
          shares_count?: number
          slug?: string
          social_links?: Json
          tasks_completed?: number
          team_slug?: string | null
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["volunteer_verification"]
          visibility_status?: Database["public"]["Enums"]["volunteer_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_team_slug_fkey"
            columns: ["team_slug"]
            isOneToOne: false
            referencedRelation: "volunteer_teams"
            referencedColumns: ["slug"]
          },
        ]
      }
      volunteers_legacy: {
        Row: {
          chapter_id: string | null
          created_at: string
          id: string
          joined_date: string | null
          region_id: string | null
          responsibilities: string | null
          status: string
          updated_at: string
          user_id: string
          volunteer_type: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          joined_date?: string | null
          region_id?: string | null
          responsibilities?: string | null
          status?: string
          updated_at?: string
          user_id: string
          volunteer_type?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          joined_date?: string | null
          region_id?: string | null
          responsibilities?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          volunteer_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteers_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
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
      correspondence_branding_public: {
        Row: {
          chapter_id: string | null
          footer_text: string | null
          id: string | null
          is_active: boolean | null
          logo_url: string | null
          region_id: string | null
          sender_name: string | null
        }
        Insert: {
          chapter_id?: string | null
          footer_text?: string | null
          id?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          region_id?: string | null
          sender_name?: string | null
        }
        Update: {
          chapter_id?: string | null
          footer_text?: string | null
          id?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          region_id?: string | null
          sender_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "correspondence_branding_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correspondence_branding_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      judges_public: {
        Row: {
          bio: string | null
          contribution_score: number | null
          country_origin: string | null
          country_residence: string | null
          created_at: string | null
          expertise_areas: string[] | null
          featured: boolean | null
          full_name: string | null
          id: string | null
          judge_status: Database["public"]["Enums"]["judge_status"] | null
          languages: string[] | null
          organization: string | null
          photo_url: string | null
          professional_title: string | null
          public_contribution_statement: string | null
          region: string | null
          slug: string | null
          social_links: Json | null
          verification_status:
            | Database["public"]["Enums"]["judge_verification_status"]
            | null
        }
        Insert: {
          bio?: string | null
          contribution_score?: number | null
          country_origin?: string | null
          country_residence?: string | null
          created_at?: string | null
          expertise_areas?: string[] | null
          featured?: boolean | null
          full_name?: string | null
          id?: string | null
          judge_status?: Database["public"]["Enums"]["judge_status"] | null
          languages?: string[] | null
          organization?: string | null
          photo_url?: string | null
          professional_title?: string | null
          public_contribution_statement?: string | null
          region?: string | null
          slug?: string | null
          social_links?: Json | null
          verification_status?:
            | Database["public"]["Enums"]["judge_verification_status"]
            | null
        }
        Update: {
          bio?: string | null
          contribution_score?: number | null
          country_origin?: string | null
          country_residence?: string | null
          created_at?: string | null
          expertise_areas?: string[] | null
          featured?: boolean | null
          full_name?: string | null
          id?: string | null
          judge_status?: Database["public"]["Enums"]["judge_status"] | null
          languages?: string[] | null
          organization?: string | null
          photo_url?: string | null
          professional_title?: string | null
          public_contribution_statement?: string | null
          region?: string | null
          slug?: string | null
          social_links?: Json | null
          verification_status?:
            | Database["public"]["Enums"]["judge_verification_status"]
            | null
        }
        Relationships: []
      }
      public_nominees: {
        Row: {
          acceptance_status:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          award_family: string | null
          bio: string | null
          category_fit_summary: string | null
          country: string | null
          created_at: string | null
          final_score: number | null
          id: string | null
          impact_area: string | null
          is_platinum: boolean | null
          jury_score: number | null
          logo_url: string | null
          media_gallery: Json | null
          name: string | null
          nrc_verified: boolean | null
          organization: string | null
          photo_url: string | null
          profile_completion_score: number | null
          profile_status:
            | Database["public"]["Enums"]["nominee_profile_status"]
            | null
          public_documents: Json | null
          public_votes: number | null
          publication_status:
            | Database["public"]["Enums"]["nominee_publication_status"]
            | null
          published_at: string | null
          recognition_class: string | null
          region: string | null
          region_slug: string | null
          renomination_count: number | null
          season_id: string | null
          slug: string | null
          social_profile_links: Json | null
          state_slug: string | null
          status: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id: string | null
          title: string | null
          updated_at: string | null
          zone_slug: string | null
        }
        Insert: {
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          award_family?: string | null
          bio?: string | null
          category_fit_summary?: string | null
          country?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string | null
          impact_area?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          logo_url?: string | null
          media_gallery?: Json | null
          name?: string | null
          nrc_verified?: boolean | null
          organization?: string | null
          photo_url?: string | null
          profile_completion_score?: number | null
          profile_status?:
            | Database["public"]["Enums"]["nominee_profile_status"]
            | null
          public_documents?: Json | null
          public_votes?: number | null
          publication_status?:
            | Database["public"]["Enums"]["nominee_publication_status"]
            | null
          published_at?: string | null
          recognition_class?: string | null
          region?: string | null
          region_slug?: string | null
          renomination_count?: number | null
          season_id?: string | null
          slug?: string | null
          social_profile_links?: Json | null
          state_slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string | null
          title?: string | null
          updated_at?: string | null
          zone_slug?: string | null
        }
        Update: {
          acceptance_status?:
            | Database["public"]["Enums"]["acceptance_status"]
            | null
          award_family?: string | null
          bio?: string | null
          category_fit_summary?: string | null
          country?: string | null
          created_at?: string | null
          final_score?: number | null
          id?: string | null
          impact_area?: string | null
          is_platinum?: boolean | null
          jury_score?: number | null
          logo_url?: string | null
          media_gallery?: Json | null
          name?: string | null
          nrc_verified?: boolean | null
          organization?: string | null
          photo_url?: string | null
          profile_completion_score?: number | null
          profile_status?:
            | Database["public"]["Enums"]["nominee_profile_status"]
            | null
          public_documents?: Json | null
          public_votes?: number | null
          publication_status?:
            | Database["public"]["Enums"]["nominee_publication_status"]
            | null
          published_at?: string | null
          recognition_class?: string | null
          region?: string | null
          region_slug?: string | null
          renomination_count?: number | null
          season_id?: string | null
          slug?: string | null
          social_profile_links?: Json | null
          state_slug?: string | null
          status?: Database["public"]["Enums"]["nomination_status"] | null
          subcategory_id?: string | null
          title?: string | null
          updated_at?: string | null
          zone_slug?: string | null
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
      public_rebuild_nominations: {
        Row: {
          created_at: string | null
          evidence_urls: string[] | null
          id: string | null
          reason: string | null
          school_country: string | null
          school_description: string | null
          school_id: string | null
          school_name: string | null
          school_region_id: string | null
          school_type: string | null
          season_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string | null
          reason?: string | null
          school_country?: string | null
          school_description?: string | null
          school_id?: string | null
          school_name?: string | null
          school_region_id?: string | null
          school_type?: string | null
          season_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string | null
          reason?: string | null
          school_country?: string | null
          school_description?: string | null
          school_id?: string | null
          school_name?: string | null
          school_region_id?: string | null
          school_type?: string | null
          season_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rebuild_nominations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_school_vote_counts"
            referencedColumns: ["school_id"]
          },
          {
            foreignKeyName: "rebuild_nominations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "rebuild_schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_nominations_school_region_id_fkey"
            columns: ["school_region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_nominations_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      rebuild_school_vote_counts: {
        Row: {
          country: string | null
          region_id: string | null
          school_id: string | null
          school_name: string | null
          school_type: string | null
          season_id: string | null
          vote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rebuild_schools_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rebuild_votes_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      scef_board_members_public: {
        Row: {
          appointed_date: string | null
          bio: string | null
          full_name: string | null
          id: string | null
          is_active: boolean | null
          photo_url: string | null
          region_id: string | null
          role_title: string | null
        }
        Insert: {
          appointed_date?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          photo_url?: string | null
          region_id?: string | null
          role_title?: string | null
        }
        Update: {
          appointed_date?: string | null
          bio?: string | null
          full_name?: string | null
          id?: string | null
          is_active?: boolean | null
          photo_url?: string | null
          region_id?: string | null
          role_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scef_board_members_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_leaderboard: {
        Row: {
          badges: string[] | null
          contribution_score: number | null
          country: string | null
          full_name: string | null
          id: string | null
          joined_at: string | null
          photo_url: string | null
          referral_count: number | null
          slug: string | null
          tasks_completed: number | null
          team_slug: string | null
        }
        Insert: {
          badges?: string[] | null
          contribution_score?: number | null
          country?: string | null
          full_name?: string | null
          id?: string | null
          joined_at?: string | null
          photo_url?: string | null
          referral_count?: number | null
          slug?: string | null
          tasks_completed?: number | null
          team_slug?: string | null
        }
        Update: {
          badges?: string[] | null
          contribution_score?: number | null
          country?: string | null
          full_name?: string | null
          id?: string | null
          joined_at?: string | null
          photo_url?: string | null
          referral_count?: number | null
          slug?: string | null
          tasks_completed?: number | null
          team_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_team_slug_fkey"
            columns: ["team_slug"]
            isOneToOne: false
            referencedRelation: "volunteer_teams"
            referencedColumns: ["slug"]
          },
        ]
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
      export_nomination_batch: {
        Args: { p_batch_id: string }
        Returns: {
          audit_trail: Json
          award_category: string
          award_group: string
          award_subcategory: string
          duplicate_of: string
          duplicate_status: string
          evidence_status: string
          form_type: string
          identity_hash: string
          impact_summary_clean: string
          ingested_at: string
          ingested_by: string
          intake_id: string
          nomination_status: string
          nominee_city_clean: string
          nominee_country_clean: string
          nominee_name_clean: string
          nominee_region_clean: string
          nominee_type_clean: string
          record_id: string
          updated_at: string
          verification_status: string
        }[]
      }
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
      generate_volunteer_referral_code: { Args: never; Returns: string }
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
      ingest_nomination_intake_batch: {
        Args: { p_actor_id?: string; p_batch_id?: string; p_rows: Json }
        Returns: {
          batch_id: string
          duplicate_of: string
          duplicate_status: string
          id: string
          record_id: string
        }[]
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
      slugify: { Args: { p: string }; Returns: string }
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
      certificate_tier:
        | "gold"
        | "platinum"
        | "blue_garnet"
        | "icon"
        | "gold_special"
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
      judge_assignment_status:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "returned_for_revision"
        | "finalized"
      judge_profile_visibility: "public" | "unlisted" | "private"
      judge_review_status:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "returned_for_revision"
        | "finalized"
      judge_status:
        | "applied"
        | "under_review"
        | "approved"
        | "rejected"
        | "active"
        | "inactive"
        | "suspended"
        | "alumni"
      judge_verification_status: "unverified" | "verified" | "featured"
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
      nominee_profile_status: "incomplete" | "partial" | "complete"
      nominee_publication_status:
        | "draft"
        | "pending"
        | "published"
        | "unpublished"
        | "archived"
      notification_status: "PENDING" | "SENT" | "FAILED" | "READ"
      nrc_classification_level:
        | "africa_wide"
        | "nigeria_specific"
        | "diaspora_international_linked"
        | "needs_verification"
      nrc_edi_band:
        | "insufficient_evidence"
        | "emerging_evidence"
        | "verified_contribution"
        | "strong_evidence"
        | "platinum_level_candidate"
        | "pending"
      nrc_icon_group:
        | "africans_in_africa"
        | "africans_in_diaspora"
        | "friends_of_africa"
        | "needs_verification"
      nrc_public_display_status:
        | "hidden"
        | "under_nrc_review"
        | "public_display_ready"
      nrc_research_priority: "low" | "medium" | "high" | "urgent"
      nrc_research_status:
        | "pending"
        | "in_review"
        | "evidence_found"
        | "needs_more_sources"
        | "ready_for_review"
        | "public_display_ready"
      nrc_review_decision:
        | "APPROVE"
        | "REJECT"
        | "REQUEST_MORE_EVIDENCE"
        | "RECLASSIFY"
        | "ESCALATE"
      nrc_reviewer_role: "nrc_reviewer" | "nrc_lead" | "nrc_auditor"
      nrc_verification_status:
        | "evidence_required"
        | "under_review"
        | "verified_contribution"
        | "needs_category_verification"
        | "needs_geography_verification"
        | "insufficient_evidence"
        | "public_display_ready"
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
        | "rebuild_nominations"
        | "rebuild_voting"
      transaction_status: "pending" | "confirmed" | "failed" | "refunded"
      transaction_type: "donation" | "sponsorship" | "ticket"
      transfer_status:
        | "CREATED"
        | "PENDING"
        | "PROCESSING"
        | "SENT"
        | "CONFIRMED"
        | "FAILED"
      volunteer_referral_status: "invited" | "signed_up" | "converted"
      volunteer_task_status:
        | "assigned"
        | "in_progress"
        | "submitted"
        | "approved"
        | "rejected"
      volunteer_verification: "pending" | "approved" | "rejected"
      volunteer_visibility: "public" | "hidden" | "alumni"
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
      certificate_tier: [
        "gold",
        "platinum",
        "blue_garnet",
        "icon",
        "gold_special",
      ],
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
      judge_assignment_status: [
        "not_started",
        "in_progress",
        "submitted",
        "returned_for_revision",
        "finalized",
      ],
      judge_profile_visibility: ["public", "unlisted", "private"],
      judge_review_status: [
        "not_started",
        "in_progress",
        "submitted",
        "returned_for_revision",
        "finalized",
      ],
      judge_status: [
        "applied",
        "under_review",
        "approved",
        "rejected",
        "active",
        "inactive",
        "suspended",
        "alumni",
      ],
      judge_verification_status: ["unverified", "verified", "featured"],
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
      nominee_profile_status: ["incomplete", "partial", "complete"],
      nominee_publication_status: [
        "draft",
        "pending",
        "published",
        "unpublished",
        "archived",
      ],
      notification_status: ["PENDING", "SENT", "FAILED", "READ"],
      nrc_classification_level: [
        "africa_wide",
        "nigeria_specific",
        "diaspora_international_linked",
        "needs_verification",
      ],
      nrc_edi_band: [
        "insufficient_evidence",
        "emerging_evidence",
        "verified_contribution",
        "strong_evidence",
        "platinum_level_candidate",
        "pending",
      ],
      nrc_icon_group: [
        "africans_in_africa",
        "africans_in_diaspora",
        "friends_of_africa",
        "needs_verification",
      ],
      nrc_public_display_status: [
        "hidden",
        "under_nrc_review",
        "public_display_ready",
      ],
      nrc_research_priority: ["low", "medium", "high", "urgent"],
      nrc_research_status: [
        "pending",
        "in_review",
        "evidence_found",
        "needs_more_sources",
        "ready_for_review",
        "public_display_ready",
      ],
      nrc_review_decision: [
        "APPROVE",
        "REJECT",
        "REQUEST_MORE_EVIDENCE",
        "RECLASSIFY",
        "ESCALATE",
      ],
      nrc_reviewer_role: ["nrc_reviewer", "nrc_lead", "nrc_auditor"],
      nrc_verification_status: [
        "evidence_required",
        "under_review",
        "verified_contribution",
        "needs_category_verification",
        "needs_geography_verification",
        "insufficient_evidence",
        "public_display_ready",
      ],
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
        "rebuild_nominations",
        "rebuild_voting",
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
      volunteer_referral_status: ["invited", "signed_up", "converted"],
      volunteer_task_status: [
        "assigned",
        "in_progress",
        "submitted",
        "approved",
        "rejected",
      ],
      volunteer_verification: ["pending", "approved", "rejected"],
      volunteer_visibility: ["public", "hidden", "alumni"],
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
