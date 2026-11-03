---
type: Tech Debt
title: "Vulnerabilidades moderate via schematics do Taiga"
description: "O npm audit aponta 10 vulnerabilidades moderate (minimatch via ng-morph), sem correção disponível."
status: stable
severity: baixa
debt_kind: segurança
debt_status: aberto
tags: [debito]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: origem
    resource: "temp/modernizacao-sb4-ng22/DEBITOS.md#D-SUP-01"
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Onde
- Dependência transitiva de `@taiga-ui/cdk` (schematics).

# Impacto
- Afeta ferramentas de schematics, não o bundle do navegador.

# Sugestão
- Acompanhar as versões do Taiga e habilitar o Dependabot.
