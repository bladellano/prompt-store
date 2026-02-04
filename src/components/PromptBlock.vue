<template>
  <div 
    class="prompt-block relative group animate-fade-in"
    :class="[colorClass, { 'opacity-50': isDragging }]"
    :draggable="!isEditing"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- Actions -->
    <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        @click="$emit('edit', prompt)"
        class="text-xs text-gray-500 hover:text-primary-600"
      >
        Editar
      </button>
      <span class="text-gray-300">|</span>
      <button 
        @click="$emit('delete', prompt.id)"
        class="text-xs text-gray-500 hover:text-red-600"
      >
        Excluir
      </button>
    </div>

    <!-- Content -->
    <div class="pr-16">
      <p class="text-sm text-gray-700 line-clamp-3">
        {{ truncatedContent }}
      </p>
    </div>

    <!-- Tags -->
    <div v-if="prompt.tags?.length" class="mt-3 flex flex-wrap gap-1">
      <span 
        v-for="tag in prompt.tags" 
        :key="tag"
        class="text-xs px-2 py-0.5 bg-white/50 rounded text-gray-600"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Drag Indicator -->
    <div class="absolute bottom-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  prompt: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'dragstart', 'dragend'])

const isDragging = ref(false)

const colorClass = computed(() => {
  const colors = {
    yellow: 'bg-prompt-yellow border-yellow-300',
    green: 'bg-prompt-green border-green-300',
    blue: 'bg-prompt-blue border-blue-300',
    purple: 'bg-prompt-purple border-purple-300',
    pink: 'bg-prompt-pink border-pink-300',
    orange: 'bg-prompt-orange border-orange-300'
  }
  return colors[props.prompt.color] || colors.yellow
})

const truncatedContent = computed(() => {
  const maxLength = 150
  if (props.prompt.content.length <= maxLength) return props.prompt.content
  return props.prompt.content.slice(0, maxLength) + '...'
})

function onDragStart(event) {
  isDragging.value = true
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('application/json', JSON.stringify(props.prompt))
  emit('dragstart', props.prompt)
}

function onDragEnd() {
  isDragging.value = false
  emit('dragend')
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
