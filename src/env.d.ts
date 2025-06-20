/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string
  readonly NOTION_WEBHOOK_TOKEN: string
  readonly NOTION_DATABASE_ID: string
  readonly NOTION_ACCESS_TOKEN: string
  readonly ADMIN_EMAIL: string
  readonly ADMIN_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
