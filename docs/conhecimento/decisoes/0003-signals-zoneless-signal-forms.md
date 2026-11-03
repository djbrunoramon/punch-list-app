---
type: Architecture Decision
title: "ADR-0003: Signals, zoneless e Signal Forms"
description: "O estado é baseado em signals, sem zone.js, com rxResource para leitura e Signal Forms nos formulários."
status: stable
decision: accepted
tags: [adr, angular, boas-praticas]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
  - id: tarefa
    resource: "temp/modernizacao-sb4-ng22 (DECISOES.md, PLANO.md, SPEC-DELTA.md) — branch feature/modernizacao-sb4-ng22"
---

# Contexto
O Angular 22 tem zoneless como padrão, e Signal Forms, `rxResource` e `httpResource` estão estáveis (`@publicApi 22.0`, conferido nos `.d.ts`).

# Decisão
- Só standalone e `OnPush`, com `inject()`, `input()`/`output()`, `computed` e `linkedSignal`.
- Leitura com `rxResource`, que cancela requisições obsoletas quando contrato, página ou filtro mudam (há testes provando).
- Formulários com **Signal Forms**. A validação espelha o backend (`requiredText` rejeita texto só de espaços; `maxLength` igual às colunas).
- Control flow `@if`/`@for` com `track`.
- As regras ficam no `eslint.config.js` (angular-eslint), que também proíbe `innerHTML` e `bypassSecurityTrust*`.

# Alternativas consideradas
- **Reactive Forms tipados:** estáveis, mas fora da direção do framework.
- **NgModules e zone.js:** legado no v22.

# Consequências
- Nos specs, `whenStable()` trava com requisição pendente; os testes usam `detectChanges()`/`nextTick`.
- Referências de código em `features/contracts` (padrão) e `features/pendencies` (validação condicional por status).
