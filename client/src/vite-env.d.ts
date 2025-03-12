// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_API_BASE_URL: string;
    // Add any other environment variables you expect to use
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  