---
type: Tech Debt
title: "Sem teste e2e no navegador"
description: "Os fluxos de cadastro não são testados num navegador real contra a API."
status: stable
severity: média
debt_kind: teste
debt_status: aberto
tags: [debito]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: origem
    resource: "temp/modernizacao-sb4-ng22/DEBITOS.md#D-TEST-02"
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Onde
- Só existem specs unitários com `HttpTestingController` (app) e testes de integração da API, separados.

# Impacto
- Uma quebra de integração (formato, header, rota) só aparece em teste manual.

# Sugestão
- Playwright com a API em compose/Testcontainers, cobrindo criar, editar e trocar idioma e contrato.
