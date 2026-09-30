<template>
  <div class="blocos-view">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
      <div>
        <h1 class="page-heading">Blocos</h1>
        <p class="page-lead">Edite, busque e exclua prompts guardados na biblioteca.</p>
      </div>
      <button
        type="button"
        @click="openNewPromptModal"
        class="btn-primary shrink-0"
      >
        Novo bloco
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="search"
            class="input"
            placeholder="Buscar por título ou conteúdo…"
          />
        </div>
        <select v-model="sortBy" class="input w-auto">
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
          <option value="title">Por título</option>
        </select>
      </div>
    </div>

    <!-- Prompts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
      <div
        v-for="prompt in sortedPrompts"
        :key="prompt.id"
        class="card hover:ring-gray-900/10 transition-shadow cursor-pointer"
        :class="getColorBorder(prompt.color)"
        @click="openEditModal(prompt)"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-medium text-gray-800 truncate">
            {{ prompt.title || 'Sem título' }}
          </h3>
          <button
            type="button"
            @click.stop="handleDelete(prompt.id)"
            class="text-xs text-gray-500 hover:text-red-600 shrink-0"
          >
            Excluir
          </button>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
          {{ prompt.content }}
        </p>
        <div v-if="prompt.tags?.length" class="flex flex-wrap gap-1">
          <span 
            v-for="tag in prompt.tags" 
            :key="tag"
            class="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="sortedPrompts.length === 0" class="empty-state card">
      <p class="text-gray-600">Nenhum bloco encontrado.</p>
      <p class="mt-2">Crie um com <span class="font-medium text-gray-800">Novo bloco</span> ou ajuste a busca.</p>
    </div>

    <!-- Prompt Modal -->
    <PromptModal 
      :is-open="isModalOpen"
      :prompt="editingPrompt"
      @close="closeModal"
      @saved="onPromptSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePromptStore } from '@/stores/prompts'
import PromptModal from '@/components/PromptModal.vue'

const store = usePromptStore()

const isModalOpen = ref(false)
const editingPrompt = ref(null)
const searchQuery = ref('')
const sortBy = ref('newest')

const sortedPrompts = computed(() => {
  let prompts = [...store.prompts]
  
  // Filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    prompts = prompts.filter(p => 
      p.content.toLowerCase().includes(query) ||
      p.title?.toLowerCase().includes(query)
    )
  }
  
  // Sort
  switch (sortBy.value) {
    case 'newest':
      prompts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      prompts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'title':
      prompts.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      break
  }
  
  return prompts
})

function getColorBorder(color) {
  const borders = {
    yellow: 'border-l-4 border-l-yellow-400',
    green: 'border-l-4 border-l-green-400',
    blue: 'border-l-4 border-l-blue-400',
    purple: 'border-l-4 border-l-purple-400',
    pink: 'border-l-4 border-l-pink-400',
    orange: 'border-l-4 border-l-orange-400'
  }
  return borders[color] || borders.yellow
}

function openNewPromptModal() {
  editingPrompt.value = null
  isModalOpen.value = true
}

function openEditModal(prompt) {
  editingPrompt.value = prompt
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingPrompt.value = null
}

function onPromptSaved() {
  closeModal()
}

async function handleDelete(id) {
  if (confirm('Tem certeza que deseja excluir este prompt?')) {
    await store.deletePrompt(id)
  }
}
</script>

