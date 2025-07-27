import { defineMiddleware } from 'astro:middleware'
import config from '@payload-config'
import { getPayload } from 'payload'

export const onRequest = defineMiddleware(async (context, next) => {
  const payload = await getPayload({
    config,
  })

  context.locals.payload = payload

  return await next()
})
