---
type: Architecture Decision
title: "ADR-0001: Recriar o workspace em Angular 22 em vez de ng update"
description: "O app foi recriado com o Angular CLI 22 e o código foi portado, em vez de passar por 9 majors de ng update."
status: stable
decision: accepted
tags: [adr, plataforma]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
  - id: tarefa
    resource: "temp/modernizacao-sb4-ng22 (DECISOES.md, PLANO.md, SPEC-DELTA.md) — branch feature/modernizacao-sb4-ng22"
---

# Contexto
- O app estava em Angular 13 com NgModules, Angular Material, Karma e chart.js.
- O build só passava com `--openssl-legacy-provider`, e o `npm audit` apontava 1 critical e 8 high.
- O alvo era Angular 22 com standalone, zoneless e Taiga UI.

# Decisão
Gerar um workspace limpo com `npx @angular/cli@22 new`, trazer a configuração dele (`angular.json`, `tsconfig*`, `package.json`) e reescrever o `src/app` por feature. Os arquivos mantidos foram `.git`, `README`, `docs/` e `.editorconfig`.

# Alternativas consideradas
- **`ng update` 13 → 22, um major por vez:** nove migrações, e mesmo assim todo componente teria de ser reescrito para Taiga, standalone e signals. Custo alto para chegar ao mesmo lugar.

# Consequências
- A configuração é a idiomática do v22: builder `@angular/build`, Vitest e sem zone.js.
- Exige Node `^22.22.3 || ^24.15.0` (`engines` no `package.json`).
- O `docs/` ainda tem o build publicado do app antigo ([débito de deploy](https://github.com/djbrunoramon/punch-list-api/blob/main/docs/conhecimento/debitos/deploy-conjunto.md)).
