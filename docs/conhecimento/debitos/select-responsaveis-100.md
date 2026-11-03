---
type: Tech Debt
title: "Seletores de responsável limitados a 100"
description: "O formulário de pendência só lista os 100 primeiros responsáveis do contrato."
status: stable
severity: média
debt_kind: ux
debt_status: aberto
tags: [debito]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: origem
    resource: "temp/modernizacao-sb4-ng22/DEBITOS.md#D-UX-01 (confirmado pela revisão independente)"
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Onde
- `features/pendencies/pages/pendency-form.page.ts` (`size: 100`, o limite da API).

# Impacto
- Contratos com mais de 100 responsáveis não conseguem atribuir os demais.

# Sugestão
- Combo com busca no servidor (`?name=`) ou carregamento paginado.
