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

    <div
      v-if="createdAtLabel || prompt.tags?.length"
      class="mt-3 flex items-end justify-between gap-2"
    >
      <div v-if="prompt.tags?.length" class="flex flex-wrap gap-1 min-w-0 flex-1">
        <span
          v-for="tag in prompt.tags"
          :key="tag"
          class="text-xs px-2 py-0.5 bg-white/60 ring-1 ring-gray-900/5 rounded text-gray-600"
        >
          {{ tag }}
        </span>
      </div>
      <time
        v-if="createdAtLabel"
        :datetime="createdAtIso"
        class="text-[11px] tabular-nums text-gray-500 shrink-0 ml-auto"
        :title="createdAtTitle"
      >
        {{ createdAtLabel }}
      </time>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { promptBlockColorClass } from '@/constants/promptColors'

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

const colorClass = computed(() => promptBlockColorClass(props.prompt.color))

const truncatedContent = computed(() => {
  const maxLength = 150
  if (props.prompt.content.length <= maxLength) return props.prompt.content
  return props.prompt.content.slice(0, maxLength) + '...'
})

const createdAtIso = computed(() => props.prompt.createdAt || props.prompt.updatedAt || '')

const createdAtLabel = computed(() => {
  if (!createdAtIso.value) return null
  const date = new Date(createdAtIso.value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
})

const createdAtTitle = computed(() => {
  if (!createdAtIso.value) return ''
  const date = new Date(createdAtIso.value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(date)
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

