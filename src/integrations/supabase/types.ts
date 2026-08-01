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
          applies_to_all_regions: boolean
          created_at: string
          geographic_scope: string | null
          group_key: string
          is_published: boolean
          payload: Json
          region_version: string
          regional_model: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          applies_to_all_regions?: boolean
          created_at?: string
          geographic_scope?: string | null
          group_key: string
          is_published?: boolean
          payload: Json
          region_version?: string
          regional_model?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          applies_to_all_regions?: boolean
          created_at?: string
          geographic_scope?: string | null
          group_key?: string
          is_published?: boolean
          payload?: Json
          region_version?: string
          regional_model?: string | null
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
      countries: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_african: boolean
          iso2: string
          iso3: string | null
          name: string
          region_code: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_african?: boolean
          iso2: string
          iso3?: string | null
          name: string
          region_code?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_african?: boolean
          iso2?: string
          iso3?: string | null
          name?: string
          region_code?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "countries_region_code_fkey"
            columns: ["region_code"]
            isOneToOne: false
            referencedRelation: "regions_v2"
            referencedColumns: ["code"]
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
      final_arena_ballots: {
        Row: {
          ballot_hash: string | null
          created_at: string
          id: string
          judge_user_id: string
          laureate_nominee_id: string
          locked_at: string | null
          pathway_id: string
          points: number
          rationale: string | null
          season_id: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          ballot_hash?: string | null
          created_at?: string
          id?: string
          judge_user_id: string
          laureate_nominee_id: string
          locked_at?: string | null
          pathway_id: string
          points?: number
          rationale?: string | null
          season_id?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          ballot_hash?: string | null
          created_at?: string
          id?: string
          judge_user_id?: string
          laureate_nominee_id?: string
          locked_at?: string | null
          pathway_id?: string
          points?: number
          rationale?: string | null
          season_id?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "final_arena_ballots_laureate_nominee_id_fkey"
            columns: ["laureate_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "final_arena_ballots_laureate_nominee_id_fkey"
            columns: ["laureate_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "final_arena_ballots_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "final_arena_ballots_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
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
      icon_classifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      icon_governance_reviews: {
        Row: {
          decided_at: string
          decided_by: string | null
          decision: string
          group_id: string
          id: string
          notes: string | null
        }
        Insert: {
          decided_at?: string
          decided_by?: string | null
          decision: string
          group_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          decided_at?: string
          decided_by?: string | null
          decision?: string
          group_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icon_governance_reviews_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "icon_grand_jury_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_grand_jury_ballots: {
        Row: {
          first_choice_nominee_id: string
          group_id: string
          id: string
          ip_address: unknown
          judge_id: string
          locked_at: string
          receipt_hash: string
          second_choice_nominee_id: string
          submitted_at: string
          third_choice_nominee_id: string
          user_agent: string | null
        }
        Insert: {
          first_choice_nominee_id: string
          group_id: string
          id?: string
          ip_address?: unknown
          judge_id: string
          locked_at?: string
          receipt_hash: string
          second_choice_nominee_id: string
          submitted_at?: string
          third_choice_nominee_id: string
          user_agent?: string | null
        }
        Update: {
          first_choice_nominee_id?: string
          group_id?: string
          id?: string
          ip_address?: unknown
          judge_id?: string
          locked_at?: string
          receipt_hash?: string
          second_choice_nominee_id?: string
          submitted_at?: string
          third_choice_nominee_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icon_grand_jury_ballots_first_choice_nominee_id_fkey"
            columns: ["first_choice_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_ballots_first_choice_nominee_id_fkey"
            columns: ["first_choice_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_ballots_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "icon_grand_jury_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_ballots_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_ballots_second_choice_nominee_id_fkey"
            columns: ["second_choice_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_ballots_second_choice_nominee_id_fkey"
            columns: ["second_choice_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_ballots_third_choice_nominee_id_fkey"
            columns: ["third_choice_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_ballots_third_choice_nominee_id_fkey"
            columns: ["third_choice_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_grand_jury_finalists: {
        Row: {
          created_at: string
          group_id: string
          id: string
          nominee_id: string
          seed_rank: number
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          nominee_id: string
          seed_rank: number
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          nominee_id?: string
          seed_rank?: number
        }
        Relationships: [
          {
            foreignKeyName: "icon_grand_jury_finalists_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "icon_grand_jury_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_finalists_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_finalists_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_grand_jury_groups: {
        Row: {
          classification_id: string
          created_at: string
          id: string
          panel_id: string
          pathway_id: string
          title: string
          updated_at: string
          voting_status: string
        }
        Insert: {
          classification_id: string
          created_at?: string
          id?: string
          panel_id: string
          pathway_id: string
          title: string
          updated_at?: string
          voting_status?: string
        }
        Update: {
          classification_id?: string
          created_at?: string
          id?: string
          panel_id?: string
          pathway_id?: string
          title?: string
          updated_at?: string
          voting_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_grand_jury_groups_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "icon_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_groups_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: true
            referencedRelation: "icon_judge_panels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_groups_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "icon_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_grand_jury_results: {
        Row: {
          avg_rank: number | null
          ballot_count: number
          computed_at: string
          first_choice_votes: number
          group_id: string
          id: string
          is_laureate: boolean
          nominee_id: string
          points: number
          second_choice_votes: number
          third_choice_votes: number
          tie_flag: boolean
        }
        Insert: {
          avg_rank?: number | null
          ballot_count?: number
          computed_at?: string
          first_choice_votes?: number
          group_id: string
          id?: string
          is_laureate?: boolean
          nominee_id: string
          points?: number
          second_choice_votes?: number
          third_choice_votes?: number
          tie_flag?: boolean
        }
        Update: {
          avg_rank?: number | null
          ballot_count?: number
          computed_at?: string
          first_choice_votes?: number
          group_id?: string
          id?: string
          is_laureate?: boolean
          nominee_id?: string
          points?: number
          second_choice_votes?: number
          third_choice_votes?: number
          tie_flag?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "icon_grand_jury_results_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "icon_grand_jury_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_results_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_grand_jury_results_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          classification_id: string
          deadline: string | null
          id: string
          judge_id: string
          nominee_id: string
          pathway_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          classification_id: string
          deadline?: string | null
          id?: string
          judge_id: string
          nominee_id: string
          pathway_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          classification_id?: string
          deadline?: string | null
          id?: string
          judge_id?: string
          nominee_id?: string
          pathway_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_assignments_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "icon_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_assignments_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_assignments_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "icon_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_conflicts: {
        Row: {
          conflict_type: string
          created_at: string
          description: string | null
          id: string
          judge_id: string
          nominee_id: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
        }
        Insert: {
          conflict_type: string
          created_at?: string
          description?: string | null
          id?: string
          judge_id: string
          nominee_id: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Update: {
          conflict_type?: string
          created_at?: string
          description?: string | null
          id?: string
          judge_id?: string
          nominee_id?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_conflicts_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_invitations: {
        Row: {
          consumed_at: string | null
          consumed_by: string | null
          created_at: string
          email: string
          expires_at: string
          full_name: string | null
          id: string
          invited_by: string | null
          token: string
        }
        Insert: {
          consumed_at?: string | null
          consumed_by?: string | null
          created_at?: string
          email: string
          expires_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          token?: string
        }
        Update: {
          consumed_at?: string | null
          consumed_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string | null
          token?: string
        }
        Relationships: []
      }
      icon_judge_notes: {
        Row: {
          body: string
          created_at: string
          id: string
          judge_id: string
          nominee_id: string
          note_type: string
          review_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          judge_id: string
          nominee_id: string
          note_type?: string
          review_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          judge_id?: string
          nominee_id?: string
          note_type?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_notes_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_notes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "icon_judge_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_onboarding: {
        Row: {
          code_of_conduct: boolean
          completed_at: string | null
          confidentiality_signed: boolean
          conflict_declared: boolean
          id: string
          identity_verified: boolean
          judge_id: string
          profile_completed: boolean
          sample_review: boolean
          scoring_orientation: boolean
          updated_at: string
        }
        Insert: {
          code_of_conduct?: boolean
          completed_at?: string | null
          confidentiality_signed?: boolean
          conflict_declared?: boolean
          id?: string
          identity_verified?: boolean
          judge_id: string
          profile_completed?: boolean
          sample_review?: boolean
          scoring_orientation?: boolean
          updated_at?: string
        }
        Update: {
          code_of_conduct?: boolean
          completed_at?: string | null
          confidentiality_signed?: boolean
          conflict_declared?: boolean
          id?: string
          identity_verified?: boolean
          judge_id?: string
          profile_completed?: boolean
          sample_review?: boolean
          scoring_orientation?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_onboarding_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: true
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_otp_sessions: {
        Row: {
          expires_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string
          verified_at: string
        }
        Insert: {
          expires_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id: string
          verified_at?: string
        }
        Update: {
          expires_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string
          verified_at?: string
        }
        Relationships: []
      }
      icon_judge_panel_members: {
        Row: {
          created_at: string
          id: string
          judge_id: string
          panel_id: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          judge_id: string
          panel_id: string
          role?: string
        }
        Update: {
          created_at?: string
          id?: string
          judge_id?: string
          panel_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_panel_members_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_panel_members_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: false
            referencedRelation: "icon_judge_panels"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_panels: {
        Row: {
          chair_judge_id: string | null
          classification_id: string
          created_at: string
          id: string
          pathway_id: string
          secretary_judge_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          chair_judge_id?: string | null
          classification_id: string
          created_at?: string
          id?: string
          pathway_id: string
          secretary_judge_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          chair_judge_id?: string | null
          classification_id?: string
          created_at?: string
          id?: string
          pathway_id?: string
          secretary_judge_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_panels_chair_judge_id_fkey"
            columns: ["chair_judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_panels_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "icon_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_panels_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "icon_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_panels_secretary_judge_id_fkey"
            columns: ["secretary_judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_profiles: {
        Row: {
          affiliation: string | null
          availability: string | null
          bio: string | null
          code_of_conduct_signed_at: string | null
          confidentiality_signed_at: string | null
          created_at: string
          id: string
          judge_id: string
          linkedin_url: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          affiliation?: string | null
          availability?: string | null
          bio?: string | null
          code_of_conduct_signed_at?: string | null
          confidentiality_signed_at?: string | null
          created_at?: string
          id?: string
          judge_id: string
          linkedin_url?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          affiliation?: string | null
          availability?: string | null
          bio?: string | null
          code_of_conduct_signed_at?: string | null
          confidentiality_signed_at?: string | null
          created_at?: string
          id?: string
          judge_id?: string
          linkedin_url?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_profiles_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: true
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_reviews: {
        Row: {
          assignment_id: string
          created_at: string
          evidence_quality_flag: string | null
          id: string
          judge_id: string
          locked_at: string | null
          nominee_id: string
          recommendation: string | null
          status: string
          submitted_at: string | null
          total_score: number | null
          updated_at: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          evidence_quality_flag?: string | null
          id?: string
          judge_id: string
          locked_at?: string | null
          nominee_id: string
          recommendation?: string | null
          status?: string
          submitted_at?: string | null
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          evidence_quality_flag?: string | null
          id?: string
          judge_id?: string
          locked_at?: string | null
          nominee_id?: string
          recommendation?: string | null
          status?: string
          submitted_at?: string | null
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_reviews_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: true
            referencedRelation: "icon_judge_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_reviews_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judge_scores: {
        Row: {
          created_at: string
          criterion_id: string
          evidence_ref: string | null
          id: string
          justification: string | null
          review_id: string
          score: number
        }
        Insert: {
          created_at?: string
          criterion_id: string
          evidence_ref?: string | null
          id?: string
          justification?: string | null
          review_id: string
          score: number
        }
        Update: {
          created_at?: string
          criterion_id?: string
          evidence_ref?: string | null
          id?: string
          justification?: string | null
          review_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "icon_judge_scores_criterion_id_fkey"
            columns: ["criterion_id"]
            isOneToOne: false
            referencedRelation: "icon_scoring_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_judge_scores_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "icon_judge_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_judges: {
        Row: {
          active: boolean
          country: string | null
          created_at: string
          email: string
          expertise: string[] | null
          full_name: string
          id: string
          region: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          country?: string | null
          created_at?: string
          email: string
          expertise?: string[] | null
          full_name: string
          id?: string
          region?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          country?: string | null
          created_at?: string
          email?: string
          expertise?: string[] | null
          full_name?: string
          id?: string
          region?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      icon_jury_audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          user_agent?: string | null
        }
        Relationships: []
      }
      icon_jury_deliberation_messages: {
        Row: {
          author_user_id: string
          body: string
          created_at: string
          deliberation_id: string
          id: string
        }
        Insert: {
          author_user_id: string
          body: string
          created_at?: string
          deliberation_id: string
          id?: string
        }
        Update: {
          author_user_id?: string
          body?: string
          created_at?: string
          deliberation_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_jury_deliberation_messages_deliberation_id_fkey"
            columns: ["deliberation_id"]
            isOneToOne: false
            referencedRelation: "icon_jury_deliberations"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_jury_deliberations: {
        Row: {
          classification_id: string | null
          created_at: string
          created_by: string | null
          decision_summary: string | null
          id: string
          nominee_id: string | null
          pathway_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          classification_id?: string | null
          created_at?: string
          created_by?: string | null
          decision_summary?: string | null
          id?: string
          nominee_id?: string | null
          pathway_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          classification_id?: string | null
          created_at?: string
          created_by?: string | null
          decision_summary?: string | null
          id?: string
          nominee_id?: string | null
          pathway_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_jury_deliberations_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "icon_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_jury_deliberations_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "icon_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_jury_moderation_actions: {
        Row: {
          action: string
          actor_user_id: string
          created_at: string
          id: string
          metadata: Json
          reason: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action: string
          actor_user_id: string
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action?: string
          actor_user_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          reason?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      icon_jury_notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          judge_id: string | null
          kind: string
          read_at: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          judge_id?: string | null
          kind: string
          read_at?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          judge_id?: string | null
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icon_jury_notifications_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "icon_judges"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_jury_result_positions: {
        Row: {
          average_score: number | null
          classification_id: string
          created_at: string
          governance_approved_at: string | null
          governance_approved_by: string | null
          highest_score: number | null
          id: string
          lowest_score: number | null
          median_score: number | null
          nominee_id: string | null
          pathway_id: string
          recommendation_summary: Json | null
          score_variance: number | null
          snapshot_id: string
          status: string
          updated_at: string
          valid_review_count: number
        }
        Insert: {
          average_score?: number | null
          classification_id: string
          created_at?: string
          governance_approved_at?: string | null
          governance_approved_by?: string | null
          highest_score?: number | null
          id?: string
          lowest_score?: number | null
          median_score?: number | null
          nominee_id?: string | null
          pathway_id: string
          recommendation_summary?: Json | null
          score_variance?: number | null
          snapshot_id: string
          status?: string
          updated_at?: string
          valid_review_count?: number
        }
        Update: {
          average_score?: number | null
          classification_id?: string
          created_at?: string
          governance_approved_at?: string | null
          governance_approved_by?: string | null
          highest_score?: number | null
          id?: string
          lowest_score?: number | null
          median_score?: number | null
          nominee_id?: string | null
          pathway_id?: string
          recommendation_summary?: Json | null
          score_variance?: number | null
          snapshot_id?: string
          status?: string
          updated_at?: string
          valid_review_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "icon_jury_result_positions_classification_id_fkey"
            columns: ["classification_id"]
            isOneToOne: false
            referencedRelation: "icon_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_jury_result_positions_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "icon_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_jury_result_positions_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "icon_jury_result_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_jury_result_snapshots: {
        Row: {
          computed_at: string
          computed_by: string | null
          id: string
          label: string
          metadata: Json
        }
        Insert: {
          computed_at?: string
          computed_by?: string | null
          id?: string
          label: string
          metadata?: Json
        }
        Update: {
          computed_at?: string
          computed_by?: string | null
          id?: string
          label?: string
          metadata?: Json
        }
        Relationships: []
      }
      icon_panel_shortlists: {
        Row: {
          chair_signed_at: string | null
          created_at: string
          finalist_1_nominee_id: string | null
          finalist_2_nominee_id: string | null
          finalist_3_nominee_id: string | null
          id: string
          justification: string | null
          panel_id: string
          reserve_nominee_id: string | null
          secretary_signed_at: string | null
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          chair_signed_at?: string | null
          created_at?: string
          finalist_1_nominee_id?: string | null
          finalist_2_nominee_id?: string | null
          finalist_3_nominee_id?: string | null
          id?: string
          justification?: string | null
          panel_id: string
          reserve_nominee_id?: string | null
          secretary_signed_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          chair_signed_at?: string | null
          created_at?: string
          finalist_1_nominee_id?: string | null
          finalist_2_nominee_id?: string | null
          finalist_3_nominee_id?: string | null
          id?: string
          justification?: string | null
          panel_id?: string
          reserve_nominee_id?: string | null
          secretary_signed_at?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icon_panel_shortlists_finalist_1_nominee_id_fkey"
            columns: ["finalist_1_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_finalist_1_nominee_id_fkey"
            columns: ["finalist_1_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_finalist_2_nominee_id_fkey"
            columns: ["finalist_2_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_finalist_2_nominee_id_fkey"
            columns: ["finalist_2_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_finalist_3_nominee_id_fkey"
            columns: ["finalist_3_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_finalist_3_nominee_id_fkey"
            columns: ["finalist_3_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: true
            referencedRelation: "icon_judge_panels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_reserve_nominee_id_fkey"
            columns: ["reserve_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icon_panel_shortlists_reserve_nominee_id_fkey"
            columns: ["reserve_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      icon_pathways: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      icon_scoring_criteria: {
        Row: {
          active: boolean
          description: string | null
          id: string
          max_score: number
          name: string
          slug: string
          sort_order: number
          weight: number
        }
        Insert: {
          active?: boolean
          description?: string | null
          id?: string
          max_score?: number
          name: string
          slug: string
          sort_order?: number
          weight: number
        }
        Update: {
          active?: boolean
          description?: string | null
          id?: string
          max_score?: number
          name?: string
          slug?: string
          sort_order?: number
          weight?: number
        }
        Relationships: []
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
          region_slug: string | null
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
          region_slug?: string | null
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
          region_slug?: string | null
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
        Relationships: [
          {
            foreignKeyName: "influencer_impact_nominees_region_slug_fkey"
            columns: ["region_slug"]
            isOneToOne: false
            referencedRelation: "influencer_nominees_by_region"
            referencedColumns: ["region_slug"]
          },
          {
            foreignKeyName: "influencer_impact_nominees_region_slug_fkey"
            columns: ["region_slug"]
            isOneToOne: false
            referencedRelation: "regions_v2"
            referencedColumns: ["slug"]
          },
        ]
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
      judge_nominee_reviews: {
        Row: {
          created_at: string
          dossier_version_id: string
          id: string
          judge_user_id: string
          locked_at: string | null
          nominee_id: string
          pathway_id: string
          private_notes: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["judge_review_status"]
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dossier_version_id: string
          id?: string
          judge_user_id: string
          locked_at?: string | null
          nominee_id: string
          pathway_id: string
          private_notes?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["judge_review_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dossier_version_id?: string
          id?: string
          judge_user_id?: string
          locked_at?: string | null
          nominee_id?: string
          pathway_id?: string
          private_notes?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["judge_review_status"]
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_nominee_reviews_dossier_version_id_fkey"
            columns: ["dossier_version_id"]
            isOneToOne: false
            referencedRelation: "nominee_dossier_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_nominee_reviews_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_nominee_reviews_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_nominee_reviews_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
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
      judging_pathways: {
        Row: {
          award_category: string
          classification: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          pathway_number: number
          season_id: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          award_category: string
          classification: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          pathway_number: number
          season_id?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          award_category?: string
          classification?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          pathway_number?: number
          season_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "judging_pathways_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
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
      nomination_drafts: {
        Row: {
          award_tier: string | null
          category_slug: string | null
          converted_at: string | null
          converted_to_nomination_id: string | null
          converted_user_id: string | null
          created_at: string
          draft_token: string
          expires_at: string
          form_type: string
          id: string
          nominator_email: string | null
          nominee_data: Json
          session_id: string | null
          status: string
          subcategory_slug: string | null
          updated_at: string
        }
        Insert: {
          award_tier?: string | null
          category_slug?: string | null
          converted_at?: string | null
          converted_to_nomination_id?: string | null
          converted_user_id?: string | null
          created_at?: string
          draft_token: string
          expires_at?: string
          form_type: string
          id?: string
          nominator_email?: string | null
          nominee_data?: Json
          session_id?: string | null
          status?: string
          subcategory_slug?: string | null
          updated_at?: string
        }
        Update: {
          award_tier?: string | null
          category_slug?: string | null
          converted_at?: string | null
          converted_to_nomination_id?: string | null
          converted_user_id?: string | null
          created_at?: string
          draft_token?: string
          expires_at?: string
          form_type?: string
          id?: string
          nominator_email?: string | null
          nominee_data?: Json
          session_id?: string | null
          status?: string
          subcategory_slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nomination_drafts_converted_to_nomination_id_fkey"
            columns: ["converted_to_nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
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
          draft_token: string | null
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
          nominator_email: string | null
          nominee_city_clean: string | null
          nominee_country_clean: string | null
          nominee_name_clean: string | null
          nominee_region_clean: string | null
          nominee_type_clean: string | null
          raw_payload: Json | null
          record_id: string
          reviewer_notes: string | null
          submitted_by: string | null
          updated_at: string
          verification_status: string | null
          website_sync_status: string | null
        }
        Insert: {
          assigned_reviewer?: string | null
          award_category?: string | null
          award_group?: string | null
          award_subcategory?: string | null
          draft_token?: string | null
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
          nominator_email?: string | null
          nominee_city_clean?: string | null
          nominee_country_clean?: string | null
          nominee_name_clean?: string | null
          nominee_region_clean?: string | null
          nominee_type_clean?: string | null
          raw_payload?: Json | null
          record_id: string
          reviewer_notes?: string | null
          submitted_by?: string | null
          updated_at?: string
          verification_status?: string | null
          website_sync_status?: string | null
        }
        Update: {
          assigned_reviewer?: string | null
          award_category?: string | null
          award_group?: string | null
          award_subcategory?: string | null
          draft_token?: string | null
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
          nominator_email?: string | null
          nominee_city_clean?: string | null
          nominee_country_clean?: string | null
          nominee_name_clean?: string | null
          nominee_region_clean?: string | null
          nominee_type_clean?: string | null
          raw_payload?: Json | null
          record_id?: string
          reviewer_notes?: string | null
          submitted_by?: string | null
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
          auto_assigned_region_code: string | null
          award_category_slug: string | null
          award_family: string | null
          award_subcategory_slug: string | null
          country_iso2: string | null
          created_at: string | null
          created_nominee_id: string | null
          dedupe_match_id: string | null
          dedupe_score: number | null
          diaspora_status: boolean
          edi_matrix_key: string | null
          edi_matrix_version: string | null
          edi_ratings: Json | null
          email_verification_status: string | null
          evidence_urls: string[] | null
          id: string
          identity_hash: string | null
          justification: string | null
          last_query_at: string | null
          nomination_reference: string | null
          nominator_id: string | null
          nominee_bio: string | null
          nominee_name: string
          nominee_organization: string | null
          nominee_photo_url: string | null
          nominee_title: string | null
          nrc_reviewer_id: string | null
          publication_status: string
          query_count: number | null
          recognition_category_id: string | null
          recognition_class: string | null
          recognition_classification_id: string | null
          recognition_cycle_id: string | null
          recognition_subcategory_id: string | null
          recognition_tier_id: string | null
          region_override_reason: string | null
          region_slug: string | null
          review_notes: string | null
          reviewed_at: string | null
          rubric_version: string | null
          season_id: string
          sla_deadline: string | null
          source: Database["public"]["Enums"]["nomination_source"] | null
          source_channel: string
          source_draft_id: string | null
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
          auto_assigned_region_code?: string | null
          award_category_slug?: string | null
          award_family?: string | null
          award_subcategory_slug?: string | null
          country_iso2?: string | null
          created_at?: string | null
          created_nominee_id?: string | null
          dedupe_match_id?: string | null
          dedupe_score?: number | null
          diaspora_status?: boolean
          edi_matrix_key?: string | null
          edi_matrix_version?: string | null
          edi_ratings?: Json | null
          email_verification_status?: string | null
          evidence_urls?: string[] | null
          id?: string
          identity_hash?: string | null
          justification?: string | null
          last_query_at?: string | null
          nomination_reference?: string | null
          nominator_id?: string | null
          nominee_bio?: string | null
          nominee_name: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          publication_status?: string
          query_count?: number | null
          recognition_category_id?: string | null
          recognition_class?: string | null
          recognition_classification_id?: string | null
          recognition_cycle_id?: string | null
          recognition_subcategory_id?: string | null
          recognition_tier_id?: string | null
          region_override_reason?: string | null
          region_slug?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          rubric_version?: string | null
          season_id: string
          sla_deadline?: string | null
          source?: Database["public"]["Enums"]["nomination_source"] | null
          source_channel?: string
          source_draft_id?: string | null
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
          auto_assigned_region_code?: string | null
          award_category_slug?: string | null
          award_family?: string | null
          award_subcategory_slug?: string | null
          country_iso2?: string | null
          created_at?: string | null
          created_nominee_id?: string | null
          dedupe_match_id?: string | null
          dedupe_score?: number | null
          diaspora_status?: boolean
          edi_matrix_key?: string | null
          edi_matrix_version?: string | null
          edi_ratings?: Json | null
          email_verification_status?: string | null
          evidence_urls?: string[] | null
          id?: string
          identity_hash?: string | null
          justification?: string | null
          last_query_at?: string | null
          nomination_reference?: string | null
          nominator_id?: string | null
          nominee_bio?: string | null
          nominee_name?: string
          nominee_organization?: string | null
          nominee_photo_url?: string | null
          nominee_title?: string | null
          nrc_reviewer_id?: string | null
          publication_status?: string
          query_count?: number | null
          recognition_category_id?: string | null
          recognition_class?: string | null
          recognition_classification_id?: string | null
          recognition_cycle_id?: string | null
          recognition_subcategory_id?: string | null
          recognition_tier_id?: string | null
          region_override_reason?: string | null
          region_slug?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          rubric_version?: string | null
          season_id?: string
          sla_deadline?: string | null
          source?: Database["public"]["Enums"]["nomination_source"] | null
          source_channel?: string
          source_draft_id?: string | null
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
            foreignKeyName: "nominations_auto_assigned_region_code_fkey"
            columns: ["auto_assigned_region_code"]
            isOneToOne: false
            referencedRelation: "regions_v2"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "nominations_country_iso2_fkey"
            columns: ["country_iso2"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["iso2"]
          },
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
            foreignKeyName: "nominations_recognition_category_id_fkey"
            columns: ["recognition_category_id"]
            isOneToOne: false
            referencedRelation: "recognition_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_recognition_classification_id_fkey"
            columns: ["recognition_classification_id"]
            isOneToOne: false
            referencedRelation: "recognition_classifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_recognition_cycle_id_fkey"
            columns: ["recognition_cycle_id"]
            isOneToOne: false
            referencedRelation: "recognition_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_recognition_subcategory_id_fkey"
            columns: ["recognition_subcategory_id"]
            isOneToOne: false
            referencedRelation: "recognition_subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominations_recognition_tier_id_fkey"
            columns: ["recognition_tier_id"]
            isOneToOne: false
            referencedRelation: "recognition_tiers"
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
            foreignKeyName: "nominations_source_draft_id_fkey"
            columns: ["source_draft_id"]
            isOneToOne: false
            referencedRelation: "nomination_drafts"
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
      nominee_dossier_versions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          biography: string | null
          content_hash: string | null
          created_at: string
          evidence_library: Json
          geographic_reach: string | null
          id: string
          impact_summary: string | null
          known_limitations: string | null
          lifetime_contribution: string | null
          locked_at: string | null
          locked_by: string | null
          main_beneficiaries: string | null
          nomination_id: string | null
          nominee_id: string
          nrc_recommendation: string | null
          prepared_by: string | null
          source_quality_notes: string | null
          status: Database["public"]["Enums"]["dossier_status"]
          supersedes_version_id: string | null
          updated_at: string
          verified_achievements: Json
          version_number: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          biography?: string | null
          content_hash?: string | null
          created_at?: string
          evidence_library?: Json
          geographic_reach?: string | null
          id?: string
          impact_summary?: string | null
          known_limitations?: string | null
          lifetime_contribution?: string | null
          locked_at?: string | null
          locked_by?: string | null
          main_beneficiaries?: string | null
          nomination_id?: string | null
          nominee_id: string
          nrc_recommendation?: string | null
          prepared_by?: string | null
          source_quality_notes?: string | null
          status?: Database["public"]["Enums"]["dossier_status"]
          supersedes_version_id?: string | null
          updated_at?: string
          verified_achievements?: Json
          version_number: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          biography?: string | null
          content_hash?: string | null
          created_at?: string
          evidence_library?: Json
          geographic_reach?: string | null
          id?: string
          impact_summary?: string | null
          known_limitations?: string | null
          lifetime_contribution?: string | null
          locked_at?: string | null
          locked_by?: string | null
          main_beneficiaries?: string | null
          nomination_id?: string | null
          nominee_id?: string
          nrc_recommendation?: string | null
          prepared_by?: string | null
          source_quality_notes?: string | null
          status?: Database["public"]["Enums"]["dossier_status"]
          supersedes_version_id?: string | null
          updated_at?: string
          verified_achievements?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "nominee_dossier_versions_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_dossier_versions_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_dossier_versions_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_dossier_versions_supersedes_version_id_fkey"
            columns: ["supersedes_version_id"]
            isOneToOne: false
            referencedRelation: "nominee_dossier_versions"
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
      nominee_pathway_assignments: {
        Row: {
          assigned_at: string
          created_at: string
          dossier_version_id: string
          id: string
          nominee_id: string
          pathway_id: string
          pipeline_status: Database["public"]["Enums"]["pipeline_status"]
          push_id: string | null
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          created_at?: string
          dossier_version_id: string
          id?: string
          nominee_id: string
          pathway_id: string
          pipeline_status?: Database["public"]["Enums"]["pipeline_status"]
          push_id?: string | null
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          created_at?: string
          dossier_version_id?: string
          id?: string
          nominee_id?: string
          pathway_id?: string
          pipeline_status?: Database["public"]["Enums"]["pipeline_status"]
          push_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nominee_pathway_assignments_dossier_version_id_fkey"
            columns: ["dossier_version_id"]
            isOneToOne: false
            referencedRelation: "nominee_dossier_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pathway_assignments_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pathway_assignments_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pathway_assignments_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pathway_assignments_push_id_fkey"
            columns: ["push_id"]
            isOneToOne: false
            referencedRelation: "nrc_nominee_pushes"
            referencedColumns: ["id"]
          },
        ]
      }
      nominee_pipeline_status: {
        Row: {
          created_at: string
          current_dossier_version_id: string | null
          current_pathway_id: string | null
          current_status: Database["public"]["Enums"]["pipeline_status"]
          last_transition_at: string
          last_transition_by: string | null
          metadata: Json
          nominee_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_dossier_version_id?: string | null
          current_pathway_id?: string | null
          current_status?: Database["public"]["Enums"]["pipeline_status"]
          last_transition_at?: string
          last_transition_by?: string | null
          metadata?: Json
          nominee_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_dossier_version_id?: string | null
          current_pathway_id?: string | null
          current_status?: Database["public"]["Enums"]["pipeline_status"]
          last_transition_at?: string
          last_transition_by?: string | null
          metadata?: Json
          nominee_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nominee_pipeline_status_current_dossier_version_id_fkey"
            columns: ["current_dossier_version_id"]
            isOneToOne: false
            referencedRelation: "nominee_dossier_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pipeline_status_current_pathway_id_fkey"
            columns: ["current_pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pipeline_status_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: true
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pipeline_status_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: true
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      nominee_pipeline_transitions: {
        Row: {
          actor_role: string | null
          actor_user_id: string | null
          created_at: string
          dossier_version_id: string | null
          from_status: Database["public"]["Enums"]["pipeline_status"] | null
          id: string
          metadata: Json
          nominee_id: string
          notes: string | null
          pathway_id: string | null
          to_status: Database["public"]["Enums"]["pipeline_status"]
        }
        Insert: {
          actor_role?: string | null
          actor_user_id?: string | null
          created_at?: string
          dossier_version_id?: string | null
          from_status?: Database["public"]["Enums"]["pipeline_status"] | null
          id?: string
          metadata?: Json
          nominee_id: string
          notes?: string | null
          pathway_id?: string | null
          to_status: Database["public"]["Enums"]["pipeline_status"]
        }
        Update: {
          actor_role?: string | null
          actor_user_id?: string | null
          created_at?: string
          dossier_version_id?: string | null
          from_status?: Database["public"]["Enums"]["pipeline_status"] | null
          id?: string
          metadata?: Json
          nominee_id?: string
          notes?: string | null
          pathway_id?: string | null
          to_status?: Database["public"]["Enums"]["pipeline_status"]
        }
        Relationships: [
          {
            foreignKeyName: "nominee_pipeline_transitions_dossier_version_id_fkey"
            columns: ["dossier_version_id"]
            isOneToOne: false
            referencedRelation: "nominee_dossier_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pipeline_transitions_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pipeline_transitions_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominee_pipeline_transitions_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
        ]
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
          country_iso2: string | null
          country_of_impact: string | null
          country_of_residence_iso2: string | null
          created_at: string | null
          diaspora_continent: string | null
          diaspora_status: boolean
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
          recognition_pathway: string | null
          referral_code: string | null
          region: string | null
          region_code: string | null
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
          country_iso2?: string | null
          country_of_impact?: string | null
          country_of_residence_iso2?: string | null
          created_at?: string | null
          diaspora_continent?: string | null
          diaspora_status?: boolean
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
          recognition_pathway?: string | null
          referral_code?: string | null
          region?: string | null
          region_code?: string | null
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
          country_iso2?: string | null
          country_of_impact?: string | null
          country_of_residence_iso2?: string | null
          created_at?: string | null
          diaspora_continent?: string | null
          diaspora_status?: boolean
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
          recognition_pathway?: string | null
          referral_code?: string | null
          region?: string | null
          region_code?: string | null
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
            foreignKeyName: "nominees_country_iso2_fkey"
            columns: ["country_iso2"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["iso2"]
          },
          {
            foreignKeyName: "nominees_country_of_residence_iso2_fkey"
            columns: ["country_of_residence_iso2"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["iso2"]
          },
          {
            foreignKeyName: "nominees_region_code_fkey"
            columns: ["region_code"]
            isOneToOne: false
            referencedRelation: "regions_v2"
            referencedColumns: ["code"]
          },
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
      nrc_nominee_pushes: {
        Row: {
          checklist: Json
          created_at: string
          dossier_version_id: string
          failure_reason: string | null
          id: string
          nomination_id: string | null
          nominee_id: string
          pathway_id: string
          pushed_at: string
          pushed_by: string
          revoked_at: string | null
          revoked_by: string | null
          status: Database["public"]["Enums"]["push_status"]
          updated_at: string
        }
        Insert: {
          checklist?: Json
          created_at?: string
          dossier_version_id: string
          failure_reason?: string | null
          id?: string
          nomination_id?: string | null
          nominee_id: string
          pathway_id: string
          pushed_at?: string
          pushed_by: string
          revoked_at?: string | null
          revoked_by?: string | null
          status?: Database["public"]["Enums"]["push_status"]
          updated_at?: string
        }
        Update: {
          checklist?: Json
          created_at?: string
          dossier_version_id?: string
          failure_reason?: string | null
          id?: string
          nomination_id?: string | null
          nominee_id?: string
          pathway_id?: string
          pushed_at?: string
          pushed_by?: string
          revoked_at?: string | null
          revoked_by?: string | null
          status?: Database["public"]["Enums"]["push_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nrc_nominee_pushes_dossier_version_id_fkey"
            columns: ["dossier_version_id"]
            isOneToOne: false
            referencedRelation: "nominee_dossier_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_nominee_pushes_nomination_id_fkey"
            columns: ["nomination_id"]
            isOneToOne: false
            referencedRelation: "nominations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_nominee_pushes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_nominee_pushes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nrc_nominee_pushes_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
        ]
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
      pathway_clarification_requests: {
        Row: {
          acknowledged_at: string | null
          created_at: string
          dossier_section: string | null
          escalated_at: string | null
          evidence_reference: string | null
          id: string
          nominee_id: string
          pathway_id: string
          question: string
          requested_by: string
          responded_at: string | null
          responded_by: string | null
          response_dossier_version_id: string | null
          response_text: string | null
          review_deadline: string | null
          status: Database["public"]["Enums"]["clarification_status"]
          updated_at: string
          urgency: string
        }
        Insert: {
          acknowledged_at?: string | null
          created_at?: string
          dossier_section?: string | null
          escalated_at?: string | null
          evidence_reference?: string | null
          id?: string
          nominee_id: string
          pathway_id: string
          question: string
          requested_by: string
          responded_at?: string | null
          responded_by?: string | null
          response_dossier_version_id?: string | null
          response_text?: string | null
          review_deadline?: string | null
          status?: Database["public"]["Enums"]["clarification_status"]
          updated_at?: string
          urgency?: string
        }
        Update: {
          acknowledged_at?: string | null
          created_at?: string
          dossier_section?: string | null
          escalated_at?: string | null
          evidence_reference?: string | null
          id?: string
          nominee_id?: string
          pathway_id?: string
          question?: string
          requested_by?: string
          responded_at?: string | null
          responded_by?: string | null
          response_dossier_version_id?: string | null
          response_text?: string | null
          review_deadline?: string | null
          status?: Database["public"]["Enums"]["clarification_status"]
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_clarification_requests_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_clarification_requests_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_clarification_requests_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_clarification_requests_response_dossier_version_id_fkey"
            columns: ["response_dossier_version_id"]
            isOneToOne: false
            referencedRelation: "nominee_dossier_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_deliberation_messages: {
        Row: {
          author_user_id: string
          created_at: string
          id: string
          message: string
          nominee_id: string | null
          pathway_id: string
        }
        Insert: {
          author_user_id: string
          created_at?: string
          id?: string
          message: string
          nominee_id?: string | null
          pathway_id: string
        }
        Update: {
          author_user_id?: string
          created_at?: string
          id?: string
          message?: string
          nominee_id?: string | null
          pathway_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_deliberation_messages_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_deliberation_messages_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_deliberation_messages_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_finalist_selections: {
        Row: {
          confirmed_at: string
          created_at: string
          id: string
          nominee_id: string
          panel_chair_id: string | null
          panel_report_url: string | null
          pathway_id: string
          rank: Database["public"]["Enums"]["finalist_rank"]
          total_points: number | null
          updated_at: string
        }
        Insert: {
          confirmed_at?: string
          created_at?: string
          id?: string
          nominee_id: string
          panel_chair_id?: string | null
          panel_report_url?: string | null
          pathway_id: string
          rank: Database["public"]["Enums"]["finalist_rank"]
          total_points?: number | null
          updated_at?: string
        }
        Update: {
          confirmed_at?: string
          created_at?: string
          id?: string
          nominee_id?: string
          panel_chair_id?: string | null
          panel_report_url?: string | null
          pathway_id?: string
          rank?: Database["public"]["Enums"]["finalist_rank"]
          total_points?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_finalist_selections_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_finalist_selections_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_finalist_selections_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_judge_assignments: {
        Row: {
          active: boolean
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          is_chair: boolean
          judge_user_id: string
          pathway_id: string
          seat_number: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_chair?: boolean
          judge_user_id: string
          pathway_id: string
          seat_number?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          is_chair?: boolean
          judge_user_id?: string
          pathway_id?: string
          seat_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_judge_assignments_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_scorecards: {
        Row: {
          created_at: string
          id: string
          judge_user_id: string
          justification: string | null
          locked_at: string | null
          nominee_id: string
          pathway_id: string
          review_id: string
          rubric_version: string
          scores: Json
          status: Database["public"]["Enums"]["scorecard_status"]
          submitted_at: string | null
          total_score: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          judge_user_id: string
          justification?: string | null
          locked_at?: string | null
          nominee_id: string
          pathway_id: string
          review_id: string
          rubric_version?: string
          scores?: Json
          status?: Database["public"]["Enums"]["scorecard_status"]
          submitted_at?: string | null
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          judge_user_id?: string
          justification?: string | null
          locked_at?: string | null
          nominee_id?: string
          pathway_id?: string
          review_id?: string
          rubric_version?: string
          scores?: Json
          status?: Database["public"]["Enums"]["scorecard_status"]
          submitted_at?: string | null
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_scorecards_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_scorecards_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_scorecards_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_scorecards_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "judge_nominee_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      pathway_voting_ballots: {
        Row: {
          ballot_hash: string | null
          created_at: string
          first_nominee_id: string | null
          id: string
          judge_user_id: string
          locked_at: string | null
          pathway_id: string
          rationale: string | null
          reserve_nominee_id: string | null
          second_nominee_id: string | null
          submitted_at: string | null
          third_nominee_id: string | null
          updated_at: string
        }
        Insert: {
          ballot_hash?: string | null
          created_at?: string
          first_nominee_id?: string | null
          id?: string
          judge_user_id: string
          locked_at?: string | null
          pathway_id: string
          rationale?: string | null
          reserve_nominee_id?: string | null
          second_nominee_id?: string | null
          submitted_at?: string | null
          third_nominee_id?: string | null
          updated_at?: string
        }
        Update: {
          ballot_hash?: string | null
          created_at?: string
          first_nominee_id?: string | null
          id?: string
          judge_user_id?: string
          locked_at?: string | null
          pathway_id?: string
          rationale?: string | null
          reserve_nominee_id?: string | null
          second_nominee_id?: string | null
          submitted_at?: string | null
          third_nominee_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pathway_voting_ballots_first_nominee_id_fkey"
            columns: ["first_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_first_nominee_id_fkey"
            columns: ["first_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_reserve_nominee_id_fkey"
            columns: ["reserve_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_reserve_nominee_id_fkey"
            columns: ["reserve_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_second_nominee_id_fkey"
            columns: ["second_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_second_nominee_id_fkey"
            columns: ["second_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_third_nominee_id_fkey"
            columns: ["third_nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_voting_ballots_third_nominee_id_fkey"
            columns: ["third_nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
        ]
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
      recognition_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          metadata: Json
          name: string
          slug: string
          sort_order: number
          tagline: string | null
          tier_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
          sort_order?: number
          tagline?: string | null
          tier_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          sort_order?: number
          tagline?: string | null
          tier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recognition_categories_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "recognition_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      recognition_classifications: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "recognition_classifications_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "recognition_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      recognition_cycles: {
        Row: {
          created_at: string
          ends_on: string | null
          gala_date: string | null
          id: string
          metadata: Json
          name: string
          slug: string
          starts_on: string | null
          status: string
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          ends_on?: string | null
          gala_date?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
          starts_on?: string | null
          status?: string
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          ends_on?: string | null
          gala_date?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          starts_on?: string | null
          status?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      recognition_subcategories: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          metadata: Json
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recognition_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "recognition_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      recognition_tiers: {
        Row: {
          created_at: string
          cycle_id: string
          description: string | null
          id: string
          metadata: Json
          name: string
          rank: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          rank?: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          rank?: number
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recognition_tiers_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "recognition_cycles"
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
      region_migration_log: {
        Row: {
          changed_at: string
          changed_by: string | null
          entity_id: string
          entity_type: string
          id: string
          new_region_code: string | null
          old_region: string | null
          reason: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          entity_id: string
          entity_type: string
          id?: string
          new_region_code?: string | null
          old_region?: string | null
          reason?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          new_region_code?: string | null
          old_region?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "region_migration_log_new_region_code_fkey"
            columns: ["new_region_code"]
            isOneToOne: false
            referencedRelation: "regions_v2"
            referencedColumns: ["code"]
          },
        ]
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
      regions_v2: {
        Row: {
          code: string
          created_at: string
          description: string | null
          display_order: number
          effective_date: string
          id: string
          is_active: boolean
          name: string
          region_type: string
          slug: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          display_order?: number
          effective_date?: string
          id?: string
          is_active?: boolean
          name: string
          region_type: string
          slug: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          display_order?: number
          effective_date?: string
          id?: string
          is_active?: boolean
          name?: string
          region_type?: string
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
      site_stats: {
        Row: {
          active_volunteer_chapters: number
          directory_nominees: number
          global_communities: number
          gold_blue_garnet_subcategories: number
          icon_laureates: number
          icon_subcategories: number
          id: string
          impact_stories: number
          influencer_subcategories: number
          platinum_subcategories: number
          registered_chapters: number
          singleton: boolean
          tiers: number
          total_categories: number
          total_forms: number
          total_regions: number
          updated_at: string
          volunteer_countries: number
          volunteers: number
        }
        Insert: {
          active_volunteer_chapters?: number
          directory_nominees?: number
          global_communities?: number
          gold_blue_garnet_subcategories?: number
          icon_laureates?: number
          icon_subcategories?: number
          id?: string
          impact_stories?: number
          influencer_subcategories?: number
          platinum_subcategories?: number
          registered_chapters?: number
          singleton?: boolean
          tiers?: number
          total_categories?: number
          total_forms?: number
          total_regions?: number
          updated_at?: string
          volunteer_countries?: number
          volunteers?: number
        }
        Update: {
          active_volunteer_chapters?: number
          directory_nominees?: number
          global_communities?: number
          gold_blue_garnet_subcategories?: number
          icon_laureates?: number
          icon_subcategories?: number
          id?: string
          impact_stories?: number
          influencer_subcategories?: number
          platinum_subcategories?: number
          registered_chapters?: number
          singleton?: boolean
          tiers?: number
          total_categories?: number
          total_forms?: number
          total_regions?: number
          updated_at?: string
          volunteer_countries?: number
          volunteers?: number
        }
        Relationships: []
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
      webinar_registrations: {
        Row: {
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          organization: string | null
          role: string | null
          source: string | null
          status: string
          user_id: string | null
          webinar_date: string | null
          webinar_id: string
          webinar_time: string | null
          webinar_title: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          organization?: string | null
          role?: string | null
          source?: string | null
          status?: string
          user_id?: string | null
          webinar_date?: string | null
          webinar_id: string
          webinar_time?: string | null
          webinar_title: string
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          organization?: string | null
          role?: string | null
          source?: string | null
          status?: string
          user_id?: string | null
          webinar_date?: string | null
          webinar_id?: string
          webinar_time?: string | null
          webinar_title?: string
        }
        Relationships: []
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
      influencer_nominees_by_region: {
        Row: {
          award_family: string | null
          nominee_count: number | null
          region_name: string | null
          region_slug: string | null
          verified_count: number | null
        }
        Relationships: []
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
      pathway_scorecards_status: {
        Row: {
          id: string | null
          judge_user_id: string | null
          locked_at: string | null
          nominee_id: string | null
          pathway_id: string | null
          review_id: string | null
          status: Database["public"]["Enums"]["scorecard_status"] | null
          submitted_at: string | null
        }
        Insert: {
          id?: string | null
          judge_user_id?: string | null
          locked_at?: string | null
          nominee_id?: string | null
          pathway_id?: string | null
          review_id?: string | null
          status?: Database["public"]["Enums"]["scorecard_status"] | null
          submitted_at?: string | null
        }
        Update: {
          id?: string | null
          judge_user_id?: string | null
          locked_at?: string | null
          nominee_id?: string | null
          pathway_id?: string | null
          review_id?: string | null
          status?: Database["public"]["Enums"]["scorecard_status"] | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pathway_scorecards_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_scorecards_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "public_nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_scorecards_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "judging_pathways"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pathway_scorecards_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "judge_nominee_reviews"
            referencedColumns: ["id"]
          },
        ]
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
      accept_nomination_by_token: {
        Args: { p_token: string }
        Returns: {
          already_accepted: boolean
          name: string
          nominee_id: string
          referral_code: string
          slug: string
        }[]
      }
      approve_icon_laureate: {
        Args: { p_position_id: string }
        Returns: undefined
      }
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
      check_email_exists: { Args: { p_email: string }; Returns: boolean }
      check_nrc_quorum: { Args: { p_nomination_id: string }; Returns: Json }
      compute_blue_garnet_results: {
        Args: { p_season_id: string }
        Returns: Json
      }
      compute_gold_results: { Args: { p_season_id: string }; Returns: Json }
      compute_icon_grand_jury_results: {
        Args: { p_group_id: string }
        Returns: undefined
      }
      compute_icon_results: {
        Args: { p_label: string; p_min_reviewers?: number }
        Returns: string
      }
      convert_nomination_draft: {
        Args: {
          p_season_id?: string
          p_subcategory_id?: string
          p_token: string
        }
        Returns: {
          nomination_id: string
          nomination_reference: string
        }[]
      }
      create_nomination_draft: {
        Args: {
          p_award_tier?: string
          p_category_slug?: string
          p_form_type: string
          p_nominator_email?: string
          p_nominee_data?: Json
          p_session_id?: string
          p_subcategory_slug?: string
        }
        Returns: {
          draft_token: string
          expires_at: string
          id: string
        }[]
      }
      declare_icon_conflict: {
        Args: {
          p_conflict_type: string
          p_description?: string
          p_nominee_id: string
          p_severity: string
        }
        Returns: string
      }
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
      generate_draft_token: { Args: never; Returns: string }
      generate_identity_hash: {
        Args: {
          p_country?: string
          p_email?: string
          p_name: string
          p_phone?: string
        }
        Returns: string
      }
      generate_nomination_reference: { Args: never; Returns: string }
      generate_receipt_number: { Args: never; Returns: string }
      generate_referral_code: { Args: { p_prefix?: string }; Returns: string }
      generate_volunteer_referral_code: { Args: never; Returns: string }
      get_current_season: { Args: never; Returns: string }
      get_my_nomination_status: {
        Args: { p_reference: string }
        Returns: {
          award_category: string
          nomination_status: string
          nominee_name: string
          reference: string
          submitted_at: string
          verification_status: string
        }[]
      }
      get_nomination_draft: {
        Args: { p_token: string }
        Returns: {
          award_tier: string | null
          category_slug: string | null
          converted_at: string | null
          converted_to_nomination_id: string | null
          converted_user_id: string | null
          created_at: string
          draft_token: string
          expires_at: string
          form_type: string
          id: string
          nominator_email: string | null
          nominee_data: Json
          session_id: string | null
          status: string
          subcategory_slug: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "nomination_drafts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_nominee_by_acceptance_token: {
        Args: { p_token: string }
        Returns: {
          acceptance_status: Database["public"]["Enums"]["acceptance_status"]
          acceptance_token_expires_at: string
          country: string
          email: string
          id: string
          name: string
          organization: string
          recognition_pathway: string
          referral_code: string
          region: string
          renomination_count: number
          slug: string
          title: string
        }[]
      }
      get_rebuild_schools_admin: {
        Args: never
        Returns: {
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
        }[]
        SetofOptions: {
          from: "*"
          to: "rebuild_schools"
          isOneToOne: false
          isSetofReturn: true
        }
      }
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
      icon_ensure_review: { Args: { p_assignment_id: string }; Returns: string }
      icon_governance_decide: {
        Args: { p_decision: string; p_group_id: string; p_notes: string }
        Returns: string
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
      is_icon_governance: { Args: { _uid: string }; Returns: boolean }
      is_icon_judge: { Args: { _uid: string }; Returns: boolean }
      is_icon_moderator: { Args: { _uid: string }; Returns: boolean }
      is_stage_open: {
        Args: { _action: Database["public"]["Enums"]["stage_action"] }
        Returns: boolean
      }
      link_nomination_to_account: {
        Args: { p_reference: string }
        Returns: boolean
      }
      mint_acceptance_token: {
        Args: { p_nominee_id: string }
        Returns: {
          email: string
          expires_at: string
          name: string
          token: string
        }[]
      }
      publish_results: {
        Args: { p_contest_type: string; p_season_id: string }
        Returns: Json
      }
      push_nominee_to_pathway: {
        Args: {
          p_checklist?: Json
          p_dossier_version_id: string
          p_nominee_id: string
          p_pathway_id: string
        }
        Returns: string
      }
      record_renomination_via_referral: {
        Args: {
          p_device_hash?: string
          p_endorser_email?: string
          p_endorser_name?: string
          p_message?: string
          p_referral_code: string
        }
        Returns: {
          new_count: number
          nominee_id: string
          was_duplicate: boolean
        }[]
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
      reopen_icon_review: {
        Args: { p_reason: string; p_review_id: string }
        Returns: undefined
      }
      slugify: { Args: { p: string }; Returns: string }
      submit_icon_grand_jury_ballot: {
        Args: {
          p_first: string
          p_group_id: string
          p_second: string
          p_third: string
        }
        Returns: {
          ballot_id: string
          receipt: string
        }[]
      }
      submit_icon_score: {
        Args: {
          p_evidence_flag?: string
          p_recommendation: string
          p_review_id: string
        }
        Returns: undefined
      }
      submit_icon_shortlist: {
        Args: {
          p_finalist_1: string
          p_finalist_2: string
          p_finalist_3: string
          p_justification: string
          p_panel_id: string
          p_reserve: string
        }
        Returns: string
      }
      submit_public_nomination: {
        Args: {
          p_award_tier: string
          p_category_slug: string
          p_draft_token?: string
          p_form_type: string
          p_impact_summary?: string
          p_nominator_email?: string
          p_nominee_country?: string
          p_nominee_name: string
          p_payload: Json
          p_subcategory?: string
        }
        Returns: {
          intake_id: string
          is_duplicate: boolean
          reference: string
        }[]
      }
      update_nomination_draft: {
        Args: {
          p_award_tier?: string
          p_category_slug?: string
          p_nominator_email?: string
          p_nominee_data: Json
          p_subcategory_slug?: string
          p_token: string
        }
        Returns: {
          award_tier: string | null
          category_slug: string | null
          converted_at: string | null
          converted_to_nomination_id: string | null
          converted_user_id: string | null
          created_at: string
          draft_token: string
          expires_at: string
          form_type: string
          id: string
          nominator_email: string | null
          nominee_data: Json
          session_id: string | null
          status: string
          subcategory_slug: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "nomination_drafts"
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
      certificate_tier:
        | "gold"
        | "platinum"
        | "blue_garnet"
        | "icon"
        | "gold_special"
      clarification_status:
        | "open"
        | "answered"
        | "acknowledged"
        | "escalated"
        | "resolved"
      contest_type:
        | "GOLD_PUBLIC"
        | "BLUE_PUBLIC"
        | "BLUE_JUDGES"
        | "ICON_LIFETIME_JUDGES"
      disbursement_status: "DRAFT" | "COMPLETED" | "FAILED"
      dossier_status: "draft" | "ready" | "approved" | "locked" | "superseded"
      finalist_rank: "first" | "second" | "third" | "reserve"
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
      pipeline_status:
        | "NOMINATION_RECEIVED"
        | "AUTOMATED_SCREENING"
        | "NRC_REVIEW"
        | "DUPLICATE_REVIEW"
        | "ELIGIBILITY_REVIEW"
        | "AWAITING_ACCEPTANCE"
        | "EVIDENCE_COLLECTION"
        | "VERIFICATION_IN_PROGRESS"
        | "VERIFICATION_COMPLETED"
        | "DOSSIER_READY"
        | "APPROVED_FOR_JUDGES"
        | "PUSHED_TO_PATHWAY"
        | "UNDER_JUDGE_REVIEW"
        | "CLARIFICATION_REQUIRED"
        | "READY_FOR_DELIBERATION"
        | "PATHWAY_DELIBERATION"
        | "PATHWAY_VOTING"
        | "TOP_THREE"
        | "RESERVE"
        | "FINAL_VOTING"
        | "GOVERNANCE_VALIDATION"
        | "LAUREATE_APPROVED"
        | "ARCHIVED"
      product_category: "APPAREL" | "ACCESSORIES" | "LIMITED" | "BUNDLES"
      push_status: "pending" | "pushed" | "failed" | "revoked"
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
        | "ICON_JUDGE"
        | "ICON_MODERATOR"
        | "ICON_GOVERNANCE"
      scorecard_status: "not_started" | "draft" | "submitted" | "locked"
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
      clarification_status: [
        "open",
        "answered",
        "acknowledged",
        "escalated",
        "resolved",
      ],
      contest_type: [
        "GOLD_PUBLIC",
        "BLUE_PUBLIC",
        "BLUE_JUDGES",
        "ICON_LIFETIME_JUDGES",
      ],
      disbursement_status: ["DRAFT", "COMPLETED", "FAILED"],
      dossier_status: ["draft", "ready", "approved", "locked", "superseded"],
      finalist_rank: ["first", "second", "third", "reserve"],
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
      pipeline_status: [
        "NOMINATION_RECEIVED",
        "AUTOMATED_SCREENING",
        "NRC_REVIEW",
        "DUPLICATE_REVIEW",
        "ELIGIBILITY_REVIEW",
        "AWAITING_ACCEPTANCE",
        "EVIDENCE_COLLECTION",
        "VERIFICATION_IN_PROGRESS",
        "VERIFICATION_COMPLETED",
        "DOSSIER_READY",
        "APPROVED_FOR_JUDGES",
        "PUSHED_TO_PATHWAY",
        "UNDER_JUDGE_REVIEW",
        "CLARIFICATION_REQUIRED",
        "READY_FOR_DELIBERATION",
        "PATHWAY_DELIBERATION",
        "PATHWAY_VOTING",
        "TOP_THREE",
        "RESERVE",
        "FINAL_VOTING",
        "GOVERNANCE_VALIDATION",
        "LAUREATE_APPROVED",
        "ARCHIVED",
      ],
      product_category: ["APPAREL", "ACCESSORIES", "LIMITED", "BUNDLES"],
      push_status: ["pending", "pushed", "failed", "revoked"],
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
        "ICON_JUDGE",
        "ICON_MODERATOR",
        "ICON_GOVERNANCE",
      ],
      scorecard_status: ["not_started", "draft", "submitted", "locked"],
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
