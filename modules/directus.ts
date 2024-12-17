import process from 'node:process'
import { addTemplate, defineNuxtModule, updateRuntimeConfig } from 'nuxt/kit'
import { generateDirectusTypes } from 'directus-sdk-typegen'
import { joinURL } from 'ufo'

interface ModuleOptions {
  /**
   * The URL of the Directus instance, for example 'https://<slug>.directus.app'
   */
  url: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'directus',
    configKey: 'directus',
  },
  async setup(options, nuxt) {
    if (import.meta.test) {
      return
    }
    const types = await generateDirectusTypes({
      directusUrl: options.url,
      // @ts-expect-error https://github.com/bryantgillespie/directus-sdk-typegen/issues/3
      outputPath: false,
      directusToken: process.env.DIRECTUS_TOKEN,
    }).catch(() => {
      console.warn('Failed to generate Directus types. Make sure you set a DIRECTUS_TOKEN environment variable with administrator permissions.')
      return ''
    })

    addTemplate({
      filename: 'directus-types.d.ts',
      getContents: async () => types,
    })

    updateRuntimeConfig({
      public: {
        directus: {
          baseURL: options.url,
        },
      },
    })

    // @ts-expect-error there are required types that nuxt image will initialise for us
    nuxt.options.image ||= {}
    nuxt.options.image.directus ||= {}
    nuxt.options.image.directus.baseURL ||= joinURL(options.url, 'assets')
  },
})
