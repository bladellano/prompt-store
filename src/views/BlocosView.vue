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

    <div class="card mb-6">
      <h2 class="section-heading">Cor em massa</h2>
      <p class="text-sm text-gray-600 mb-4 max-w-2xl">
        Aplica a mesma cor a todos os blocos da biblioteca. Depois, edite blocos individuais para marcar os mais importantes.
      </p>
      <div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4">
        <div class="flex flex-wrap gap-2" role="group" aria-label="Cor para aplicar em massa">
          <button
            v-for="color in promptColors"
            :key="color.value"
            type="button"
            @click="bulkColor = color.value"
            class="w-9 h-9 rounded-lg transition-shadow"
            :class="[
              color.swatch,
              bulkColor === color.value
                ? 'ring-2 ring-gray-800 ring-offset-2'
                : 'ring-1 ring-gray-900/10 hover:ring-gray-400'
            ]"
            :title="color.name"
            :aria-pressed="bulkColor === color.value"
          />
        </div>
        <button
          type="button"
          class="btn-primary sm:ml-auto"
          :disabled="isApplyingBulkColor || totalPrompts === 0"
          @click="applyBulkColor"
        >
          {{ isApplyingBulkColor ? 'Aplicando…' : `Aplicar ${promptColorName(bulkColor)} a todos (${totalPrompts})` }}
        </button>
      </div>
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
        :class="promptCardBorderClass(prompt.color)"
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
import {
  PROMPT_COLORS,
  promptCardBorderClass,
  promptColorName
} from '@/constants/promptColors'

const store = usePromptStore()

const promptColors = PROMPT_COLORS

const isModalOpen = ref(false)
const editingPrompt = ref(null)
const searchQuery = ref('')
const sortBy = ref('newest')
const bulkColor = ref('gray')
const isApplyingBulkColor = ref(false)

const totalPrompts = computed(() => store.prompts.length)

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

async function applyBulkColor() {
  if (totalPrompts.value === 0) return

  const label = promptColorName(bulkColor.value)
  const message = `Aplicar a cor ${label} a todos os ${totalPrompts.value} blocos?\n\nBlocos no compositor também serão atualizados.`
  if (!confirm(message)) return

  isApplyingBulkColor.value = true
  try {
    await store.setColorForAllPrompts(bulkColor.value)
  } catch {
    alert('Não foi possível aplicar a cor. Verifique se o servidor está em execução.')
  } finally {
    isApplyingBulkColor.value = false
  }
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

