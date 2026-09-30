<template>
  <div class="min-h-screen">
    <NavBar />
    <main class="container py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { usePromptStore } from '@/stores/prompts'
import { onMounted } from 'vue'

const store = usePromptStore()

onMounted(async () => {
  await Promise.all([
    store.loadPrompts(),
    store.loadTags(),
    store.loadCompositions()
  ])
})
</script>
