<script setup lang="ts">
import type { BlockRichtext } from '#build/directus-types'

defineProps<BlockRichtext>()
</script>

<template>
  <div>
    <div
      class="prose"
      v-html="content"
    />
  </div>
</template>
