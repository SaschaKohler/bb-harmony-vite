// src/config/index.ts

/**
 * Umgebungs-Konfigurationstypen
 */
interface EnvironmentConfig {
  apiUrl: string;
  apiVersion: string;
  apiTimeout: number;
  mockApi: boolean;
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  claude: {
    apiKey: string;
    useMockApi: boolean;
  };
  features: {
    enableAnalytics: boolean;
    debugMode: boolean;
    consoleLogging: boolean;
  };
}

/**
 * Development-spezifische Konfiguration
 */
const developmentConfig: EnvironmentConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  apiVersion: import.meta.env.VITE_API_VERSION || "v1",
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
  mockApi: true,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  },
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    useMockApi: import.meta.env.VITE_USE_MOCK_API === "true",
  },
  features: {
    enableAnalytics: false,
    debugMode: true,
    consoleLogging: true,
  },
};

/**
 * Production-spezifische Konfiguration
 */
const productionConfig: EnvironmentConfig = {
  apiUrl: import.meta.env.VITE_API_URL,
  apiVersion: import.meta.env.VITE_API_VERSION,
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 3000,
  mockApi: false,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  claude: {
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
    useMockApi: false,
  },
  features: {
    enableAnalytics: true,
    debugMode: false,
    consoleLogging: false,
  },
};

/**
 * Staging-spezifische Konfiguration
 */
const stagingConfig: EnvironmentConfig = {
  ...productionConfig,
  features: {
    enableAnalytics: false,
    debugMode: true,
    consoleLogging: true,
  },
};

/**
 * Entwicklungs-Hilfsfunktionen
 */
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const isStaging = import.meta.env.MODE === "staging";

/**
 * Logger für Development
 */
export const devLog = (...args: any[]) => {
  if (config.features.consoleLogging) {
    console.log(...args);
  }
};

/**
 * Umgebungsabhängige Konfiguration auswählen
 */
export const config: EnvironmentConfig = (() => {
  if (isProduction) return productionConfig;
  if (isStaging) return stagingConfig;
  return developmentConfig;
})();

/**
 * Debug-Utility
 */
export const debug = {
  log: (...args: any[]) => {
    if (config.features.debugMode) {
      console.log("[Debug]:", ...args);
    }
  },
  error: (...args: any[]) => {
    if (config.features.debugMode) {
      console.error("[Debug Error]:", ...args);
    }
  },
  warn: (...args: any[]) => {
    if (config.features.debugMode) {
      console.warn("[Debug Warning]:", ...args);
    }
  },
};

// Exportiere einen Typ-Helper für Komponenten
export type ConfigFeatures = typeof config.features;
