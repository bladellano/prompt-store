<template>
  <div class="prompt-library">
    <div class="mb-4 space-y-3">
      <input
        v-model="searchQuery"
        type="search"
        class="input"
        placeholder="Filtrar por título ou conteúdo…"
        autocomplete="off"
      />

      <div v-if="availableTags.length" class="flex flex-wrap gap-2 items-center">
        <span class="text-xs text-gray-500">Filtrar:</span>
        <button
          v-for="tag in availableTags"
          :key="tag.id"
          type="button"
          @click="toggleTagFilter(tag.name)"
          class="px-2.5 py-1 text-xs rounded-md transition-colors ring-1"
          :class="selectedTags.includes(tag.name)
            ? 'bg-primary-600 text-white ring-primary-600'
            : 'bg-white text-gray-600 ring-gray-200 hover:bg-gray-50'"
        >
          {{ tag.name }}
        </button>
        <button
          v-if="selectedTags.length > 0"
          type="button"
          @click="clearFilters"
          class="text-xs text-gray-500 hover:text-gray-800 underline-offset-2 hover:underline"
        >
          Limpar filtros
        </button>
      </div>
    </div>

    <div class="space-y-3 max-h-[min(720px,calc(100vh-280px))] overflow-y-auto scrollbar-thin pr-1">
      <PromptBlock
        v-for="prompt in filteredPrompts"
        :key="prompt.id"
        :prompt="prompt"
        @edit="$emit('edit', prompt)"
        @delete="$emit('delete', prompt.id)"
      />

      <div v-if="filteredPrompts.length === 0" class="empty-state">
        <p v-if="searchQuery || selectedTags.length > 0">
          Nenhum bloco corresponde aos filtros. Ajuste a busca ou remova tags.
        </p>
        <template v-else>
          <p class="text-gray-600">A biblioteca está vazia.</p>
          <p class="mt-2 text-gray-500">Use <span class="font-medium text-gray-700">Novo bloco</span> para criar o primeiro prompt reutilizável.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePromptStore } from '@/stores/prompts'
import PromptBlock from './PromptBlock.vue'

defineEmits(['edit', 'delete'])

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
