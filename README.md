# Prompt Store

Um sistema para armazenar, organizar e compor prompts de forma visual e eficiente.

## 🚀 Tecnologias

- **Vue 3** - Framework JavaScript progressivo
- **Pinia** - Gerenciamento de estado
- **Tailwind CSS** - Framework CSS utilitário
- **Express** - Servidor Node.js
- **Vuedraggable** - Drag-and-drop para Vue

## 📋 Funcionalidades

- ✅ Biblioteca de prompts com blocos visuais coloridos
- ✅ Drag-and-drop para compor prompts
- ✅ Interpolação de tokens no formato `[[TOKEN]]`
- ✅ Preview em tempo real
- ✅ Filtros por tags e busca textual
- ✅ Persistência de dados em JSON
- ✅ Interface responsiva (mobile-friendly)

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento (frontend + backend)
npm run dev        # Inicia o Vite (porta 3000)
node server.js     # Inicia o servidor Express (porta 3001)

# Produção
npm run build      # Build do frontend
npm start          # Inicia o servidor de produção
```

## 📁 Estrutura do Projeto

```
prompt-store/
├── data/
│   └── data.json          # Persistência de dados
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── main.css       # Estilos globais + Tailwind
│   ├── components/
│   │   ├── ComposerArea.vue   # Área de composição
│   │   ├── NavBar.vue         # Navegação
│   │   ├── PreviewPanel.vue   # Preview do prompt
│   │   ├── PromptBlock.vue    # Bloco de prompt
│   │   ├── PromptLibrary.vue  # Biblioteca de prompts
│   │   ├── PromptModal.vue    # Modal de edição
│   │   └── TokenEditor.vue    # Editor de tokens
│   ├── router/
│   │   └── index.js       # Configuração de rotas
│   ├── services/
│   │   └── storage.js     # Camada de armazenamento
│   ├── stores/
│   │   └── prompts.js     # Store Pinia
│   ├── views/
│   │   ├── BlocosView.vue
│   │   ├── ConfiguracoesView.vue
│   │   ├── HomeView.vue
│   │   └── TagsView.vue
│   ├── App.vue
│   └── main.js
├── server.js              # Servidor Express
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Como Usar

1. **Criar Blocos**: Clique em "Novo Bloco" para criar um prompt
2. **Arrastar**: Arraste blocos da biblioteca para a área de composição
3. **Reordenar**: Reordene os blocos arrastando pelo ícone de grip
4. **Interpolar**: Use tokens `[[NOME]]` e preencha os valores
5. **Exportar**: Copie o prompt final para a área de transferência

## 🔧 API Endpoints

```
GET    /api/prompts         # Listar prompts
POST   /api/prompts         # Criar prompt
PUT    /api/prompts/:id     # Atualizar prompt
DELETE /api/prompts/:id     # Excluir prompt

GET    /api/tags            # Listar tags
POST   /api/tags            # Criar tag
DELETE /api/tags/:id        # Excluir tag

GET    /api/compositions    # Listar composições
POST   /api/compositions    # Salvar composição
DELETE /api/compositions/:id # Excluir composição
```

## 🚀 Deploy (Heroku)

```bash
# Login no Heroku
heroku login

# Criar app
heroku create prompt-store

# Deploy
git push heroku main
```

## 📝 Licença

MIT
