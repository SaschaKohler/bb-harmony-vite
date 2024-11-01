//// <reference types="vite/client" />

/**
 * Typed environment variables for both development and production
 * Add all environment variables that your application uses here
 */
interface ImportMetaEnv {
  /**
   * The base URL of your application
   * @default "/"
   */
  readonly VITE_APP_BASE_URL: string;

  /**
   * The environment mode
   * @default "development"
   */
  readonly MODE: "development" | "production" | "staging";

  /**
   * API Configuration
   */
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_API_TIMEOUT: string;

  /**
   * Authentication Configuration
   */
  readonly VITE_AUTH_DOMAIN: string;
  readonly VITE_AUTH_CLIENT_ID: string;
  readonly VITE_AUTH_AUDIENCE: string;

  /**
   * Supabase Configuration
   */
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY?: string;

  /**
   * Claude AI Configuration
   */
  readonly VITE_CLAUDE_API_KEY: string;
  readonly VITE_USE_MOCK_API: string;

  /**
   * Feature Flags
   */
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_FEATURE_X: string;

  /**
   * Error Reporting
   */
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_ERROR_REPORTING_LEVEL: "error" | "warning" | "info" | "debug";

  /**
   * Development-only flags
   * These should only be available in development mode
   */
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

/**
 * Extend the import.meta interface
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Type declarations for global development variables
 * Do not add production variables here
 */
declare interface Window {
  // Add any global window properties used in development
  __DEVELOPMENT__?: boolean;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
}

/**
 * Type declarations for static assets
 */
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const content: string;
  export default content;
}

/**
 * Utility type for environment variables
 */
type EnvValue = string | number | boolean;

/**
 * Helper type for environment configuration
 */
type EnvConfig = {
  required: boolean;
  type: "string" | "number" | "boolean";
  default?: EnvValue;
};

/**
 * Environment validation helper
 */
type ValidateEnv<T extends Record<string, EnvConfig>> = {
  [K in keyof T]: T[K]["type"] extends "string"
    ? string
    : T[K]["type"] extends "number"
      ? number
      : boolean;
}; // <reference types="vite/client" />
