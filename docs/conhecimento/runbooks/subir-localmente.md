---
type: Runbook
title: "Subir o app com a API"
description: "Como rodar o app em desenvolvimento junto com a API."
status: stable
tags: [operacao]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Pré-requisitos
- Node `^22.22.3 || ^24.15.0`.
- A API rodando em `:8080` ([runbook da API](https://github.com/djbrunoramon/punch-list-api/blob/main/docs/conhecimento/runbooks/subir-localmente.md)).

# Passos
1. `npm ci`
2. `npm start`. O `ng serve` usa o `proxy.conf.json`, que encaminha `/api` para `http://localhost:8080`.
3. Abra http://localhost:4200.

# Como confirmar
- O seletor de contrato no header mostra `BR2022-001`, dos dados demo da API.
- Se a API estiver parada, o header mostra "Contracts unavailable" com "Try again".

# Verificações antes do PR
`npm run lint && npm test && npm run build`
