<template>
  <div 
    class="composer-area min-h-[300px] border-2 border-dashed border-gray-300 rounded-xl p-4 transition-all duration-200"
    :class="{ 
      'border-primary-400 bg-primary-50': isDragOver,
      'bg-white': !isDragOver
    }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div v-if="blocks.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 py-12">
      <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
      </svg>
      <p class="text-center">
        Arraste blocos aqui para<br>compor seu prompt
      </p>
    </div>

    <draggable
      v-else
      v-model="blocks"
      item-key="composerId"
      handle=".drag-handle"
      animation="200"
      ghost-class="ghost-block"
      @change="onReorder"
      class="space-y-3"
    >
      <template #item="{ element }">
        <div 
          class="composer-block relative group animate-slide-in"
          :class="getColorClass(element.color)"
        >
          <!-- Drag Handle -->
          <div class="drag-handle absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="pl-8 pr-16">
            <p class="text-sm text-gray-700">{{ element.content }}</p>
          </div>

          <!-- Actions -->
          <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click="$emit('edit', element)"
              class="text-xs text-gray-500 hover:text-primary-600"
            >
              Editar
            </button>
            <span class="text-gray-300">|</span>
            <button 
              @click="removeBlock(element.composerId)"
              class="text-xs text-gray-500 hover:text-red-600"
            >
              Excluir
            </button>
          </div>

          <!-- Tags -->
          <div v-if="element.tags?.length" class="pl-8 mt-2 flex flex-wrap gap-1">
            <span 
              v-for="tag in element.tags" 
              :key="tag"
              class="text-xs px-2 py-0.5 bg-white/50 rounded text-gray-600"
            >
              {{ tag }}
            </span>
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

const emit = defineEmits(['edit'])

const isDragOver = ref(false)

const blocks = computed({
  get: () => store.composerBlocks,
  set: (value) => store.reorderComposer(value)
})

const colorClasses = {
  yellow: 'bg-prompt-yellow border-l-4 border-yellow-400',
  green: 'bg-prompt-green border-l-4 border-green-400',
  blue: 'bg-prompt-blue border-l-4 border-blue-400',
  purple: 'bg-prompt-purple border-l-4 border-purple-400',
  pink: 'bg-prompt-pink border-l-4 border-pink-400',
  orange: 'bg-prompt-orange border-l-4 border-orange-400'
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

function onReorder() {
  // O v-model já atualiza automaticamente
}
</script>

<style scoped>
.composer-block {
  @apply p-4 rounded-lg transition-all duration-200;
}

.ghost-block {
  @apply opacity-50 bg-gray-200;
}
</style>
