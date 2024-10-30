import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { LoginForm } from "./LoginForm";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { RegistrationForm } from "./RegistrationForm";
import UnifiedAuthPage from "./UnifiedAuthPage";
import { toast } from "sonner";

// Mocks
vi.mock("@/contexts/AuthContext", async () => {
  const actual = await vi.importActual("@/contexts/AuthContext");
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe("LoginForm", () => {
  const mockSignIn = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      signIn: mockSignIn,
      isLoading: false,
    } as any);
  });

  test("renders login form with all elements", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UnifiedAuthPage />
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(
      screen.getByRole("heading", { name: /bachblüten admin/i }),
    ).toBeInTheDocument();
    // Angepasste Selektoren für deine spezifische Implementierung
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument(); // Geändert von /email/i zu /e-mail/i
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument(); // Angenommen, du verwendest deutsche Labels
    expect(
      screen.getByRole("button", { name: /anmelden/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/oder fortfahren mit/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });

  test("handles validation errors correctly", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UnifiedAuthPage />
        </AuthProvider>
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole("button", { name: /anmelden/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Ungültige E-Mail-Adresse/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Passwort muss mindestens 6 Zeichen lang sein/i),
      ).toBeInTheDocument();
    });
  });

  test("handles successful login", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <UnifiedAuthPage />
        </AuthProvider>
      </BrowserRouter>,
    );

    // Form ausfüllen
    await userEvent.type(screen.getByLabelText(/e-mail/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/passwort/i), "password123");

    // Submit Form
    await userEvent.click(screen.getByRole("button", { name: /anmelden/i }));

    expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123");
  });
});

// src/components/auth/RegistrationForm.test.tsx
describe("RegistrationForm", () => {
  const mockSignUp = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      signUp: mockSignUp,
    } as any);
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );

  const renderUnifiedAuthPage = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <UnifiedAuthPage />
        </AuthProvider>
      </BrowserRouter>,
    );
  };

  const renderRegistrationForm = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <RegistrationForm onSuccess={mockOnSuccess} />
        </AuthProvider>
      </BrowserRouter>,
    );
  };

  test("renders registration form with all elements", async () => {
    renderUnifiedAuthPage();
    const registerTab = screen.getByRole("tab", { name: /registrieren/i });
    await userEvent.click(registerTab);

    // 3. Prüfe ob die Form-Elemente vorhanden sind
    const emailLabel = screen.getByText("E-Mail");
    expect(emailLabel).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "E-Mail" })).toBeInTheDocument();

    const passwordLabel = screen.getByText("Passwort");
    expect(passwordLabel).toBeInTheDocument();
    expect(screen.getByLabelText("Passwort")).toBeInTheDocument();

    const confirmPasswordLabel = screen.getByText("Passwort bestätigen");
    expect(confirmPasswordLabel).toBeInTheDocument();
    expect(screen.getByLabelText("Passwort bestätigen")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrieren/i }),
    ).toBeInTheDocument();
  });

  test("validates matching passwords", async () => {
    renderUnifiedAuthPage();
    const registerTab = screen.getByRole("tab", { name: /registrieren/i });
    await userEvent.click(registerTab);

    // Unterschiedliche Passwörter eingeben
    await userEvent.type(
      screen.getByRole("textbox", { name: "E-Mail" }),
      "test@example.com",
    );
    await userEvent.type(screen.getByLabelText("Passwort"), "password123");
    await userEvent.type(
      screen.getByLabelText("Passwort bestätigen"),
      "different",
    );

    // Form absenden
    await userEvent.click(
      screen.getByRole("button", { name: /registrieren/i }),
    );

    // Prüfe Fehlermeldung
    await waitFor(() => {
      expect(
        screen.getByText(/passwörter stimmen nicht überein/i),
      ).toBeInTheDocument();
    });
  });

  test.todo("shows error toast when user already exists", async () => {
    // 1. Mock den spezifischen Fehlerfall aus dem AuthContext
    mockSignUp.mockRejectedValueOnce({
      message: "User already registered", // Exakte Nachricht die im errorMessages Objekt definiert ist
      name: "AuthError",
      status: 400,
    });
    // Test-Wrapper mit BrowserRouter
    // Wrapper beim Rendering verwenden
    render(<RegistrationForm onSuccess={mockOnSuccess} />, {
      wrapper: Wrapper,
    });
    // Form mit existierender Email ausfüllen
    await userEvent.type(
      screen.getByRole("textbox", { name: "E-Mail" }),
      "existing@example.com",
    );
    await userEvent.type(screen.getByLabelText("Passwort"), "password123");
    await userEvent.type(
      screen.getByLabelText("Passwort bestätigen"),
      "password123",
    );

    // Form absenden
    await userEvent.click(
      screen.getByRole("button", { name: /registrieren/i }),
    );

    // 4. Prüfe den exakten Error Toast aus dem AuthContext
    await waitFor(
      () => {
        expect(toast.error).toHaveBeenCalledWith(
          "Fehler beim Registrieren: Diese E-Mail-Adresse ist bereits registriert",
        );
      },
      { timeout: 5000, interval: 100 },
    );
    // Prüfen ob onSuccess NICHT aufgerufen wurde
    expect(mockOnSuccess).not.toHaveBeenCalled();

    // Prüfen ob der Button wieder aktiviert ist
    expect(
      screen.getByRole("button", { name: /registrieren/i }),
    ).not.toBeDisabled();
  });

  test("handles successful registration", async () => {
    renderRegistrationForm();
    // Form ausfüllen
    await userEvent.type(
      screen.getByRole("textbox", { name: "E-Mail" }),
      "test@example.com",
    );
    await userEvent.type(screen.getByLabelText("Passwort"), "password123");
    await userEvent.type(
      screen.getByLabelText("Passwort bestätigen"),
      "password123",
    );

    // Form absenden
    await userEvent.click(
      screen.getByRole("button", { name: /registrieren/i }),
    );

    // Prüfe ob signUp aufgerufen wurde
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test.todo("handles registration error", async () => {
    mockSignUp.mockRejectedValueOnce(new Error("Email already exists"));

    renderRegistrationForm();

    // Form ausfüllen und absenden
    await userEvent.type(
      screen.getByLabelText(/email/i),
      "existing@example.com",
    );
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      "password123",
    );
    await userEvent.click(screen.getByRole("button", { name: /register/i }));

    // Prüfe ob Fehlermeldung angezeigt wird
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  test("validates password requirements", async () => {
    renderRegistrationForm();

    // Zu kurzes Passwort eingeben
    await userEvent.type(screen.getByLabelText("Passwort"), "123");
    await userEvent.click(
      screen.getByRole("button", { name: /registrieren/i }),
    );

    // Prüfe Validierungsmeldung
    expect(
      screen.getByText(/Passwort muss mindestens 6 Zeichen lang sein/i),
    ).toBeInTheDocument();
  });
});
