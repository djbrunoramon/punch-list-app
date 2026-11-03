---
type: Specification
title: "Painel"
description: "Indicadores de pendências do contrato selecionado por status e por prioridade."
status: stable
capability_id: DSH
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

## DSH-001 — Por status
O painel mostra uma pizza com as pendências do contrato por status e uma legenda com todos os status e suas quantidades. Só os status com pendências aparecem como fatias; na legenda, os status zerados ficam em cinza e os demais usam a mesma cor da fatia.

## DSH-002 — Por prioridade
O painel mostra um gráfico de barras por prioridade para um status escolhido (padrão: aberta). A troca de status recarrega só esse gráfico.

## DSH-003 — Vazio e erro
Sem pendências, o painel mostra "nenhuma pendência". A falha de um gráfico não esconde o outro.

## DSH-004 — Acessibilidade
O gráfico de barras tem descrição textual com as quantidades por prioridade.
