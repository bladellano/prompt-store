<template>
  <div class="home-view">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
      <div>
        <h1 class="page-heading">Compositor</h1>
        <p class="page-lead">Arraste blocos da biblioteca, preencha tokens e copie o texto final.</p>
      </div>
      <button
        type="button"
        @click="openNewPromptModal"
        class="btn-primary shrink-0"
      >
        Novo bloco
      </button>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-8">
      <!-- Left Panel - Library -->
      <div class="card">
        <h2 class="section-heading">Biblioteca</h2>
        <PromptLibrary 
          @edit="openEditModal"
          @delete="handleDelete"
        />
      </div>

      <!-- Right Panel - Composer -->
      <div class="space-y-6">
        <div class="card">
          <div class="flex items-center justify-between gap-4 mb-4 border-b border-gray-200/80 pb-2">
            <h2 class="text-base font-semibold text-gray-900">Área de composição</h2>
            <button
              v-if="hasComposerBlocks"
              type="button"
              @click="clearComposer"
              class="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Limpar
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
            type="button"
            @click="saveComposition"
            class="btn-success"
            :disabled="!hasComposerBlocks"
          >
            Guardar composição
          </button>
          <button
            type="button"
            @click="exportText"
            class="btn-primary"
            :disabled="!hasComposerBlocks"
          >
            Copiar texto
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
        class="fixed bottom-4 right-4 max-w-sm bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-lg ring-1 ring-white/10 z-50"
        role="status"
      >
        {{ toast.message }}
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
