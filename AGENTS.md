# AGENTS.md

Instruções para agentes de IA que trabalham neste repositório. Leia antes de alterar código.

## Sobre o projeto

**Prompt Store** é uma aplicação local para guardar, organizar e compor prompts visualmente. Cada prompt é um "bloco" colorido; o usuário arrasta blocos para uma área de composição, a ordem define o texto final, e tokens no formato `[[NOME]]` são preenchidos antes de copiar o resultado.

- Idioma da interface, da documentação e dos textos de erro: **português (pt-BR)**.
- Identificadores de código (funções, variáveis, rotas, campos) misturam inglês e português. Siga o padrão do arquivo em que está trabalhando.
- Não há autenticação. Os dados são de um único usuário, guardados localmente.

## Stack

- **Frontend:** Vue 3 (SFC com `<script setup>`), Pinia, Vue Router, Vuedraggable, Tailwind CSS 3, Vite 5.
- **Backend:** Express 4 em `server.js` (ES modules), com `uuid` para IDs.
- **Persistência:** um único arquivo JSON, `data/data.json`, lido e reescrito inteiro a cada operação.
- Node.js com `"type": "module"`. Use `import`/`export`, não `require`.

## Comandos

```bash
npm install          # instala dependências
npm run dev          # Vite na porta 3000 (frontend)
node server.js       # Express na porta 3001 (API) — precisa estar ativo junto com o dev
npm run build        # gera dist/ (verificação mínima antes de concluir uma tarefa)
npm start            # produção: serve dist/ e a API na mesma porta (PORT, padrão 3001)
```

Em desenvolvimento são **dois processos**. O Vite faz proxy de `/api/*` para `http://localhost:3001` (ver `vite.config.js`). Se aparecer `ECONNREFUSED` no terminal do Vite, o `server.js` não está rodando.

**Não há testes, linter nem formatter configurados.** A verificação disponível é `npm run build` mais teste manual no navegador quando a mudança for visual ou de fluxo.

## Estrutura

```
server.js                    # API Express + catch-all que serve dist/index.html
data/data.json               # DADOS REAIS DO USUÁRIO (versionado no git — ver regras abaixo)
src/
  main.js                    # cria app, Pinia e router
  App.vue                    # layout raiz (NavBar + router-view)
  router/index.js            # rotas; views secundárias são lazy-loaded
  services/storage.js        # ÚNICA camada que faz fetch para /api
  stores/prompts.js          # store Pinia `usePromptStore` (estado, getters, ações)
  constants/promptColors.js  # cores dos blocos e helpers de classes Tailwind
  components/                # PromptBlock, PromptLibrary, ComposerArea, PreviewPanel, PromptModal, TokenEditor, NavBar
  views/                     # HomeView, BlocosView, TagsView, ConfiguracoesView
  assets/main.css            # estilos globais e classes utilitárias do projeto (.btn, .page-lead, ...)
tailwind.config.js           # paleta `prompt-*` (cores dos blocos)
```

Alias `@` aponta para `src/` (ex.: `import { usePromptStore } from '@/stores/prompts'`).

## Modelo de dados

`data/data.json` tem três coleções: `prompts`, `tags` e `compositions`.

- **Prompt:** `{ id, title?, content, color, tags: string[], createdAt, updatedAt }`
- **Tag:** `{ id, ... , createdAt }`
- **Composição:** `{ id, name, blocks: promptId[], tokens: {[TOKEN]: valor}, createdAt }`

`id` é gerado pelo servidor (`uuidv4`). `createdAt` e `updatedAt` também são definidos pelo servidor.

## API

| Método | Rota | Observação |
|---|---|---|
| GET | `/api/prompts` | |
| POST | `/api/prompts` | |
| PATCH | `/api/prompts/bulk-color` | body `{ color }`; aplica a cor a **todos** os prompts |
| PUT | `/api/prompts/:id` | merge parcial; atualiza `updatedAt` |
| DELETE | `/api/prompts/:id` | |
| GET/POST | `/api/tags` | |
| DELETE | `/api/tags/:id` | |
| GET/POST | `/api/compositions` | |
| DELETE | `/api/compositions/:id` | |
| POST | `/api/import` | **substitui** todos os dados pelo JSON enviado |
| DELETE | `/api/clear` | **apaga** todos os dados |

Ao adicionar rotas de prompt com `:id`, mantenha `/api/prompts/bulk-color` **antes** delas. Caso contrário, `bulk-color` pode ser interpretado como um id.

## Convenções

### Dados e servidor

- Toda leitura/escrita passa por `readData()` / `writeData()` em `server.js`. Não abra o arquivo de outro lugar.
- Mantenha a forma atual de resposta: lista pura em GETs de coleção, objeto criado/atualizado em POST/PUT, `204` em DELETE, e `{ error }` com status HTTP apropriado em falhas.
- Validação de entrada é mínima hoje. Se adicionar campos obrigatórios, valide no servidor e não só no cliente.

### Frontend

- **Chamadas HTTP:** use `storageService` em `src/services/storage.js`. Não faça `fetch` direto em componentes ou stores.
  - Exceção existente: `src/views/ConfiguracoesView.vue` chama `/api/import` e `/api/clear` diretamente. Não copie esse padrão; se mexer nessa parte, prefira mover a chamada para o serviço.
- **Estado:** a única fonte de verdade do cliente é `usePromptStore`. Componentes leem do store e disparam ações dele.
- **Composer vs. biblioteca:** `composerBlocks` guarda **cópias** dos prompts, com `composerId` único. Ao atualizar um prompt, `updatePrompt` já sincroniza o composer. Se criar outra ação que altere prompts, faça o mesmo.
- **Tokens:** o padrão é `[[MAIUSCULAS_E_NUMEROS_E_UNDERSCORE]]`, regex `/\[\[([A-Z0-9_]+)\]\]/g`. A interpolação está em `interpolatedText` no store.
- **Ordem:** a lista filtrada é ordenada por `usageCount` decrescente (incrementado ao copiar o texto da composição, via `POST /api/prompts/usage`), com desempate por `createdAt` decrescente (`promptCreatedAt`). A ordem da composição é a ordem do array `composerBlocks`.
- **Ao acrescentar uma cor de bloco**, atualize todos estes pontos, senão a cor falha silenciosamente:
  1. `PROMPT_COLORS` em `src/constants/promptColors.js` (valor, nome e swatch)
  2. os helpers `promptBlockColorClass`, `promptComposerColorClass` e `promptCardBorderClass` no mesmo arquivo
  3. o `Set` `PROMPT_COLORS` em `server.js` (validação do bulk-color)
  4. a paleta `prompt` em `tailwind.config.js`, para que `bg-prompt-<cor>` exista
- **Estilo:** use classes Tailwind. Reutilize as classes globais de `src/assets/main.css` (`.btn`, `.page-lead`, etc.) antes de criar novas. Não adicione bibliotecas de UI.
- **Responsividade:** a interface é mobile-friendly (README). Verifique a largura de celular ao mexer em layout.

### Commits

Histórico segue **Conventional Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, com escopo opcional (`feat(components): ...`). A descrição pode estar em português ou inglês. Só faça commit quando o usuário pedir.

## Não faça sem pedido explícito

- **Não altere `data/data.json` para "testar".** Ele é tracked no git e contém prompts reais do usuário. Para testar escrita, use dados temporários ou um backup em `scratchpad`, e restaure depois.
- **Não chame `DELETE /api/clear` nem `POST /api/import`** em testes, pois apagam ou substituem todos os dados.
- Não versione `.agents/`, `skills-lock.json`, `dist/` nem `node_modules/`. Eles estão no `.gitignore` (`skills-lock.json` e `.agents/` estão lá de propósito).
- Não troque o stack (ex.: banco de dados, Options API, outro framework CSS). `PROMPT-BUILT-LANDING-PAGE.md` descreve a intenção de migrar para NoSQL no futuro, mas isso é trabalho planejado, não tarefa avulsa.

## Deploy

Heroku via `Procfile` (`web: npm start`). O `dist/` precisa existir: rode `npm run build` antes de `npm start`. O `dist/` é gitignored, então o build acontece no ambiente de deploy.

## Documentação de referência

- `README.md`: instalação, dois processos em dev, problemas comuns, endpoints.
- `PROMPT-BUILT-LANDING-PAGE.md`: documento de requisitos e visão geral do sistema (em português).
