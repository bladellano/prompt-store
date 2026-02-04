<template>
  <div class="blocos-view">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gerenciar Blocos</h1>
        <p class="text-gray-500">Visualize e gerencie todos os seus prompts</p>
      </div>
      <button 
        @click="openNewPromptModal"
        class="btn-primary flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Novo Bloco
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="input pl-10"
            placeholder="Buscar prompts..."
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="prompt in sortedPrompts"
        :key="prompt.id"
        class="card hover:shadow-md transition-shadow cursor-pointer"
        :class="getColorBorder(prompt.color)"
        @click="openEditModal(prompt)"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-medium text-gray-800 truncate">
            {{ prompt.title || 'Sem título' }}
          </h3>
          <button 
            @click.stop="handleDelete(prompt.id)"
            class="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <p class="text-sm text-gray-600 line-clamp-3 mb-3">
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

    <div 
      v-if="sortedPrompts.length === 0" 
      class="text-center py-12 text-gray-400"
    >
      <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <p class="text-lg">Nenhum bloco encontrado</p>
      <p class="text-sm mt-1">Clique em "Novo Bloco" para criar seu primeiro prompt.</p>
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

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
