// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/html-validator',
    '@nuxt/scripts',
    '@nuxt/fonts',
    '@nuxt/image',
    'nuxt-og-image',
    'nuxt-time',
    '@nuxt/test-utils/module',
    '@unocss/nuxt',
  ],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
    },
  },
  css: ['@unocss/reset/tailwind-compat.css'],
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    typedPages: true,
  },
  compatibilityDate: '2024-04-03',
  directus: {
    url: 'https://nuxtpressus.directus.app',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  // Ensure that any HTML validation errors are treated as build errors
  htmlValidator: {
    failOnError: true,
  },
  unocss: {
    theme: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
    typography: true,
  },
})
