import type { User } from "@supabase/supabase-js";
import type { AppRole } from "@/lib/roles";
import { useAuth } from "@/components/auth/UseAuth";

interface SessionState {
  loading: boolean;
  user: User | null;
  session: ReturnType<typeof useAuth>["session"];
  role: AppRole | null;
  fullName: string | null;
}

export function useSession(): SessionState {
  const { session, user, isLoading } = useAuth();
  return {
    loading: isLoading,
    user: session?.user ?? null,
    session,
    role: user?.role ?? null,
    fullName: user?.name ?? null,
  };
}
