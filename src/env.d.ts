/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly DATABASE_URL: string
  readonly NOTION_ACCESS_TOKEN: string
  readonly ADMIN_EMAIL: string
  readonly ADMIN_PASSWORD: string

  readonly R2_ENDPOINT: string
  readonly R2_BUCKET_NAME: string
  readonly R2_ACCESS_KEY_ID: string
  readonly R2_SECRET_ACCESS_KEY: string
  readonly R2_PUBLIC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
