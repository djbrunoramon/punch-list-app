---
type: Runbook
title: "Adicionar um idioma ao app"
description: "Passos para incluir um novo idioma na interface."
status: stable
tags: [operacao]
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-03T20:45:00-03:00 }
sources:
  - id: pr-7
    resource: "https://github.com/djbrunoramon/punch-list-app/pull/7"
    title: "Rebuild do app em Angular 22 com Taiga UI, temas e i18n"
---

# Passos
1. Copie `public/i18n/en.json` para `public/i18n/<tag BCP 47>.json` e traduza **todas** as chaves.
2. Inclua o idioma em `availableLangs` e no mapeamento do `core/i18n/language.ts`: detecção pelo navegador e locale dos pipes, com `registerLocaleData`.
3. Mapeie o idioma do Taiga em `core/i18n/taiga-language.ts`.
4. Adicione o botão no `language-switcher.ts`, com chaves `shell.language.*`.
5. Inclua o arquivo no `translations.spec.ts` (paridade).
6. Faça o mesmo na API (`docs/conhecimento/runbooks/adicionar-idioma.md` do punch-list-api).

# Como confirmar
- `npm test` verde, com paridade.
- Trocando o idioma no header, textos, datas e as mensagens de erro da API mudam.

# Referência
- [i18n](../modulos/i18n.md)
