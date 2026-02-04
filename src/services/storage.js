/**
 * Camada de armazenamento desacoplada
 * Inicialmente usa JSON local via API
 * Preparada para migração futura para NoSQL
 */

const API_BASE = '/api'

class StorageService {
  async getPrompts() {
    try {
      const response = await fetch(`${API_BASE}/prompts`)
      if (!response.ok) throw new Error('Erro ao buscar prompts')
      return await response.json()
    } catch (error) {
      console.error('StorageService.getPrompts:', error)
      return []
    }
  }

  async savePrompt(prompt) {
    try {
      const response = await fetch(`${API_BASE}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      })
      if (!response.ok) throw new Error('Erro ao salvar prompt')
      return await response.json()
    } catch (error) {
      console.error('StorageService.savePrompt:', error)
      throw error
    }
  }

  async updatePrompt(id, prompt) {
    try {
      const response = await fetch(`${API_BASE}/prompts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      })
      if (!response.ok) throw new Error('Erro ao atualizar prompt')
      return await response.json()
    } catch (error) {
      console.error('StorageService.updatePrompt:', error)
      throw error
    }
  }

  async deletePrompt(id) {
    try {
      const response = await fetch(`${API_BASE}/prompts/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erro ao excluir prompt')
      return true
    } catch (error) {
      console.error('StorageService.deletePrompt:', error)
      throw error
    }
  }

  async getTags() {
    try {
      const response = await fetch(`${API_BASE}/tags`)
      if (!response.ok) throw new Error('Erro ao buscar tags')
      return await response.json()
    } catch (error) {
      console.error('StorageService.getTags:', error)
      return []
    }
  }

  async saveTag(tag) {
    try {
      const response = await fetch(`${API_BASE}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
      })
      if (!response.ok) throw new Error('Erro ao salvar tag')
      return await response.json()
    } catch (error) {
      console.error('StorageService.saveTag:', error)
      throw error
    }
  }

  async deleteTag(id) {
    try {
      const response = await fetch(`${API_BASE}/tags/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Erro ao excluir tag')
      return true
    } catch (error) {
      console.error('StorageService.deleteTag:', error)
      throw error
    }
  }

  async getCompositions() {
    try {
      const response = await fetch(`${API_BASE}/compositions`)
      if (!response.ok) throw new Error('Erro ao buscar composições')
      return await response.json()
    } catch (error) {
      console.error('StorageService.getCompositions:', error)
      return []
    }
  }

  async saveComposition(composition) {
    try {
      const response = await fetch(`${API_BASE}/compositions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(composition)
      })
      if (!response.ok) throw new Error('Erro ao salvar composição')
      return await response.json()
    } catch (error) {
      console.error('StorageService.saveComposition:', error)
      throw error
    }
  }
}

export const storageService = new StorageService()
