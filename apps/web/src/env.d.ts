/// <reference path="../.astro/types.d.ts" />

import type { BasePayload } from 'payload'

declare global {
  namespace App {
    interface Locals extends Record<string, unknown> {
      payload: BasePayload
    }
  }
}

// type ImportMetaEnv = {}

// interface ImportMeta {
//   readonly env: ImportMetaEnv
// }
