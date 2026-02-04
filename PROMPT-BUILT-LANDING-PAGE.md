# SISTEMA: PROMPT STORE

## Contexto e Problema

Atualmente, os prompts estão dispersos em anotações e arquivos de texto, dificultando reutilização, manutenção e evolução. O objetivo é centralizar, organizar e permitir a composição dinâmica desses prompts de forma visual e eficiente.

------------------------------------------------------------------------

## Objetivo do Sistema

-   Armazenar prompts de forma estruturada
-   Permitir reutilização, combinação e edição
-   Compor prompts finais por concatenação e interpolação
-   Garantir persistência de dados e escalabilidade futura

Inicialmente os dados serão armazenados em `data/data.json`. A arquitetura deve permitir migração futura para banco NoSQL sem grande refatoração.

------------------------------------------------------------------------

## Funcionamento Geral da Interface

### Painel esquerdo (Biblioteca de Prompts)

-   Lista de prompts em blocos visuais
-   Blocos coloridos
-   Empilhamento vertical
-   Ação de arrastar (drag-and-drop)


### Painel direito (Área de Composição)

-   Recebe os blocos arrastados
-   Representa a construção do prompt final
-   Exibe preview em tempo real

------------------------------------------------------------------------

## Concatenação

-   Ordem do preview segue a ordem dos blocos
-   Permitir reordenar
-   Permitir remover
-   Atualização em tempo real

------------------------------------------------------------------------

## Interpolação de Tokens

-   Tokens no formato `[[TOKEN]]`
-   Edição do texto do bloco
-   Campo JSON para valores

Exemplo:


``` json

{

  "[[USUARIO]]": "JOHN SHOW",

  "[[EMPRESA]]": "COMPANY LTDA"

}

```

Regras: - Interpolação ocorre apenas no preview - Texto original

permanece intacto - Tokens não substituídos continuam visíveis

------------------------------------------------------------------------

## Características de Design

-   Interface limpa e minimalista
-   Foco em usabilidade
-   Feedback visual nas ações
-   Cores suaves e bom contraste
-   Layout responsivo (será utilizado muito em mobile)
-   Animações sutis
-   Tipografia legível

------------------------------------------------------------------------

## Tecnologias

-   Tailwind CSS
-   Vue 3
-   Pinia

------------------------------------------------------------------------

## Persistência e Deploy

-   Persistência obrigatória dos dados
-   Armazenamento inicial em JSON
-   Preparado para futura migração para NoSQL
-   Deploy em VPS via Heroku
-   Estrutura pronta para produção

------------------------------------------------------------------------

## Requisitos Técnicos Esperados

-   Drag-and-drop nativo ou biblioteca leve
-   Estado centralizado com Pinia
-   Componentização (PromptBlock, ComposerArea, Preview, Editor)
-   Camada de armazenamento desacoplada
-   Código modular e escalável