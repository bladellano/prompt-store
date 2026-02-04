<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        @click.self="close"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div 
            v-if="isOpen"
            class="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800">
                {{ isEditing ? 'Editar Prompt' : 'Novo Prompt' }}
              </h2>
              <button 
                @click="close"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Título (opcional)
                </label>
                <input
                  v-model="form.title"
                  type="text"
                  class="input"
                  placeholder="Nome do prompt"
                />
              </div>

              <!-- Content -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo *
                </label>
                <textarea
                  v-model="form.content"
                  class="input"
                  rows="6"
                  placeholder="Digite o conteúdo do prompt. Use [[TOKEN]] para variáveis."
                  required
                ></textarea>
              </div>

              <!-- Color -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Cor
                </label>
                <div class="flex gap-2">
                  <button
                    v-for="color in colors"
                    :key="color.value"
                    @click="form.color = color.value"
                    class="w-8 h-8 rounded-lg border-2 transition-all"
                    :class="[
                      color.class,
                      form.color === color.value 
                        ? 'border-gray-800 scale-110' 
                        : 'border-transparent hover:scale-105'
                    ]"
                    :title="color.name"
                  ></button>
                </div>
              </div>

              <!-- Tags -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <button
                    v-for="tag in availableTags"
                    :key="tag.id"
                    @click="toggleTag(tag.name)"
                    class="px-3 py-1 text-sm rounded-full transition-all"
                    :class="form.tags.includes(tag.name)
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                  >
                    {{ tag.name }}
                  </button>
                </div>
                <input
                  v-model="newTag"
                  @keydown.enter.prevent="addNewTag"
                  type="text"
                  class="input"
                  placeholder="Adicionar nova tag (Enter)"
                />
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button 
                @click="close"
                class="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                @click="save"
                class="btn-primary"
                :disabled="!form.content.trim()"
              >
                {{ isEditing ? 'Salvar' : 'Criar' }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePromptStore } from '@/stores/prompts'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  prompt: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const store = usePromptStore()

const form = ref({
  title: '',
  content: '',
  color: 'yellow',
  tags: []
})

const newTag = ref('')

const colors = [
  { value: 'yellow', name: 'Amarelo', class: 'bg-prompt-yellow' },
  { value: 'green', name: 'Verde', class: 'bg-prompt-green' },
  { value: 'blue', name: 'Azul', class: 'bg-prompt-blue' },
  { value: 'purple', name: 'Roxo', class: 'bg-prompt-purple' },
  { value: 'pink', name: 'Rosa', class: 'bg-prompt-pink' },
  { value: 'orange', name: 'Laranja', class: 'bg-prompt-orange' }
]

const availableTags = computed(() => store.tags)
const isEditing = computed(() => !!props.prompt?.id)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.prompt) {
    form.value = {
      title: props.prompt.title || '',
      content: props.prompt.content || '',
      color: props.prompt.color || 'yellow',
      tags: [...(props.prompt.tags || [])]
    }
  } else if (isOpen) {
    resetForm()
  }
})

function resetForm() {
  form.value = {
    title: '',
    content: '',
    color: 'yellow',
    tags: []
  }
  newTag.value = ''
}

function toggleTag(tagName) {
  const index = form.value.tags.indexOf(tagName)
  if (index === -1) {
    form.value.tags.push(tagName)
  } else {
    form.value.tags.splice(index, 1)
  }
}

function addNewTag() {
  const tag = newTag.value.trim().toUpperCase()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  newTag.value = ''
}

async function save() {
  if (!form.value.content.trim()) return

  try {
    if (isEditing.value) {
      await store.updatePrompt(props.prompt.id, form.value)
    } else {
      await store.addPrompt(form.value)
    }
    emit('saved')
    close()
  } catch (e) {
    console.error('Erro ao salvar prompt:', e)
  }
}

function close() {
  emit('close')
  resetForm()
}
</script>
