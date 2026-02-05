<template>
  <div class="configuracoes-view">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Configurações</h1>
      <p class="text-gray-500">Gerencie as preferências do sistema</p>
    </div>

    <!-- Data Management -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Gerenciamento de Dados</h2>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 class="font-medium text-gray-700">Exportar Dados</h3>
            <p class="text-sm text-gray-500">Faça backup de todos os seus prompts e configurações</p>
          </div>
          <button @click="exportData" class="btn-secondary">
            Exportar JSON
          </button>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 class="font-medium text-gray-700">Importar Dados</h3>
            <p class="text-sm text-gray-500">Restaure dados de um backup anterior</p>
          </div>
          <label class="btn-secondary cursor-pointer">
            Importar JSON
            <input 
              type="file" 
              accept=".json"
              class="hidden"
              @change="importData"
            />
          </label>
        </div>

        <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div>
            <h3 class="font-medium text-red-700">Limpar Todos os Dados</h3>
            <p class="text-sm text-red-500">Esta ação não pode ser desfeita</p>
          </div>
          <button @click="clearAllData" class="btn bg-red-500 text-white hover:bg-red-600">
            Limpar Tudo
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="card mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="text-center p-4 bg-primary-50 rounded-lg">
          <div class="text-3xl font-bold text-primary-600">{{ stats.prompts }}</div>
          <div class="text-sm text-gray-600">Prompts</div>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <div class="text-3xl font-bold text-green-600">{{ stats.tags }}</div>
          <div class="text-sm text-gray-600">Tags</div>
        </div>
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <div class="text-3xl font-bold text-purple-600">{{ stats.compositions }}</div>
          <div class="text-sm text-gray-600">Composições</div>
        </div>
      </div>
    </div>

    <!-- About -->
    <div class="card">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Sobre</h2>
      <div class="text-sm text-gray-600 space-y-2">
        <p><strong>Prompt Store</strong> v1.0.0</p>
        <p>Um sistema para armazenar, organizar e compor prompts de forma visual e eficiente.</p>
        <p class="text-gray-400">Desenvolvido com Vue 3, Pinia e Tailwind CSS</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePromptStore } from '@/stores/prompts'

const store = usePromptStore()

const stats = computed(() => ({
  prompts: store.prompts.length,
  tags: store.tags.length,
  compositions: store.compositions.length
}))

function exportData() {
  const data = {
    prompts: store.prompts,
    tags: store.tags,
    compositions: store.compositions,
    exportedAt: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `prompt-store-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function importData(event) {
  const file = event.target.files[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    // Validar estrutura básica
    if (!data.prompts && !data.tags && !data.compositions) {
      throw new Error('Arquivo inválido: não contém prompts, tags ou compositions')
    }
    
    if (confirm(`Importar dados do arquivo?\n\nIsso irá substituir:\n- ${data.prompts?.length || 0} prompts\n- ${data.tags?.length || 0} tags\n- ${data.compositions?.length || 0} composições\n\nContinuar?`)) {
      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Erro na resposta do servidor')
      }
      
      const result = await response.json()
      alert(`Importação realizada com sucesso!\n\nImportados:\n- ${result.counts.prompts} prompts\n- ${result.counts.tags} tags\n- ${result.counts.compositions} composições`)
      
      // Recarregar a página para atualizar os dados
      window.location.reload()
    }
  } catch (e) {
    console.error('Erro ao importar:', e)
    alert('Erro ao importar arquivo: ' + e.message)
  }
  
  event.target.value = ''
}

async function clearAllData() {
  if (confirm('Tem certeza? Todos os prompts, tags e composições serão excluídos permanentemente.')) {
    if (confirm('Esta ação NÃO pode ser desfeita. Deseja realmente continuar?')) {
      try {
        const response = await fetch('/api/clear', {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Erro na resposta do servidor')
        }
        
        alert('Dados limpos com sucesso!')
        window.location.reload()
      } catch (e) {
        console.error('Erro ao limpar dados:', e)
        alert('Erro ao limpar dados: ' + e.message)
      }
    }
  }
}
</script>
