---
type: Architecture Decision
title: "ADR-0004: Estrutura por feature e contrato selecionado global"
description: "O código fica organizado em core, shared e features/<recurso>, e o contrato selecionado é um contexto global no core."
status: stable
decision: accepted
tags: [adr, arquitetura]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
  - id: tarefa
    resource: "temp/modernizacao-sb4-ng22 (DECISOES.md, PLANO.md, SPEC-DELTA.md) — branch feature/modernizacao-sb4-ng22"
---

# Contexto
- O app antigo fixava o contrato `id=1` nas telas.
- O usuário aprovou um seletor de contrato no header.

# Decisão
- Estrutura `core/` (shell, interceptors, contexto de contrato, i18n, tema), `shared/` (ui, models, util) e `features/<recurso>/{data-access,pages}`, com rotas lazy.
- O [`ContractContext`](https://github.com/djbrunoramon/punch-list-app/blob/main/src/app/core/contract-context/contract-context.ts) guarda o contrato selecionado (signal, persistido em `localStorage`) e expõe a lista e o erro de carregamento.
- O `ContractContext` (core) importa `features/contracts/data-access`.

# Alternativas consideradas
- **Mover a API de contratos para o core:** espalharia a feature de contratos entre dois lugares.
- **Contrato na URL** (`/contracts/:id/pendencies`): URLs mais longas e a troca de contrato fica mais custosa. Pode ser revisto.

# Consequências
- Dashboard, responsáveis e pendências reagem à troca de contrato; os formulários de criação reiniciam.
- Na falha ao carregar contratos, as páginas mostram erro com "tentar novamente", e não "nenhum contrato".
