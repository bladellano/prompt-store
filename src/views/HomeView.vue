<template>
  <div class="home-view">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Prompt Store</h1>
        <p class="text-gray-500">Componha seus prompts arrastando blocos</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="openNewPromptModal"
          class="btn-primary flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="hidden sm:inline">Novo Bloco</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Panel - Library -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          Blocos
        </h2>
        <PromptLibrary 
          @edit="openEditModal"
          @delete="handleDelete"
        />
      </div>

      <!-- Right Panel - Composer -->
      <div class="space-y-6">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
              </svg>
              Receber Blocos
            </h2>
            <button 
              v-if="hasComposerBlocks"
              @click="clearComposer"
              class="text-sm text-red-500 hover:text-red-700"
            >
              Limpar tudo
            </button>
          </div>
          <ComposerArea @edit="openEditModal" />
        </div>

        <!-- Token Editor -->
        <TokenEditor />

        <!-- Preview -->
        <PreviewPanel />

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 justify-end">
          <button 
            @click="saveComposition"
            class="btn-success flex items-center gap-2"
            :disabled="!hasComposerBlocks"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            Guardar
          </button>
          <button 
            @click="exportText"
            class="btn-primary flex items-center gap-2"
            :disabled="!hasComposerBlocks"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Exportar Texto
          </button>
        </div>
      </div>
    </div>

    <!-- Prompt Modal -->
    <PromptModal 
      :is-open="isModalOpen"
      :prompt="editingPrompt"
      @close="closeModal"
      @saved="onPromptSaved"
    />

    <!-- Toast Notification -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div 
        v-if="toast.show"
        class="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
      >
        <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePromptStore } from '@/stores/prompts'
import PromptLibrary from '@/components/PromptLibrary.vue'
import ComposerArea from '@/components/ComposerArea.vue'
import TokenEditor from '@/components/TokenEditor.vue'
import PreviewPanel from '@/components/PreviewPanel.vue'
import PromptModal from '@/components/PromptModal.vue'

const store = usePromptStore()

const isModalOpen = ref(false)
const editingPrompt = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })

const hasComposerBlocks = computed(() => store.composerBlocks.length > 0)

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
  showToast('Prompt salvo com sucesso!')
}

async function handleDelete(id) {
  if (confirm('Tem certeza que deseja excluir este prompt?')) {
    try {
      await store.deletePrompt(id)
      showToast('Prompt excluído com sucesso!')
    } catch (e) {
      showToast('Erro ao excluir prompt', 'error')
    }
  }
}

function clearComposer() {
  if (confirm('Limpar toda a área de composição?')) {
    store.clearComposer()
  }
}

async function saveComposition() {
  const name = prompt('Nome da composição:')
  if (name) {
    try {
      await store.saveCurrentComposition(name)
      showToast('Composição salva com sucesso!')
    } catch (e) {
      showToast('Erro ao salvar composição', 'error')
    }
  }
}

function exportText() {
  const text = store.interpolatedText
  
  // Copiar para clipboard
  navigator.clipboard.writeText(text).then(() => {
    showToast('Texto copiado para a área de transferência!')
  }).catch(() => {
    // Fallback: criar textarea e copiar
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showToast('Texto copiado para a área de transferência!')
  })
}

function showToast(message, type = 'success') {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>
