<template>
  <div class="preview-panel card">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
    
    <div 
      v-if="previewText"
      class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-[400px] overflow-y-auto scrollbar-thin"
    >
      <span v-html="highlightedPreview"></span>
    </div>
    
    <div 
      v-else 
      class="bg-gray-50 rounded-lg p-4 text-sm text-gray-400 italic text-center"
    >
      O preview aparecerá aqui quando você adicionar blocos à área de composição.
    </div>

    <!-- Detected Tokens Info -->
    <div v-if="detectedTokens.length > 0" class="mt-4">
      <p class="text-xs text-gray-500 mb-2">
        Tokens detectados: 
        <span 
          v-for="(token, index) in detectedTokens" 
          :key="token"
          class="inline-block bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-mono ml-1"
        >
          {{ token }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePromptStore } from '@/stores/prompts'

const store = usePromptStore()

const previewText = computed(() => store.interpolatedText)
const detectedTokens = computed(() => store.detectedTokens)

const highlightedPreview = computed(() => {
  if (!previewText.value) return ''
  
  // Destacar tokens não substituídos
  let text = escapeHtml(previewText.value)
  const tokenPattern = /\[\[([A-Z0-9_]+)\]\]/g
  
  text = text.replace(tokenPattern, '<span class="bg-yellow-200 text-yellow-900 px-1 rounded font-mono">$&</span>')
  
  return text
})

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
</script>
