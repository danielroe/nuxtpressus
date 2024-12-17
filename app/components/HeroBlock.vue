<script setup lang="ts">
import type { BlockHero } from '#build/directus-types'

defineProps<BlockHero>()
</script>

<template>
  <section class="min-h-48 py-6">
    <header class="text-4xl font-bold">
      {{ title }}
    </header>
    <p class="text-2xl font-thin">
      {{ headline }}
    </p>
    <div
      class="prose"
      v-html="description"
    />
  </section>
</template>
