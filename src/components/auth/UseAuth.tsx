import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import type { AppRole } from "@/lib/roles";
import { supabase } from "@/integrations/supabase/client";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AppRole;
  createdAt: string;
}

interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authEventVersion = useRef(0);

  useEffect(() => {
    let active = true;

    // Subscribe before reading the session so changes during startup are not missed.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      authEventVersion.current += 1;
      if (!active) return;
      setSession(nextSession);
      if (!nextSession) {
        setUser(null);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    });

    const initialVersion = authEventVersion.current;
    void supabase.auth.getSession().then(({ data: sessionData, error }) => {
      if (!active || authEventVersion.current !== initialVersion) return;
      if (error) console.error("Unable to restore Supabase session:", error);
      setSession(sessionData.session);
      if (!sessionData.session) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const sessionUser = session?.user;

    if (!sessionUser) {
      setUser(null);
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    setIsLoading(true);
    void Promise.all([
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sessionUser.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", sessionUser.id)
        .maybeSingle(),
    ]).then(([roleResult, profileResult]) => {
      if (!active) return;
      if (roleResult.error) console.error("Unable to load the user role:", roleResult.error);
      if (profileResult.error) console.error("Unable to load the user profile:", profileResult.error);

      const email = sessionUser.email ?? "";
      const fullName = profileResult.data?.full_name ?? sessionUser.user_metadata?.full_name;
      setUser({
        id: sessionUser.id,
        name: fullName || email.split("@")[0] || "Account",
        email,
        phone: profileResult.data?.phone ?? sessionUser.phone ?? "",
        role: (roleResult.data?.role as AppRole | undefined) ?? "customer",
        createdAt: sessionUser.created_at,
      });
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, [session]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, phone, role: "customer" },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({ session, user, isLoading, login, register, logout }),
    [session, user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthStatus = () => {
  const { user, isLoading } = useAuth();
  return { user, isLoading, isAuthenticated: !!user };
};
