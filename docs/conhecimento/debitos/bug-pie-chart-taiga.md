---
type: Tech Debt
title: "Contorno para bug do TuiPieChart 5.31"
description: "Fatia zerada após um círculo completo é desenhada como círculo inteiro; o painel só passa valores maiores que zero."
status: stable
severity: baixa
debt_kind: upstream
debt_status: aberto
tags: [debito]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: origem
    resource: "temp/modernizacao-sb4-ng22/DEBITOS.md#D-UP-01"
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Onde
- `features/dashboard/pages/dashboard.page.ts` (`pieValues` e `legend`).

# Impacto
- Quem criar outra pizza sem o contorno verá fatias erradas sempre que os últimos valores forem 0.

# Causa
O `TuiPieChart` limita o ângulo final da fatia a 359.9999°, mas não o inicial. Uma fatia de 360° a 359.9999° com `sweep=1` dá a volta quase completa.

# Sugestão
- Reportar em taiga-family/taiga-ui e remover o contorno quando houver correção.
