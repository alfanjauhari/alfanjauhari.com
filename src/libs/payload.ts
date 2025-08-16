import config from '@payload-config'
import { getPayload as getPayloadImport } from 'payload'

export async function getPayload() {
  return getPayloadImport({ config })
}
