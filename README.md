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
npm install
```

## ⚠️ Desenvolvimento: dois processos obrigatórios

Em desenvolvimento, o projeto **não** funciona com um único comando. São **dois servidores** em portas diferentes:

| Processo | Comando | Porta | Função |
|----------|---------|-------|--------|
| Frontend | `npm run dev` | **3000** | Interface Vue (Vite) |
| Backend | `node server.js` | **3001** | API REST + leitura/gravação em `data/data.json` |

O Vite encaminha pedidos `/api/*` para `http://localhost:3001` (ver `vite.config.js`). O browser fala só com a porta **3000**; a API vive na **3001**.

**Passo a passo:**

```bash
# Terminal 1 — frontend
npm run dev

# Terminal 2 — backend (obrigatório para carregar prompts, tags e composições)
node server.js
```

Abra [http://localhost:3000](http://localhost:3000) depois de **ambos** estarem a correr.

### Problemas comuns

**Erro no terminal do Vite:** `[vite] http proxy error: /api/prompts` (ou `/api/tags`, `/api/compositions`) com `ECONNREFUSED`

- **Causa:** o Express na porta 3001 **não está a correr** — só iniciou `npm run dev`.
- **Solução:** noutro terminal, execute `node server.js` e recarregue a página.

**A app abre mas mostra “Nenhum prompt cadastrado ainda”**

- **Causa:** a API falhou; o cliente trata o erro e devolve listas vazias (não é necessariamente que `data/data.json` esteja vazio).
- **Solução:** confirme que `node server.js` está activo e que não há erros de proxy no terminal do Vite.

### Produção (um único processo)

Em produção não há proxy: o Express serve o build estático e a API na **mesma** porta.

```bash
npm run build
npm start          # PORT padrão 3001, ou variável PORT (ex.: Heroku)
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
