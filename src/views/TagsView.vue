<template>
  <div class="tags-view">
    <div class="mb-8">
      <h1 class="page-heading">Tags</h1>
      <p class="page-lead">Agrupe blocos por tema para filtrar a biblioteca com mais rapidez.</p>
    </div>

    <!-- Add New Tag -->
    <div class="card mb-6">
      <h2 class="section-heading">Nova tag</h2>
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
      <h2 class="section-heading">Tags existentes</h2>

      <div v-if="tags.length === 0" class="empty-state">
        <p>Nenhuma tag ainda. Adicione uma acima para classificar os blocos.</p>
      </div>

      <div v-else class="space-y-2">
        <div 
          v-for="tag in tags" 
          :key="tag.id"
          class="flex items-center justify-between p-3 rounded-lg ring-1 ring-gray-900/5 bg-stone-50/80 hover:bg-stone-100/80 transition-colors"
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
            type="button"
            @click="deleteTag(tag.id)"
            class="text-xs text-gray-500 hover:text-red-600"
          >
            Excluir
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
