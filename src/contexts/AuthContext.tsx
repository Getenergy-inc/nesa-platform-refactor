import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import type { AppRole } from "@/config/roles";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  fullName?: string;
  phone: string;
}
// enum AccountType {
//   INDIVIDUAL,
//   ORGANIZATION,
//   JUDGE,
//   CHAPTER_LEADER,
//   SPONSOR,
//   VOLUNTEER,
// }
// enum UserRole {
//   FREE_MEMBER,
//   ADMIN,
//   SUPER_ADMIN,
// }

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  roles: AppRole[];
  loading: boolean;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
  verifyCode: (code: string, email: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
}

export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string | null;
  dateOfBirth: string | null;
  accountType: string;
  role: string;
  country: string;
  state: string | null;
  city: string | null;
  address: string | null;
  intents: string[];
  organizationName: string | null;
  organizationType: string | null;
  organizationWebsite: string | null;
  organizationNumber: string | null;
  organizationFunctions: string[] | [];
  organizationSector: string | null;
  // 👇 extensible
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_BASE = import.meta.env.VITE_BASE_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshTimeoutRef = useRef<number | null>(null);

  /* ---------------------- TOKEN REFRESH ---------------------- */

  const scheduleTokenRefresh = () => {
    // refresh 1 minute before expiry (7 min token)
    refreshTimeoutRef.current = window.setTimeout(
      refreshAccessToken,
      6 * 60 * 1000,
    );
  };

  const refreshAccessToken = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/accesstoken`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      setAccessToken(data.token);
      scheduleTokenRefresh();
    } catch {
      clearAuth();
    }
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRoles([]);
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
  };

  /* ---------------------- BOOTSTRAP ---------------------- */

  useEffect(() => {
    // On app load, attempt refresh
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/accesstoken`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data.user);
        setRoles(data.roles);
        setAccessToken(data.token);
        scheduleTokenRefresh();
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  /* ---------------------- AUTH ACTIONS ---------------------- */

  const signUp = async (payload: SignUpPayload) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    // optional: auto-login after signup
    // await signIn(payload.email, payload.password);
  };

  const resendCode = async (email: string) => {
    const res = await fetch(`${API_BASE}/auth/otp?email=${email}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
  };

  const verifyCode = async (code: string, email: string) => {
    const res = await fetch(
      `${API_BASE}/auth/verifyotp?email=${email}&otp=${code}`,
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message);
    }

    const data = await res.json();
    setUser(data.userInfo);
    setRoles(data.roles);
    setAccessToken(data.accessToken);
    scheduleTokenRefresh();
    console.log("context user is this", user);
  };

  const signOut = async () => {
    await authFetch(
      `${API_BASE}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      },
      accessToken,
    );
    clearAuth();
  };

  const hasRole = (role: AppRole) => roles.includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        roles,
        loading,
        signUp,
        signIn,
        signOut,
        hasRole,
        verifyCode,
        resendCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------------- HOOK ---------------------- */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
  accessToken: string | null,
) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  return res;
}
