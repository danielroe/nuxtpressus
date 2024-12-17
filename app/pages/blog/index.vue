<script setup lang="ts">
import { readItems } from '@directus/sdk'

const directus = useDirectus()

useSeoMeta({
  title: 'Blog',
  description: 'Read the latest blog posts from our team.',
})

const { data: blogs } = await useAsyncData('posts', async () => {
  const posts = await directus.request(readItems('posts', {
    filter: {
      status: {
        _eq: 'published',
      },
    },
    fields: [
      'id',
      'sort',
      'published_at',
      'description',
      'slug',
      'title',
    ],
    sort: 'sort',
  }))
  return posts
})
</script>

<template>
  <div class="flex flex-col gap-12 lg:gap-22 max-w-2xl w-full py-14 mx-auto min-h-[50vh] sm:min-h-[65vh]">
    <h1 class="text-4xl font-light lg:text-5xl">
      Blog
    </h1>
    <article
      v-for="blog in blogs"
      :key="blog.id"
      class="flex flex-col gap-6"
      :style="{ '--id': blog.id }"
    >
      <header>
        <h2 class="text-3xl font-light">
          <NuxtLink
            class="hover:underline underline-1"
            :to="blog.slug ? { name: 'blog-slug', params: { slug: blog.slug } } : ''"
          >
            {{ blog.title }}
          </NuxtLink>
        </h2>
      </header>
      <p class="font-thin">
        {{ blog.description }}
      </p>
      <aside
        v-if="blog.published_at"
        :aria-label="`Blog article metadata for ${blog.title}`"
        class="text-sm text-gray-500"
      >
        <NuxtLink
          class="hover:underline underline-1"
          :to="blog.slug ? { name: 'blog-slug', params: { slug: blog.slug }, state: { id: blog.id } } : ''"
        >
          <NuxtTime
            :datetime="blog.published_at"
            month="long"
            day="numeric"
            year="numeric"
          />
        </NuxtLink>
      </aside>
    </article>
  </div>
</template>

<style scoped>
article h2 {
  view-transition-name: var(--id);
}
</style>
