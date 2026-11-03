---
type: Specification
title: "Seleção de contrato"
description: "Como o usuário escolhe o contrato de trabalho e como as telas reagem."
status: stable
capability_id: SEL
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

# Propósito
Todas as telas de trabalho (painel, responsáveis, pendências) mostram dados de um contrato escolhido no header.

# Requisitos

## SEL-001 — Escolha inicial
Na primeira visita, o contrato selecionado é o primeiro da lista. Nas visitas seguintes, é o último escolhido (guardado no navegador), se ele ainda existir.

## SEL-002 — Troca
Quando o usuário trocar o contrato, então o painel, a lista de responsáveis e a lista de pendências recarregam com os dados do novo contrato e voltam para a primeira página. Os resultados de requisições do contrato anterior são descartados.

## SEL-003 — Formulários de criação
Quando o contrato mudar durante a criação de um responsável ou de uma pendência, então o formulário é reiniciado e o erro anterior some.

## SEL-004 — Sem contratos
Se não houver contratos, as telas convidam a cadastrar um e nenhuma chamada dependente de contrato é feita.

## SEL-005 — Falha ao carregar contratos
Se a lista de contratos falhar, então o header oferece "tentar novamente" e as telas mostram erro (não "nenhum contrato").
