/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        violet: {
          50: "#f8f6fe",
          100: "#f0ebfc",
          200: "#e4daf9",
          300: "#d3c3f6",
          400: "#b79cf0",
          500: "#9a71e8",
          600: "#8657db",
          700: "#7446c4",
        },
        harmony: {
          blue: "hsl(225, 73%, 57%)", // Unsicherheit
          purple: "hsl(271, 81%, 53%)", // Angst
          yellow: "hsl(51, 100%, 50%)", // Gegenwart
          green: "hsl(147, 50%, 36%)", // Einsamkeit
          orange: "hsl(39, 100%, 50%)", // Sensibilität
          red: "hsl(348, 83%, 47%)", // Mutlosigkeit
          turquoise: "hsl(181, 71%, 56%)", // Fürsorge
        },
        // Light Mode spezifische Farben
        "learning-light": {
          background: "#f8fafc", // Sanftes, warmes Weiß
          foreground: "#334155",
          muted: "#f1f5f9",
          "muted-foreground": "#64748b",
          card: "#ffffff",
          "card-foreground": "#334155",
          accent: "#e0f2fe", // Sanftes Blau für Akzente
          "accent-foreground": "#0369a1",
          border: "rgba(226, 232, 240, 0.8)", // Softer light border
          "card-border": "rgba(226, 232, 240, 0.6)", // Even softer for cards
          progress: "#7dd3fc", // Helles, freundliches Blau
          hover: "#f1f5f9",
          // Neue Statusfarben
          success: "#86efac", // Sanftes Grün
          warning: "#fde68a", // Sanftes Gelb
          info: "#bae6fd", // Helles Blau
        },

        // Dark Mode spezifische Farben
        "learning-dark": {
          background: "#1e293b", // Warmeres Dunkelblau
          foreground: "#e2e8f0",
          muted: "#334155",
          "muted-foreground": "#94a3b8",
          card: "#243247", // Wärmerer Kartenhintergrund
          "card-foreground": "#e2e8f0",
          accent: "#2563eb", // Leuchtendes Blau
          "accent-foreground": "#e2e8f0",
          border: "rgba(51, 65, 85, 0.6)", // Softer dark border
          "card-border": "rgba(51, 65, 85, 0.4)", // Even softer for cards
          progress: "#3b82f6", // Dynamisches Blau
          hover: "#2c3c5c",
          // Neue Statusfarben
          success: "#22c55e", // Leuchtendes Grün
          warning: "#fbbf24", // Warmes Gelb
          info: "#38bdf8", // Helles Blau
        },

        // Status Farben für beide Modi
        status: {
          pending: {
            light: "#fef9c3", // Sanftes Gelb
            dark: "#854d0e", // Warmes Dunkelgelb
          },
          active: {
            light: "#dbeafe", // Sanftes Blau
            dark: "#1e40af", // Warmes Dunkelblau
          },
          completed: {
            light: "#dcfce7", // Sanftes Grün
            dark: "#166534", // Warmes Dunkelgrün
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "light-hover":
          "0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        "dark-hover":
          "0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(148, 163, 184, 0.1)",
        "card-light": "0 1px 3px rgba(0, 0, 0, 0.05)",
        "card-dark": "0 1px 3px rgba(0, 0, 0, 0.2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
