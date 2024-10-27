import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface AuthUser extends User {
  username?: string;
  avatar_url?: string;
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const INITIAL_STATE: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const navigate = useNavigate();
  const [persistedAuth, setPersistedAuth] = useLocalStorage<{
    session: Session | null;
    user: AuthUser | null;
  }>("auth", { session: null, user: null });

  // Fehlerbehandlung
  const handleAuthError = useCallback((error: AuthError, action: string) => {
    console.error(`${action} error:`, error);

    // Benutzerfreundliche Fehlermeldungen
    const errorMessages: Record<string, string> = {
      "Invalid login credentials": "Ungültige Anmeldedaten",
      "Email not confirmed": "Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse",
      "Password is too short":
        "Das Passwort muss mindestens 6 Zeichen lang sein",
      "User already registered": "Diese E-Mail-Adresse ist bereits registriert",
      "Invalid email": "Ungültige E-Mail-Adresse",
    };

    const message = errorMessages[error.message] || error.message;
    toast.error(`Fehler beim ${action}: ${message}`);
    throw error;
  }, []);

  // Session Management
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Prüfe auf gespeicherte Session
        if (persistedAuth.session && persistedAuth.user) {
          setState((prev) => ({
            ...prev,
            session: persistedAuth.session,
            user: persistedAuth.user,
            isAuthenticated: true,
            isLoading: false,
          }));
        }

        // Hole aktuelle Session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          const enhancedUser = {
            ...session.user,
            ...userData,
          };

          setState({
            user: enhancedUser,
            session,
            isAuthenticated: true,
            isLoading: false,
          });

          setPersistedAuth({ session, user: enhancedUser });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }

        // Auth State Listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event);
          // Zeige den Toast nur bei spezifischen Events
          if (event === "SIGNED_IN") {
            toast.success("Erfolgreich angemeldet!");
          } else if (event === "SIGNED_OUT") {
            toast.success("Erfolgreich abgemeldet!");
          }
          if (session) {
            const { data: userData } = await supabase
              .from("users")
              .select("*")
              .eq("id", session.user.id)
              .single();

            const enhancedUser = {
              ...session.user,
              ...userData,
            };

            setState({
              user: enhancedUser,
              session,
              isAuthenticated: true,
              isLoading: false,
            });

            setPersistedAuth({ session, user: enhancedUser });
          } else {
            setState({
              user: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
            });
            setPersistedAuth({ session: null, user: null });
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth setup error:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    setupAuth();
  }, []);

  // Auth Methods
  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/");
    } catch (error) {
      handleAuthError(error as AuthError, "Anmelden");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      toast.success(
        "Registrierung erfolgreich! Bitte bestätigen Sie Ihre E-Mail-Adresse.",
      );
    } catch (error) {
      handleAuthError(error as AuthError, "Registrieren");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
      });

      setPersistedAuth({ session: null, user: null });
      // navigate("/auth");
    } catch (error) {
      handleAuthError(error as AuthError, "Abmelden");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      handleAuthError(error as AuthError, "Google Anmeldung");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error } = await supabase
        .from("users")
        .update(data)
        .eq("id", state.user?.id);

      if (error) throw error;

      setState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...data } : null,
      }));

      toast.success("Profil erfolgreich aktualisiert!");
    } catch (error) {
      handleAuthError(error as AuthError, "Profil aktualisieren");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast.success(
        "Anweisungen zum Zurücksetzen wurden per E-Mail verschickt!",
      );
    } catch (error) {
      handleAuthError(error as AuthError, "Passwort zurücksetzen");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Passwort erfolgreich aktualisiert!");
    } catch (error) {
      handleAuthError(error as AuthError, "Passwort aktualisieren");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const deleteAccount = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Lösche zuerst alle user-bezogenen Daten
      const { error: userDataError } = await supabase
        .from("users")
        .delete()
        .eq("id", state.user?.id);

      if (userDataError) throw userDataError;

      // Lösche dann den Auth-User
      const { error: authError } = await supabase.auth.admin.deleteUser(
        state.user?.id as string,
      );

      if (authError) throw authError;

      await signOut();
      toast.success("Account erfolgreich gelöscht!");
    } catch (error) {
      handleAuthError(error as AuthError, "Account löschen");
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    updateProfile,
    resetPassword,
    updatePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
