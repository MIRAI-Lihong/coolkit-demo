/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EWELINK_APP_ID: string;
  readonly VITE_EWELINK_APP_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
