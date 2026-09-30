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
      <p class="text-sm text-gray-800 leading-relaxed line-clamp-3">
        {{ truncatedContent }}
      </p>
    </div>

    <!-- Tags -->
    <div v-if="prompt.tags?.length" class="mt-3 flex flex-wrap gap-1">
      <span 
        v-for="tag in prompt.tags" 
        :key="tag"
        class="text-xs px-2 py-0.5 bg-white/60 ring-1 ring-gray-900/5 rounded text-gray-600"
      >
        {{ tag }}
      </span>
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

