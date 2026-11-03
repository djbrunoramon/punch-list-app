---
type: Tech Debt
title: "i18n: chaves usadas sem verificação e erros não retraduzidos"
description: "Não há verificação de que toda chave usada no código existe no JSON, e erros já exibidos não mudam de idioma."
status: stable
severity: baixa
debt_kind: i18n
debt_status: aberto
tags: [debito]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: origem
    resource: "temp/modernizacao-sb4-ng22/DEBITOS.md#D-I18N-02, D-I18N-03"
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Onde
- `public/i18n/*.json` e `core/api-error`.

# Impacto
- Uma chave digitada errado só aparece em dev, no console (`logMissingKey`).
- Trocar de idioma com um erro na tela mantém o texto no idioma anterior.

# Sugestão
- `@jsverse/transloco-keys-manager` no CI.
- Guardar o código do erro e traduzir na renderização.
