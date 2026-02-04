<template>
  <div class="token-editor card">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Partes para Interpolar</h3>
    
    <div class="space-y-4">
      <!-- Quick Token Inputs -->
      <div v-if="detectedTokens.length > 0" class="space-y-3">
        <div 
          v-for="token in detectedTokens" 
          :key="token"
          class="flex items-center gap-3"
        >
          <span class="text-sm font-mono bg-gray-100 px-2 py-1 rounded min-w-[120px]">
            {{ token }}
          </span>
          <input
            type="text"
            :value="tokens[token] || ''"
            @input="updateToken(token, $event.target.value)"
            class="input flex-1"
            :placeholder="`Valor para ${token}`"
          />
        </div>
      </div>
      
      <div v-else class="text-sm text-gray-500 italic">
        Nenhum token detectado. Use o formato [[NOME_TOKEN]] nos seus prompts.
      </div>

      <!-- JSON Editor -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Editor JSON (avançado)
        </label>
        <textarea
          v-model="jsonInput"
          @blur="applyJsonTokens"
          class="input font-mono text-sm"
          rows="4"
          placeholder='{"[[TOKEN]]": "valor"}'
        ></textarea>
        <p v-if="jsonError" class="text-red-500 text-xs mt-1">{{ jsonError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePromptStore } from '@/stores/prompts'

const store = usePromptStore()

const jsonInput = ref('')
const jsonError = ref('')

const tokens = computed(() => store.interpolationTokens)
const detectedTokens = computed(() => store.detectedTokens)

// Sincronizar JSON input com tokens
watch(tokens, (newTokens) => {
  if (Object.keys(newTokens).length > 0) {
    jsonInput.value = JSON.stringify(newTokens, null, 2)
  }
}, { deep: true })

function updateToken(token, value) {
  store.setInterpolationToken(token, value)
}

function applyJsonTokens() {
  if (!jsonInput.value.trim()) {
    jsonError.value = ''
    return
  }
  
  try {
    const parsed = JSON.parse(jsonInput.value)
    store.setInterpolationTokens(parsed)
    jsonError.value = ''
  } catch (e) {
    jsonError.value = 'JSON inválido'
  }
}
</script>
