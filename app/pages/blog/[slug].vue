<script setup lang="ts">
const { $directus, $readItems } = useNuxtApp()

const route = useRoute('blog-slug')

const { data: blog } = await useAsyncData('post', async () => {
  const posts = await $directus.request($readItems('posts', {
    filter: {
      slug: {
        _eq: route.params.slug,
      },
      status: {
        _eq: 'published',
      },
    },
    fields: [
      'image',
      {
        image: ['id', 'width', 'height', 'description'],
        author: ['first_name', 'last_name'],
      },
      'published_at',
      'description',
      'title',
      'content',
    ],
    sort: 'sort',
  }))
  return posts[0]
})

useSeoMeta({
  title: blog.value?.title,
  description: blog.value?.description,
})

const router = useRouter()
function handleLinkClicks(event: Event) {
  if (!(event.target instanceof HTMLAnchorElement)) {
    return
  }
  const url = new URL(event.target.href, window.location.origin)
  if (url.host !== window.location.host) {
    return
  }
  event.preventDefault()
  return router.push(url.pathname)
}
</script>

<template>
  <div
    v-if="blog"
    class="flex flex-col gap-6 mx-auto max-w-2xl w-full py-14 mx-auto min-h-[50vh] sm:min-h-[65vh]"
  >
    <div class="h-96 overflow-hidden">
      <NuxtImg
        v-if="blog.image"
        :src="blog.image.id"
        :width="blog.image.width || undefined"
        :height="blog.image.height || undefined"
        provider="directus"
        class="object-cover object-center-center w-full h-full"
        :alt="blog.image?.description ?? `Cover image for ${blog.title}`"
      />
    </div>
    <h1 class="text-4xl">
      {{ blog.title }}
    </h1>
    <aside
      v-if="blog.author"
      class="font-thin text-sm text-gray-800"
    >
      Written by
      {{ [blog.author.first_name, blog.author.last_name].join(' ') }}
    </aside>
    <div
      class="font-thin prose"
      @click="handleLinkClicks"
      v-html="blog.content"
    />
    <!-- TODO: comments -->
    <!-- TODO: more posts -->
  </div>
</template>
