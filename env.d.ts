/// <reference types="vite/client" />
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_BASE_API: string;
  readonly VITE_SOCKET_BASE_API: string;
}
