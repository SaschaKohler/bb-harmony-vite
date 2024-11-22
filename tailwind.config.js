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
        // Neue Learning Hub spezifische Farben
        "learning-dark": {
          background: "#1a1c2a", // Dunkleres, wärmeres Blau
          foreground: "#e2e8f0",
          muted: "#2d3748",
          "muted-foreground": "#a0aec0",
          accent: "#3d4b6e", // Gedämpftes Blau für Akzente
          border: "#2d3748",
          card: "#242736", // Leicht hellerer Hintergrund für Karten
          "card-foreground": "#e2e8f0",
          progress: "#4c51bf", // Violett für Fortschrittsanzeigen
          hover: "#2d324d", // Hover-Effekt Farbe
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
