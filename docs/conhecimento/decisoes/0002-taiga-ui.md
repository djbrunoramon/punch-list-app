---
type: Architecture Decision
title: "ADR-0002: Taiga UI 5 no lugar do Angular Material"
description: "Os componentes, temas e gráficos vêm do Taiga UI 5.31; a tabela é HTML nativo com tokens do Taiga."
status: stable
decision: accepted
tags: [adr, ui]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
  - id: tarefa
    resource: "temp/modernizacao-sb4-ng22 (DECISOES.md, PLANO.md, SPEC-DELTA.md) — branch feature/modernizacao-sb4-ng22"
---

# Contexto
O usuário pediu Taiga UI. O app usava Angular Material, chart.js/ng2-charts, ngx-loading-bar e ng2-currency-mask.

# Decisão
- `@taiga-ui/{cdk,core,kit,layout,icons,addon-charts}` 5.31, com `provideTaiga()` e `<tui-root>`. O `less` entra como devDependency porque o tema do Taiga é `.less`.
- Gráficos com `TuiPieChart` e `TuiBarChart`/`TuiAxes`; chart.js removido.
- **Tabela nativa** (`table.app-table` com tokens `--tui-*`) em vez de `@taiga-ui/addon-table`.
- Tema claro/escuro pelo sinal `TUI_DARK_MODE` ([ThemeToggle](https://github.com/djbrunoramon/punch-list-app/blob/main/src/app/core/theme/theme-toggle.ts)): segue o sistema até o usuário escolher e persiste em `localStorage` `tuiDark`.
- Estilos usam só tokens `var(--tui-*)`.

# Alternativas consideradas
- **`@taiga-ui/addon-table`:** mais uma dependência para tabelas simples.
- **Manter chart.js:** visual inconsistente com o resto e uma dependência a mais.

# Consequências
- O orçamento do bundle inicial subiu para 800 kB/1,5 MB (cerca de 684 kB hoje).
- A fonte Manrope vem do Google Fonts ([débito](../debitos/fonte-google-fonts.md)).
- O `TuiPieChart` 5.31 tem um bug com fatias zeradas, contornado no dashboard ([débito](../debitos/bug-pie-chart-taiga.md)).
