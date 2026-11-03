---
type: Specification
title: "Preferências de idioma e tema"
description: "Escolha de idioma (en, pt-BR) e de tema (claro, escuro) pelo usuário."
status: stable
capability_id: PRF
tags: [spec]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
  - id: tarefa
    resource: "temp/modernizacao-sb4-ng22 (DECISOES.md, PLANO.md, SPEC-DELTA.md) — branch feature/modernizacao-sb4-ng22"
  - id: delta
    resource: "temp/modernizacao-sb4-ng22/SPEC-DELTA.md (reconciliado)"
---

# Requisitos

## PRF-001 — Idioma inicial
Na primeira visita, o idioma é o do navegador (`pt*` → português do Brasil; qualquer outro → inglês).

## PRF-002 — Troca de idioma
Quando o usuário escolher EN ou PT-BR no header, então todos os textos, incluindo os dos componentes Taiga, datas, moeda e o título da aba, mudam sem recarregar a página. A escolha é lembrada nas próximas visitas, e as próximas respostas da API vêm no mesmo idioma.

## PRF-003 — Tema inicial
Até o usuário escolher, o tema segue o do sistema operacional.

## PRF-004 — Troca de tema
O botão no header alterna entre claro e escuro, e a escolha é lembrada. Os controles nativos (seletor de data, barras de rolagem) acompanham o tema.
