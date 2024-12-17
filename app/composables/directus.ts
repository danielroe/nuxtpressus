import type { DirectusClient, RestClient } from '@directus/sdk'
import type { Schema } from '#build/directus-types'

let directus: DirectusClient<Schema> & RestClient<Schema>

export const useDirectus = () => {
  const config = useRuntimeConfig()
  return {
    async request(...args: Parameters<RestClient<Schema>['request']>) {
      if (!directus) {
        console.log('loading directus client')
        const { createDirectus, rest } = await import('@directus/sdk')
        directus = createDirectus<Schema>(config.public.directus.baseURL).with(rest())
      }
      return directus.request(...args)
    },
  } as Pick<DirectusClient<Schema> & RestClient<Schema>, 'request'>
}
