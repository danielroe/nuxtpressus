<script setup lang="ts">
import { createItem } from '@directus/sdk'
import type { BlockForm, Form, FormField } from '#build/directus-types'

const props = defineProps<Omit<BlockForm, 'form'> & {
  fields: FormField[]
  form: {
    submit_label?: Form['submit_label'] | null
    success_message?: Form['success_message'] | null
    success_redirect_url?: Form['success_redirect_url'] | null
    id?: Form['id'] | null
  }
}>()

const directus = useDirectus()
const router = useRouter()

const submissionState = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
async function handleSubmit(event: Event) {
  const form = event.target as HTMLFormElement
  const data = new FormData(form)
  const entries = [...data.entries()]

  submissionState.value = 'loading'

  try {
    await directus.request(createItem('form_submissions', {
      form: props.form.id,
      // @ts-expect-error id is not actually required
      values: entries.map(([id, value]) => ({
        field: id as string,
        value: value as string,
      })),
    }))
    submissionState.value = 'success'

    if (props.form.success_redirect_url) {
      const url = new URL(props.form.success_redirect_url, window.location.origin)
      if (url.host === window.location.host) {
        router.push(url.pathname)
      }
      else {
        window.location.href = props.form.success_redirect_url
      }
    }

    form.reset()
  }
  catch (error) {
    submissionState.value = 'error'
    console.error(error)
  }
}
</script>

<template>
  <form
    class="flex flex-col gap-2"
    @submit.prevent="handleSubmit"
  >
    <header class="text-2xl font-bold">
      {{ title }}
    </header>
    <p class="text-xl font-light">
      {{ headline }}
    </p>
    <div class="grid grid-cols-6 gap-8">
      <component
        :is="field.label ? 'label' : 'div'"
        v-for="field in fields"
        :key="field.id"
        class="flex flex-col gap-2"
        :class="{
          'col-span-2': field.width === '33',
          'col-span-3': field.width === '50',
          'col-span-4': field.width === '67',
          'col-span-6': field.width === '100',
        }"
      >
        <span
          v-if="field.label"
          class="text-xs uppercase"
        >
          {{ field.label }}
        </span>
        <input
          v-if="field.type === 'text'"
          type="text"
          :name="field.id"
          :placeholder="field.placeholder || ''"
          class="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
        <select
          v-else-if="field.type === 'select'"
          :name="field.id"
          class="p-1 border-1 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option
            v-for="option in field.choices"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
        <textarea
          v-else-if="field.type === 'textarea'"
          class="min-h-36 flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          :name="field.id"
          :placeholder="field.placeholder || ''"
        />
      </component>
      <span
        v-if="submissionState === 'success'"
        class="col-span-6"
      >
        {{ form.success_message || 'Form submitted successfully' }}
      </span>
      <span
        v-else-if="submissionState === 'error'"
        class="col-span-6"
      >
        There was an error submitting the form.
      </span>
      <button
        type="submit"
        class="col-span-6 justify-center bg-black text-white flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ form.submit_label }}
      </button>
    </div>
  </form>
</template>
