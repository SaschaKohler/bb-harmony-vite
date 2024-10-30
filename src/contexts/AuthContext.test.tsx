import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { BrowserRouter } from "react-router-dom";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { aw } from "vitest/dist/chunks/reporters.anwo7Y6a.js";

// Mock für useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Supabase Client mocken
vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
    from: vi.fn(() => ({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}));

// Test Wrapper
const wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // localStorage Mock
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
    const mockUser = {
      id: "ed28ed71-eee5-4029-a971-2197bdd3cbfd",
      aud: "authenticated",
      email: "sascha.kohler@sent.at",
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
      user_metadata: {
        email: "sascha.kohler@sent.at",
        email_verified: true,
      },
      role: "authenticated",
      created_at: "2024-10-18T15:10:17.134677Z",
    };

    const mockSession = {
      access_token: "eyJhbGci...",
      expires_at: 1739218588,
      expires_in: 3600,
      refresh_token: "kFxwW3KIBzJ4lMwXMWhXw",
      token_type: "bearer",
      user: mockUser,
    };

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    // Standard Mock-Responses
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: {
        user: mockUser,
        session: null,
      },
      error: null,
    });

    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null,
    });
  });

  test("provides initial authentication state", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBeFalsy();
    expect(result.current.isLoading).toBeTruthy();
  });

  test("handles successful sign in", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn("sascha.kohler@sent.at", "password123");
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBeTruthy();
      expect(result.current.user?.email).toBe("sascha.kohler@sent.at");
    });
  });

  test("handles sign in error", async () => {
    // Mock Error Response
    const authError = {
      name: "AuthError",
      message: "Invalid credentials",
      status: 400,
      code: "invalid_credentials",
      _isAuthError: true,
    } as AuthError;

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { session: null },
      error: authError,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    try {
      await act(async () => {
        await result.current.signIn("wrong@example.com", "wrongpass");
      });
    } catch (error) {
      expect((error as AuthError).message).toBe("Invalid credentials");
    }

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBeFalsy();
      expect(result.current.user).toBeNull();
    });
  });

  test("handles successful sign up", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp("new@example.com", "password123");
    });

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password123",
        options: expect.any(Object),
      });
    });
  });

  test("handles sign out", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signOut();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBeFalsy();
      expect(result.current.user).toBeNull();
    });
  });

  test("handles auth state change", async () => {
    // 1. Mock Session definieren
    const mockUser = {
      id: "ed28ed71-eee5-4029-a971-2197bdd3cbfd",
      email: "sascha.kohler@sent.at",
      aud: "authenticated",
      created_at: "2024-10-18T15:10:17.134677Z",
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
      user_metadata: {
        email: "sascha.kohler@sent.at",
        email_verified: true,
      },
      role: "authenticated",
      updated_at: "2024-10-18T15:10:17.134677Z",
    };

    const mockSession = {
      access_token: "eyJhbGci...",
      expires_at: 1739218588,
      expires_in: 3600,
      refresh_token: "kFxwW3KIBzJ4lMwXMWhXw",
      token_type: "bearer",
      user: mockUser,
    };

    // 2. Mock Setup VOR dem Rendern
    let authChangeCallback: any = null;
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(
      (callback) => {
        console.log("Setting auth change callback"); // Debug
        authChangeCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      },
    );

    // 3. Hook rendern
    const { result } = renderHook(() => useAuth(), { wrapper });

    // 4. Warten bis der Callback gesetzt ist
    await waitFor(() => {
      expect(authChangeCallback).toBeDefined();
    });

    // 5. State Change auslösen
    await act(async () => {
      console.log("Auth callback exists:", !!authChangeCallback); // Debug
      expect(authChangeCallback).toBeDefined();
      await authChangeCallback("SIGNED_IN", mockSession);
    });

    // 6. Auf State-Updates warten
    await waitFor(
      () => {
        expect(result.current.isAuthenticated).toBeTruthy();
        expect(result.current.user?.email).toBe("sascha.kohler@sent.at");
      },
      { timeout: 2000 },
    );
  });

  test("persists auth state in localStorage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn("sascha.kohler@sent.at", "password123");
    });

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "auth",
        expect.stringContaining("sascha.kohler@sent.at"),
      );
    });
  });

  test("persists auth state in context and localStorage", async () => {
    // Test durchführen
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn("sascha.kohler@sent.at", "password");
    });

    await waitFor(
      () => {
        const storedAuth = JSON.parse(
          localStorage.getItem("supabase-auth") || "{}",
        );
        expect(storedAuth).toBeTruthy();

        // Prüfe die tatsächliche Struktur
        if (storedAuth.user) {
          expect(storedAuth.user.email).toBe("sascha.kohler@sent.at");
          expect(storedAuth.user.aud).toBe("authenticated");
          expect(storedAuth.user.app_metadata.provider).toBe("email");
        }
      },
      { timeout: 2000 },
    );

    rerender();

    await waitFor(() => {
      console.log(result);
      expect(result.current.isAuthenticated).toBeTruthy();
      expect(result.current.user?.email).toBe("sascha.kohler@sent.at");
    });
  });
});
