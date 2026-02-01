import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/config/roles";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string, referralCode?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener BEFORE getting initial session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch roles - use setTimeout to avoid potential deadlock
          setTimeout(async () => {
            const { data } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id);
            setRoles((data || []).map(r => r.role as AppRole));
          }, 0);
        } else {
          setRoles([]);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .then(({ data }) => {
            setRoles((data || []).map(r => r.role as AppRole));
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string, referralCode?: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    if (error) throw error;
    
    // If signup successful and referral code provided, link referrer
    if (data.user && referralCode) {
      // First check the referrals table (for user and chapter referrals)
      const { data: referral } = await supabase
        .from("referrals")
        .select("owner_id, owner_type")
        .eq("referral_code", referralCode)
        .eq("is_active", true)
        .maybeSingle();
      
      if (referral) {
        // Update profile with referrer info
        if (referral.owner_type === "USER") {
          await supabase.from("profiles").update({
            referred_by_user_id: referral.owner_id
          }).eq("user_id", data.user.id);
        } else if (referral.owner_type === "CHAPTER") {
          await supabase.from("profiles").update({
            referred_by_chapter_id: referral.owner_id
          }).eq("user_id", data.user.id);
        }
        
        // Create referral event for signup
        await supabase.from("referral_events").insert({
          referrer_type: referral.owner_type,
          referrer_id: referral.owner_id,
          referred_user_id: data.user.id,
          event_type: "SIGNUP",
          reward_agc: 10, // Default signup bonus
        });
      } else {
        // Fallback: Check chapters.referral_code directly (for chapter codes like CH-NIG-xxx)
        const { data: chapter } = await supabase
          .from("chapters")
          .select("id")
          .eq("referral_code", referralCode)
          .eq("is_active", true)
          .maybeSingle();
        
        if (chapter) {
          // Update profile with chapter referrer
          await supabase.from("profiles").update({
            referred_by_chapter_id: chapter.id
          }).eq("user_id", data.user.id);
          
          // Create referral event for chapter signup
          await supabase.from("referral_events").insert({
            referrer_type: "CHAPTER",
            referrer_id: chapter.id,
            referred_user_id: data.user.id,
            event_type: "SIGNUP",
            reward_agc: 10, // Default signup bonus
          });
        }
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, session, roles, loading, signUp, signIn, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
