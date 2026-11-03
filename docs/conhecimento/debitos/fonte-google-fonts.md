---
type: Tech Debt
title: "Fonte carregada do Google Fonts"
description: "O tema do Taiga importa a fonte Manrope do Google Fonts em runtime."
status: stable
severity: baixa
debt_kind: privacidade
debt_status: aberto
tags: [debito]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: origem
    resource: "temp/modernizacao-sb4-ng22/DEBITOS.md#D-PRIV-01"
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Onde
- `taiga-ui-fonts.less` (`angular.json`, styles).

# Impacto
- Requisição a terceiro em todo acesso: privacidade e CSP.

# Sugestão
- Hospedar a fonte em `public/` e definir uma Content-Security-Policy.
