<script setup lang="ts">
import type { BlockGallery } from '#build/directus-types'

defineProps<BlockGallery & { images: Array<{ id: string, width?: number, height?: number, description?: string }> }>()
</script>

<template>
  <section>
    <header class="text-2xl font-bold">
      {{ title }}
    </header>
    <p class="text-xl font-thin">
      {{ headline }}
    </p>
    <div class="py-4 grid grid-cols-3 gap-4">
      <div
        v-for="(image, i) in images"
        :key="image.id"
        class="overflow-hidden aspect-ratio-square"
      >
        <NuxtImg
          provider="directus"
          class="object-cover w-full h-full"
          :height="image.height"
          :width="image.width"
          format="webp"
          sizes="30vw md:250"
          :src="image.id"
          :alt="image.description || ''"
          :loading="i > 2 ? 'lazy' : undefined"
        />
      </div>
    </div>
  </section>
</template>
