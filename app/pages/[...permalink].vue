<script setup lang="ts">
import { withLeadingSlash } from 'ufo'

const { $directus, $readItems } = useNuxtApp()

const route = useRoute('permalink')

const { data: page } = await useAsyncData('page', async () => {
  const pages = await $directus.request($readItems('pages', {
    filter: {
      permalink: {
        _eq: withLeadingSlash(route.params.permalink?.join('/')),
      },
      status: {
        _eq: 'published',
      },
    },
    fields: [
      'title',
      'description',
      'published_at',
      {
        blocks: [
          'id',
          'collection',
          {
            item: {
              block_richtext: ['id', 'content', 'headline', 'title', 'alignment'],
              block_form:
              [
                'id',
                'title',
                'headline',
                {
                  form: [
                    'submit_label',
                    'success_message',
                    'success_redirect_url',
                    'id',
                    {
                      fields: ['sort', '*'],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  }))
  return pages[0]
})

if (!page.value) {
  throw createError({
    statusCode: 404,
  })
}

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description,
})
</script>

<template>
  <div
    v-if="page"
    class="flex flex-col gap-12 lg:gap-22 mx-auto max-w-2xl w-full py-14 mx-auto min-h-[50vh] sm:min-h-[65vh]"
  >
    <h1 class="text-4xl lg:text-5xl">
      {{ page.title }}
    </h1>
    <section
      v-for="block in page.blocks"
      :key="block.id"
    >
      <RichTextBlock
        v-if="block.collection === 'block_richtext'"
        v-bind="block.item"
      />
      <FormBlock
        v-else-if="block.collection === 'block_form' && block.item.form"
        :fields="block.item.form.fields || []"
        v-bind="{
          ...block.item,
          form: block.item.form,
        }"
      />
    </section>
  </div>
</template>
