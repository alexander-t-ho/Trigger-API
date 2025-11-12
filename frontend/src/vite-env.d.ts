/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_POLL_INTERVAL?: string;
  readonly VITE_DEFAULT_PAGE_SIZE?: string;
  readonly VITE_ENABLE_POLLING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
