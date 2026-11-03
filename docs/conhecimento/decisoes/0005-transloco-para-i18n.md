---
type: Architecture Decision
title: "ADR-0005: Transloco para i18n em runtime"
description: "O app usa @jsverse/transloco 8.4 com troca de idioma em runtime (en, pt-BR) e chaves no padrão do projeto."
status: stable
decision: accepted
tags: [adr, i18n]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
  - id: tarefa-i18n
    resource: "temp/i18n (DEMANDA.md, PADRAO-NOMENCLATURA.md, RELATORIO.md)"
---

# Contexto
O usuário pediu i18n em pt-BR e en, com padrão de nomenclatura de chaves e troca de idioma pelo header.

# Decisão
- `@jsverse/transloco` 8.4.0 com JSON em `public/i18n/`, `defaultLang`/`fallbackLang` `en`, e seletor EN / PT-BR no header.
- O idioma inicial vem do `localStorage` `lang` ou do navegador.
- Taiga (`TUI_LANGUAGE`), pipes de data e moeda, título da aba e `Accept-Language` acompanham o idioma.
- Padrão de chaves e fluxo em [i18n](../modulos/i18n.md).

# Alternativas consideradas
- **i18n nativo (`@angular/localize`):** sem dependência, mas um build por idioma, e trocar de idioma significa recarregar outra URL.
- **ngx-translate:** runtime como o Transloco, mas com menos recursos (sem escopos lazy nativos).

# Consequências
- Uma dependência de runtime a mais (MIT, sem scripts de instalação).
- Testes de paridade e de padrão das chaves (`translations.spec.ts`).
- O `detail` dos erros da API vem já traduzido pelo `Accept-Language` ([ADR-0008 da API](https://github.com/djbrunoramon/punch-list-api/blob/main/docs/conhecimento/decisoes/0008-idioma-pelo-accept-language.md)).
