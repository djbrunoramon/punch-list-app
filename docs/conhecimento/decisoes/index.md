# Decisões

* [ADR-0001: Recriar o workspace em Angular 22 em vez de ng update](0001-recriar-workspace-angular-22.md) - O app foi recriado com o Angular CLI 22 e o código foi portado, em vez de passar por 9 majors de ng update.
* [ADR-0002: Taiga UI 5 no lugar do Angular Material](0002-taiga-ui.md) - Os componentes, temas e gráficos vêm do Taiga UI 5.31; a tabela é HTML nativo com tokens do Taiga.
* [ADR-0003: Signals, zoneless e Signal Forms](0003-signals-zoneless-signal-forms.md) - O estado é baseado em signals, sem zone.js, com rxResource para leitura e Signal Forms nos formulários.
* [ADR-0004: Estrutura por feature e contrato selecionado global](0004-estrutura-por-feature-e-contexto-de-contrato.md) - O código fica organizado em core, shared e features/<recurso>, e o contrato selecionado é um contexto global no core.
* [ADR-0005: Transloco para i18n em runtime](0005-transloco-para-i18n.md) - O app usa @jsverse/transloco 8.4 com troca de idioma em runtime (en, pt-BR) e chaves no padrão do projeto.
