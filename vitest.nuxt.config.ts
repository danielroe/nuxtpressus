import { defineVitestConfig } from '@nuxt/test-utils/config'

import dotenv from 'dotenv'

dotenv.config()

export default defineVitestConfig({
  test: {
    dir: './test/nuxt',
    environment: 'nuxt',
  },
})
