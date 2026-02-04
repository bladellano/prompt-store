import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storageService } from '@/services/storage'

export const usePromptStore = defineStore('prompts', () => {
  // State
  const prompts = ref([])
  const tags = ref([])
  const compositions = ref([])
  const composerBlocks = ref([])
  const interpolationTokens = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedTags = ref([])

  // Getters
  const filteredPrompts = computed(() => {
    let result = prompts.value

    // Filtrar por tags
    if (selectedTags.value.length > 0) {
      result = result.filter(prompt => 
        prompt.tags?.some(tag => selectedTags.value.includes(tag))
      )
    }

    // Filtrar por texto
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(prompt =>
        prompt.content.toLowerCase().includes(query) ||
        prompt.title?.toLowerCase().includes(query)
      )
    }

    return result
  })

  const composedText = computed(() => {
    return composerBlocks.value
      .map(block => block.content)
      .join('\n\n')
  })

  const interpolatedText = computed(() => {
    let text = composedText.value
    
    for (const [token, value] of Object.entries(interpolationTokens.value)) {
      const regex = new RegExp(escapeRegex(token), 'g')
      text = text.replace(regex, value)
    }
    
    return text
  })

  const detectedTokens = computed(() => {
    const tokenPattern = /\[\[([A-Z0-9_]+)\]\]/g
    const tokens = new Set()
    let match

    while ((match = tokenPattern.exec(composedText.value)) !== null) {
      tokens.add(match[0])
    }

    return Array.from(tokens)
  })

  // Actions
  async function loadPrompts() {
    isLoading.value = true
    error.value = null
    try {
      prompts.value = await storageService.getPrompts()
    } catch (e) {
      error.value = 'Erro ao carregar prompts'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  async function loadTags() {
    try {
      tags.value = await storageService.getTags()
    } catch (e) {
      console.error('Erro ao carregar tags:', e)
    }
  }

  async function loadCompositions() {
    try {
      compositions.value = await storageService.getCompositions()
    } catch (e) {
      console.error('Erro ao carregar composições:', e)
    }
  }

  async function addPrompt(promptData) {
    try {
      const newPrompt = await storageService.savePrompt(promptData)
      prompts.value.push(newPrompt)
      return newPrompt
    } catch (e) {
      error.value = 'Erro ao adicionar prompt'
      throw e
    }
  }

  async function updatePrompt(id, promptData) {
    try {
      const updated = await storageService.updatePrompt(id, promptData)
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = updated
      }
      // Atualizar também no composer se existir
      const composerIndex = composerBlocks.value.findIndex(b => b.id === id)
      if (composerIndex !== -1) {
        composerBlocks.value[composerIndex] = { ...composerBlocks.value[composerIndex], ...updated }
      }
      return updated
    } catch (e) {
      error.value = 'Erro ao atualizar prompt'
      throw e
    }
  }

  async function deletePrompt(id) {
    try {
      await storageService.deletePrompt(id)
      prompts.value = prompts.value.filter(p => p.id !== id)
      composerBlocks.value = composerBlocks.value.filter(b => b.id !== id)
    } catch (e) {
      error.value = 'Erro ao excluir prompt'
      throw e
    }
  }

  async function addTag(tagData) {
    try {
      const newTag = await storageService.saveTag(tagData)
      tags.value.push(newTag)
      return newTag
    } catch (e) {
      error.value = 'Erro ao adicionar tag'
      throw e
    }
  }

  async function deleteTag(id) {
    try {
      await storageService.deleteTag(id)
      tags.value = tags.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = 'Erro ao excluir tag'
      throw e
    }
  }

  function addToComposer(prompt) {
    // Criar uma cópia com ID único para o composer
    const composerBlock = {
      ...prompt,
      composerId: `${prompt.id}-${Date.now()}`
    }
    composerBlocks.value.push(composerBlock)
  }

  function removeFromComposer(composerId) {
    composerBlocks.value = composerBlocks.value.filter(
      b => b.composerId !== composerId
    )
  }

  function reorderComposer(newOrder) {
    composerBlocks.value = newOrder
  }

  function clearComposer() {
    composerBlocks.value = []
    interpolationTokens.value = {}
  }

  function setInterpolationToken(token, value) {
    interpolationTokens.value[token] = value
  }

  function setInterpolationTokens(tokens) {
    try {
      interpolationTokens.value = typeof tokens === 'string' 
        ? JSON.parse(tokens) 
        : tokens
    } catch (e) {
      console.error('Erro ao parsear tokens:', e)
    }
  }

  async function saveCurrentComposition(name) {
    const composition = {
      name,
      blocks: composerBlocks.value.map(b => b.id),
      tokens: interpolationTokens.value,
      createdAt: new Date().toISOString()
    }
    
    try {
      const saved = await storageService.saveComposition(composition)
      compositions.value.push(saved)
      return saved
    } catch (e) {
      error.value = 'Erro ao salvar composição'
      throw e
    }
  }

  function loadComposition(composition) {
    composerBlocks.value = composition.blocks
      .map(id => prompts.value.find(p => p.id === id))
      .filter(Boolean)
      .map(p => ({ ...p, composerId: `${p.id}-${Date.now()}` }))
    
    interpolationTokens.value = composition.tokens || {}
  }

  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function toggleTagFilter(tagId) {
    const index = selectedTags.value.indexOf(tagId)
    if (index === -1) {
      selectedTags.value.push(tagId)
    } else {
      selectedTags.value.splice(index, 1)
    }
  }

  function clearFilters() {
    searchQuery.value = ''
    selectedTags.value = []
  }

  // Helper
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  return {
    // State
    prompts,
    tags,
    compositions,
    composerBlocks,
    interpolationTokens,
    isLoading,
    error,
    searchQuery,
    selectedTags,
    
    // Getters
    filteredPrompts,
    composedText,
    interpolatedText,
    detectedTokens,
    
    // Actions
    loadPrompts,
    loadTags,
    loadCompositions,
    addPrompt,
    updatePrompt,
    deletePrompt,
    addTag,
    deleteTag,
    addToComposer,
    removeFromComposer,
    reorderComposer,
    clearComposer,
    setInterpolationToken,
    setInterpolationTokens,
    saveCurrentComposition,
    loadComposition,
    setSearchQuery,
    toggleTagFilter,
    clearFilters
  }
})
