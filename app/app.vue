<script setup lang="ts">
import { readItems, readSingleton } from '@directus/sdk'

defineOgImage()
const directus = useDirectus()

const [{ data: settings }, { data: navItems }] = await Promise.all([
  useAsyncData(() => directus.request(readSingleton('globals', {
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
  }))),
  useAsyncData('navigation', async () => {
    const navs = directus.request(readItems('navigation', {
      fields: ['id', 'title', 'is_active', { items: ['title', { page: ['permalink'] }] }],
    }))
    return navs
  }),
])

const siteTitle = computed(() => settings.value?.title ?? 'NuxtPressus')
useSeoMeta({
  title: () => siteTitle.value,
  titleTemplate: s => s && s !== siteTitle.value ? `${s} - ${siteTitle.value}` : (siteTitle.value),
  description: settings.value?.description ?? 'NuxtPressus is a Nuxt starter template for Directus',
})

const img = useImage()
useServerHead({
  link: settings.value?.favicon
    ? [
        {
          rel: 'icon',
          type: settings.value.favicon.type,
          href: img(settings.value.favicon.id, { width: settings.value.favicon.width!, height: settings.value.favicon.height! }, { provider: 'directus' }),
        },
      ]
    : [],
})

const footer = computed(() => navItems.value?.find(nav => nav.id === 'footer' && nav.is_active)?.items?.filter(item => item.page))

// TODO: dropdown handling (Group)
const header = computed(() => navItems.value?.find(nav => nav.id === 'main' && nav.is_active)?.items?.filter(item => item.page))
</script>

<template>
  <NuxtRouteAnnouncer />
  <div class="px-8 md:px-10 font-sans font-thin flex flex-col md:gap-14">
    <nav
      aria-label="Main navigation"
      class="pt-6 flex justify-between items-center"
    >
      <NuxtLink
        to="/"
        class="font-semibold text-xl"
      >
        <NuxtImg
          v-if="settings?.logo"
          :src="settings.logo.id"
          :width="settings.logo.width || 115"
          :height="settings.logo.height || 24"
          provider="directus"
          class="h-6"
          :alt="settings.logo?.description ?? settings.title!"
        />
        <span v-else>{{ settings?.title || 'NuxtPressus' }}</span>
      </NuxtLink>
      <ul class="font-thin text-lg">
        <li
          v-for="item in header"
          :key="item.page?.permalink"
        >
          <NuxtLink :to="item.page?.permalink">
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <NuxtPage />
    <footer class="mt-auto pt-12 pb-8 flex flex-col gap-20">
      <nav
        aria-label="Footer navigation"
        class="flex justify-between gap-2"
      >
        <NuxtLink
          to="/"
          class="font-medium text-3xl"
        >
          {{ settings?.title || 'NuxtPressus' }}
        </NuxtLink>
        <ul
          v-if="footer"
          class="text-zinc-600 font-thin columns-2"
        >
          <li
            v-for="item in footer"
            :key="item.page?.permalink"
            class="p-2"
          >
            <NuxtLink
              :to="item.page?.permalink"
              class="hover:underline"
            >
              {{ item.title }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <aside
        aria-label="Technology stack"
        class="flex justify-between gap-2 text-sm font-thin items-baseline"
      >
        <span>NuxtPressus</span>
        <span>Built with
          <NuxtLink
            class="underline hover:no-underline"
            to="https://nuxt.com"
          >
            Nuxt
          </NuxtLink>
          and
          <NuxtLink
            class="underline hover:no-underline"
            to="https://directus.io"
          >
            Directus
          </NuxtLink>
        </span>
      </aside>
    </footer>
  </div>
</template>
