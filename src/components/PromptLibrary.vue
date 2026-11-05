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

      <div v-if="availableTags.length" class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <div ref="tagMenuRef" class="relative">
            <button
              type="button"
              class="btn-secondary !inline-flex items-center whitespace-nowrap !py-1.5 !px-3 text-xs gap-2"
              aria-haspopup="listbox"
              :aria-expanded="isTagMenuOpen"
              @click="isTagMenuOpen = !isTagMenuOpen"
              @keydown.esc="isTagMenuOpen = false"
            >
              <span>Tags</span>
              <span
                v-if="selectedTags.length"
                class="min-w-[1.25rem] px-1.5 rounded-full bg-primary-600 text-white text-[11px] leading-5 tabular-nums"
              >
                {{ selectedTags.length }}
              </span>
              <svg
                class="w-3.5 h-3.5 text-gray-500 transition-transform duration-150"
                :class="{ 'rotate-180': isTagMenuOpen }"
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </button>

            <div
              v-if="isTagMenuOpen"
              class="absolute left-0 z-20 mt-1.5 w-64 max-w-[calc(100vw-3rem)] rounded-lg bg-white ring-1 ring-gray-900/10 shadow-lg shadow-stone-900/10 p-2"
              @keydown.esc="isTagMenuOpen = false"
            >
              <input
                v-if="availableTags.length > 8"
                v-model="tagQuery"
                type="search"
                class="input !py-1.5 text-xs mb-2"
                placeholder="Buscar tag…"
                autocomplete="off"
              />
              <ul class="max-h-60 overflow-y-auto scrollbar-thin" role="listbox" aria-multiselectable="true">
                <li v-for="tag in visibleTags" :key="tag.id">
                  <label
                    class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-gray-700 cursor-pointer hover:bg-stone-50"
                  >
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                      :checked="selectedTags.includes(tag.name)"
                      @change="toggleTagFilter(tag.name)"
                    />
                    <span class="truncate">{{ tag.name }}</span>
                  </label>
                </li>
                <li v-if="visibleTags.length === 0" class="px-2 py-3 text-xs text-gray-500">
                  Nenhuma tag encontrada.
                </li>
              </ul>
            </div>
          </div>

          <button
            v-for="name in selectedTags"
            :key="name"
            type="button"
            class="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            :aria-label="`Remover filtro ${name}`"
            @click="toggleTagFilter(name)"
          >
            {{ name }}
            <span aria-hidden="true">×</span>
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
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start items-start max-h-[min(720px,calc(100vh-280px))] overflow-y-auto scrollbar-thin pr-1">
      <PromptBlock
        v-for="prompt in filteredPrompts"
        :key="prompt.id"
        :prompt="prompt"
        @edit="$emit('edit', prompt)"
        @delete="$emit('delete', prompt.id)"
      />

      <div v-if="filteredPrompts.length === 0" class="empty-state sm:col-span-2">
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
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
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

const isTagMenuOpen = ref(false)
const tagQuery = ref('')
const tagMenuRef = ref(null)

const visibleTags = computed(() => {
  const query = tagQuery.value.trim().toLowerCase()
  if (!query) return availableTags.value
  return availableTags.value.filter(tag => tag.name.toLowerCase().includes(query))
})

function closeTagMenuOnOutsideClick(event) {
  if (isTagMenuOpen.value && tagMenuRef.value && !tagMenuRef.value.contains(event.target)) {
    isTagMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', closeTagMenuOnOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', closeTagMenuOnOutsideClick))

function toggleTagFilter(tagName) {
  store.toggleTagFilter(tagName)
}

function clearFilters() {
  store.clearFilters()
}
</script>
