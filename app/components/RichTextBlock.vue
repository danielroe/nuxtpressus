<script setup lang="ts">
import type { BlockRichtext } from '#build/directus-types'

defineProps<BlockRichtext>()
</script>

<template>
  <section>
    <header
      v-if="headline"
      class="text-2xl font-medium"
    >
      {{ headline }}
    </header>
    <div
      v-if="content"
      class="prose"
      v-html="content"
    />
  </section>
</template>
