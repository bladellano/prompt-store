<template>
  <div
    class="composer-dropzone"
    :class="{ 'composer-dropzone-active': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div v-if="blocks.length === 0" class="empty-state min-h-[240px] flex flex-col justify-center">
      <p class="text-gray-600">Solte blocos aqui</p>
      <p class="mt-1 text-gray-500 max-w-xs mx-auto">
        Arraste da biblioteca ou reordene os blocos pela barra à esquerda.
      </p>
    </div>

    <draggable
      v-else
      v-model="blocks"
      item-key="composerId"
      handle=".drag-handle"
      animation="200"
      ghost-class="ghost-block"
      class="space-y-3"
    >
      <template #item="{ element }">
        <div
          class="composer-block relative group"
          :class="getColorClass(element.color)"
        >
          <div class="flex gap-2">
            <div class="drag-handle" aria-hidden="true">
              <span class="drag-handle-bar"></span>
              <span class="drag-handle-bar"></span>
              <span class="drag-handle-bar"></span>
            </div>

            <div class="flex-1 min-w-0 pr-20">
              <p class="text-sm text-gray-800 leading-relaxed">{{ element.content }}</p>
              <div v-if="element.tags?.length" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="tag in element.tags"
                  :key="tag"
                  class="text-xs px-2 py-0.5 bg-white/60 ring-1 ring-gray-900/5 rounded text-gray-600"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              @click="$emit('edit', element)"
              class="text-xs text-gray-600 hover:text-primary-700"
            >
              Editar
            </button>
            <button
              type="button"
              @click="removeBlock(element.composerId)"
              class="text-xs text-gray-600 hover:text-red-600"
            >
              Remover
            </button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePromptStore } from '@/stores/prompts'
import draggable from 'vuedraggable'

const store = usePromptStore()

defineEmits(['edit'])

const isDragOver = ref(false)

const blocks = computed({
  get: () => store.composerBlocks,
  set: (value) => store.reorderComposer(value)
})

const colorClasses = {
  yellow: 'bg-prompt-yellow border-l-[3px] border-yellow-400/90',
  green: 'bg-prompt-green border-l-[3px] border-green-400/90',
  blue: 'bg-prompt-blue border-l-[3px] border-blue-400/90',
  purple: 'bg-prompt-purple border-l-[3px] border-purple-400/90',
  pink: 'bg-prompt-pink border-l-[3px] border-pink-400/90',
  orange: 'bg-prompt-orange border-l-[3px] border-orange-400/90'
}

function getColorClass(color) {
  return colorClasses[color] || colorClasses.yellow
}

function onDragOver(event) {
  isDragOver.value = true
  event.dataTransfer.dropEffect = 'copy'
}

function onDragLeave() {
  isDragOver.value = false
}

function onDrop(event) {
  isDragOver.value = false

  try {
    const data = event.dataTransfer.getData('application/json')
    if (data) {
      const prompt = JSON.parse(data)
      store.addToComposer(prompt)
    }
  } catch (e) {
    console.error('Erro ao processar drop:', e)
  }
}

function removeBlock(composerId) {
  store.removeFromComposer(composerId)
}
</script>

<style scoped>
.composer-block {
  @apply p-3 rounded-lg transition-shadow duration-150 hover:shadow-sm;
}

.ghost-block {
  @apply opacity-40 ring-2 ring-primary-300;
}
</style>
