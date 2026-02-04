<template>
  <div class="prompt-library">
    <!-- Header with Search and Filters -->
    <div class="mb-4 space-y-3">
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="input pl-10"
          placeholder="Filtrar por descrição..."
        />
      </div>

      <!-- Tag Filters -->
      <div class="flex flex-wrap gap-2">
        <span class="text-sm text-gray-500 self-center">Tags:</span>
        <button
          v-for="tag in availableTags"
          :key="tag.id"
          @click="toggleTagFilter(tag.name)"
          class="px-3 py-1 text-xs rounded-full transition-all"
          :class="selectedTags.includes(tag.name)
            ? 'bg-primary-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ tag.name }}
        </button>
        <button
          v-if="selectedTags.length > 0"
          @click="clearFilters"
          class="px-3 py-1 text-xs text-red-500 hover:text-red-700"
        >
          Limpar
        </button>
      </div>
    </div>

    <!-- Prompts List -->
    <div class="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin pr-2">
      <PromptBlock
        v-for="prompt in filteredPrompts"
        :key="prompt.id"
        :prompt="prompt"
        @edit="$emit('edit', prompt)"
        @delete="$emit('delete', prompt.id)"
      />

      <div 
        v-if="filteredPrompts.length === 0" 
        class="text-center py-8 text-gray-400"
      >
        <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p v-if="searchQuery || selectedTags.length > 0">
          Nenhum prompt encontrado com os filtros aplicados.
        </p>
        <p v-else>
          Nenhum prompt cadastrado ainda.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePromptStore } from '@/stores/prompts'
import PromptBlock from './PromptBlock.vue'

const emit = defineEmits(['edit', 'delete'])

const store = usePromptStore()

const searchQuery = computed({
  get: () => store.searchQuery,
  set: (value) => store.setSearchQuery(value)
})

const selectedTags = computed(() => store.selectedTags)
const availableTags = computed(() => store.tags)
const filteredPrompts = computed(() => store.filteredPrompts)

function toggleTagFilter(tagName) {
  store.toggleTagFilter(tagName)
}

function clearFilters() {
  store.clearFilters()
}
</script>
