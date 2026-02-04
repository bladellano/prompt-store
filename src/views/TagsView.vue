<template>
  <div class="tags-view">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Gerenciar Tags</h1>
        <p class="text-gray-500">Organize seus prompts por categorias</p>
      </div>
    </div>

    <!-- Add New Tag -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Nova Tag</h2>
      <form @submit.prevent="addNewTag" class="flex gap-3">
        <input
          v-model="newTagName"
          type="text"
          class="input flex-1"
          placeholder="Nome da tag"
          required
        />
        <select v-model="newTagColor" class="input w-32">
          <option value="gray">Cinza</option>
          <option value="red">Vermelho</option>
          <option value="yellow">Amarelo</option>
          <option value="green">Verde</option>
          <option value="blue">Azul</option>
          <option value="purple">Roxo</option>
        </select>
        <button type="submit" class="btn-primary">
          Adicionar
        </button>
      </form>
    </div>

    <!-- Tags List -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Tags Existentes</h2>
      
      <div v-if="tags.length === 0" class="text-center py-8 text-gray-400">
        <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
        </svg>
        <p>Nenhuma tag cadastrada ainda.</p>
      </div>

      <div v-else class="space-y-2">
        <div 
          v-for="tag in tags" 
          :key="tag.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span 
              class="w-3 h-3 rounded-full"
              :class="getColorClass(tag.color)"
            ></span>
            <span class="font-medium text-gray-700">{{ tag.name }}</span>
            <span class="text-sm text-gray-400">
              ({{ getPromptCount(tag.name) }} prompts)
            </span>
          </div>
          <button 
            @click="deleteTag(tag.id)"
            class="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePromptStore } from '@/stores/prompts'

const store = usePromptStore()

const newTagName = ref('')
const newTagColor = ref('gray')

const tags = computed(() => store.tags)

function getColorClass(color) {
  const colors = {
    gray: 'bg-gray-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400'
  }
  return colors[color] || colors.gray
}

function getPromptCount(tagName) {
  return store.prompts.filter(p => p.tags?.includes(tagName)).length
}

async function addNewTag() {
  if (!newTagName.value.trim()) return
  
  await store.addTag({
    name: newTagName.value.trim().toUpperCase(),
    color: newTagColor.value
  })
  
  newTagName.value = ''
  newTagColor.value = 'gray'
}

async function deleteTag(id) {
  if (confirm('Tem certeza que deseja excluir esta tag?')) {
    await store.deleteTag(id)
  }
}
</script>
