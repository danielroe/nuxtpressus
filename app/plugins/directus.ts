import { createDirectus, rest } from '@directus/sdk'
import type { Schema } from '#build/directus-types'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const directus = createDirectus<Schema>(config.public.directus.baseURL).with(rest())

  return {
    provide: { directus },
  }
})
