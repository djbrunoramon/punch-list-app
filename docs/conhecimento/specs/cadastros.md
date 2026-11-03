---
type: Specification
title: "Cadastros e listas"
description: "Comportamento das listas e dos formulários de contratos, responsáveis e pendências."
status: stable
capability_id: CAD
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
Listar e cadastrar contratos, responsáveis e pendências com validação igual à da API. As regras de negócio estão na [spec de pendências da API](https://github.com/djbrunoramon/punch-list-api/blob/main/docs/conhecimento/specs/pendencias.md).

# Requisitos

## CAD-001 — Estados de página
Toda lista e formulário mostra carregando, vazio (com ação de cadastrar) e erro (com tentar novamente).

## CAD-002 — Paginação
As listas de responsáveis e de pendências mostram 10 itens por página. Responsáveis são ordenados por data de cadastro crescente; pendências, pela mais recente.

## CAD-003 — Validação no cliente
Campos obrigatórios rejeitam vazio e texto só com espaços; os limites de tamanho são iguais aos da API. O formulário inválido não chama a API.

## CAD-004 — Campos por status da pendência
Os campos de fechamento só aparecem, e só são obrigatórios, no status que os exige (CLOSED: concluída por/em; DISAPPROVED: reprovada por/em; CANCELED: cancelada por/em). Campos ocultos vão como nulos.

## CAD-005 — Responsáveis da pendência
Os seletores de responsável listam os responsáveis do contrato da pendência (até 100, ver [débito](../debitos/select-responsaveis-100.md)).

## CAD-006 — Erros do servidor
Um 400 mostra cada mensagem ao lado do campo correspondente. Um 422, um 404 ou um 409 mostram o `detail` da API num alerta.

## CAD-007 — Saída durante o salvamento
Se o usuário sair do formulário antes de a API responder, a resposta tardia não navega nem altera a tela.

## CAD-008 — Conteúdo como texto
Textos vindos da API (descrições, nomes) são sempre exibidos como texto, nunca interpretados como HTML.
