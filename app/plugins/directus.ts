import { createDirectus, rest, readItem, readItems, readSingleton } from '@directus/sdk'
import type { Schema } from '#build/directus-types'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const directus = createDirectus<Schema>(config.public.directus.baseURL).with(rest())
  const { data: settings } = await useAsyncData(() => directus.request(readSingleton('globals', {
    fields: [
      'title',
      'tagline',
      'url',
      'description',
      {
        favicon: ['id', 'type', 'description', 'width', 'height'],
        logo: ['id', 'description', 'width', 'height'],
      },
    ],
  })))

  return {
    provide: { directus, readItem, readItems, settings },
  }
})
