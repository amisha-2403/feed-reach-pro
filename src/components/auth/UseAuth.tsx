import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "farmer" | "shop" | "delivery" | "admin";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status from localStorage or Supabase
  useEffect(() => {
    const storedUser = localStorage.getItem("gramsetu.user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Implement real auth with Supabase
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // if (error) throw error;
    // setUser({ ...data.user, ...data.user.user_metadata });
    // localStorage.setItem("gramsetu.user", JSON.stringify(user));
    setUser({
      id: "user1",
      name: "User",
      email,
      phone: "",
      role: "customer",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("gramsetu.user", JSON.stringify(user));
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    // TODO: Implement real auth with Supabase
    // const { data, error } = await supabase.auth.signUp({ email, password, data: { name, phone } });
    // if (error) throw error;
    setUser({
      id: "user2",
      name,
      email,
      phone,
      role: "customer",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("gramsetu.user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gramsetu.user");
    // TODO: supabase.auth.signOut();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, isLoading: false, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStatus = () => {
  const { user, isLoading } = useAuth();
  return { user, isLoading, isAuthenticated: !!user };
};