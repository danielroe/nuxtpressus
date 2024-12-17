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
    const types = await generateDirectusTypes({
      directusUrl: options.url,
      outputPath: 'node_modules/.tmp-directus-types',
      directusToken: process.env.DIRECTUS_TOKEN,
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
