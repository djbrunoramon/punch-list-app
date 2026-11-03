# AGENTS.md — punch-list-app

Instruções para agentes de código (Claude, Codex, Cursor, Copilot, Gemini etc.). Fonte única: `CLAUDE.md` apenas importa este arquivo.

## Visão geral

Front-end Angular para registro de pendências (punch list) de contratos EPC: dashboard com gráficos, cadastro de contratos, responsáveis e pendências, com um contrato selecionado no cabeçalho. Consome a API `punch-list-api` (repositório irmão em `../punch-list-api`).

- Angular 22 (standalone, zoneless, signals, Signal Forms), TypeScript 6 em modo `strict` + `strictTemplates`
- Taiga UI 5.31 (core, kit, layout, addon-charts, icons); estilos SCSS, tema/fontes Taiga via `.less` em `angular.json`
- Testes: Vitest (+ jsdom) pelo builder `@angular/build:unit-test`
- Lint: ESLint 10 + angular-eslint + typescript-eslint; formatação: Prettier (`printWidth` 100, aspas simples)
- Node `^22.22.3 || ^24.15` (exigência do toolchain Angular 22)

## Comandos

```bash
npm ci
npm start            # ng serve em http://localhost:4200; /api vai por proxy (proxy.conf.json) para :8080
npm test             # ng test (Vitest)
npm run lint         # ng lint (src/**/*.ts e *.html)
npm run build        # build de produção em dist/punch-list-app
npm run watch        # build em modo watch (development)
```

- Backend local precisa estar em http://localhost:8080 (`cd ../punch-list-api && ./mvnw spring-boot:run`, ou perfil `h2`: `-Dspring-boot.run.profiles=h2`).

## Estrutura

```
src/app/
  app.ts, app.config.ts, app.routes.ts   # providers (zoneless, HttpClient withFetch + interceptor, Taiga) e rotas lazy
  core/
    api-error/          # ApiError, toApiError, apiErrorInterceptor
    config/             # API_BASE_URL (InjectionToken -> environment.apiBaseUrl)
    contract-context/   # ContractContext: contrato selecionado (linkedSignal + localStorage)
    layout/             # Shell: cabeçalho, navegação, seletor de contrato
  shared/
    models/page.ts      # Page<T>, PageRequest, toPageParams (size máx. 100)
    ui/page-state.ts    # <app-page-state>: loading / erro / vazio
    util/               # date-time.ts, server-errors.ts
  features/<feature>/   # dashboard, contracts, responsible-persons, pendencies
    data-access/        # <x>.api.ts (HTTP) e <x>.models.ts (interfaces Response/Request)
    pages/              # <x>-list.page / <x>-form.page (.ts + .html)
    <feature>.routes.ts # '', 'new', ':id'
src/environments/       # apiBaseUrl (vazio por padrão: chamadas relativas)
src/testing/            # fixtures (aContract, aPage, ...) só para testes
```

Rotas: `/` (dashboard), `/contracts`, `/responsible-persons`, `/pendencies`, cada uma com `new` e `:id`. As URLs antigas (`/contract`, `/responsible-person`, `/pendency`, com ou sem `:id`) redirecionam para as novas.

## Padrões a seguir

Arquivos de referência — copie o estilo deles ao criar algo novo:

- API HTTP, lista e formulário: `features/contracts` (`data-access/contracts.api.ts`, `pages/contract-list.page.*`, `pages/contract-form.page.*`)
- Lista paginada pelo servidor: `features/responsible-persons` (`pages/responsible-person-list.page.*`)
- Validação condicional (`applyWhen`) e selects de responsável: `features/pendencies/pages/pendency-form.page.ts`
- Gráficos: `features/dashboard/pages/dashboard.page.ts`

Convenções (várias são impostas pelo `eslint.config.js`, que roda como `error`):

- Componentes standalone, `ChangeDetectionStrategy.OnPush`, seletor com prefixo `app-` (elemento em kebab-case, diretiva em camelCase), `inject()` em vez de construtor, `input()`/`output()`/signals, `output` readonly. Proibido `any` (TS e templates).
- Templates com control flow (`@if`, `@for`, `@switch`), nunca `*ngIf`/`*ngFor`; regras de acessibilidade de template e `button` com `type`.
- Segurança: não use `bypassSecurityTrust*`, `innerHTML` nem `outerHTML` (regra do lint); use interpolação.
- Dados: `rxResource` para carregar; `linkedSignal` quando o estado depende de outro (ex.: página volta a 0 ao trocar de contrato); sem `subscribe` manual em componentes.
- Formulários: Signal Forms (`form`, `required`, `maxLength`, `applyWhen`, `FormField`); limites dos campos em `*_LIMITS` nos models, iguais aos do backend.
- Cada página de dados usa `<app-page-state>` (loading, erro com "Try again", vazio) e o seletor global de contrato (`ContractContext`).
- Services `providedIn: 'root'`, URL = `inject(API_BASE_URL)` + `/api/v1/<recurso>`. Nunca hardcode host.
- Models como interfaces espelhando `*Response`/`*Request` do backend (sem prefixo `I`).
- Estilo `scss`, aspas simples, 2 espaços (`.editorconfig`, `.prettierrc`). Código, nomes e mensagens de commit em inglês.

## Como testar

- Vitest com globals (`describe`, `it`, `expect`), arquivos `*.spec.ts` ao lado do código. `src/test-setup.ts` provê stubs de `matchMedia` e `ResizeObserver` para o jsdom (Taiga).
- HTTP: `provideHttpClient()` + `provideHttpClientTesting()` e `HttpTestingController`; sobrescreva `API_BASE_URL` quando precisar; `afterEach(() => httpTesting.verify())`. Exemplos: `features/*/data-access/*.api.spec.ts`, `core/api-error/api-error.interceptor.spec.ts`.
- `fixture.whenStable()` (ou `ApplicationRef.whenStable()`) **trava** enquanto houver requisição HTTP pendente. Responda (`flush`) a requisição antes, ou use apenas `fixture.detectChanges()` quando a nova requisição ficar pendente (veja `responsible-person-list.page.spec.ts`).
- Dados de teste em `src/testing/fixtures.ts` (`aContract`, `aResponsiblePerson`, `aPersonSummary`, `aPendency`, `aPage`). Essa pasta fica fora do build da aplicação.

## Pegadinhas conhecidas

- Tema claro/escuro: `core/theme/theme-toggle.ts` usa o sinal `TUI_DARK_MODE` do Taiga (segue o sistema até o usuário escolher; persiste em `localStorage` `tuiDark`); `provideTaiga()` aplica `tuiTheme="dark"` no `body`. Use sempre tokens `var(--tui-*)` em estilos — cor fixa quebra um dos temas.
- `TuiPieChart` 5.31: fatia de valor 0 depois de um círculo completo é desenhada como círculo quase inteiro. O dashboard passa só valores > 0 (`pieValues`) e a legenda calcula a cor pelo índice da fatia desenhada. Mantenha isso em qualquer gráfico de pizza novo.

- `docs/` é o **build antigo publicado** (Angular 13, GitHub Pages) mais as imagens do README em `docs/img/`. Não edite o build à mão. O build novo vai para `dist/`.
- `less` é devDependency necessária: o tema e as fontes do Taiga (`taiga-ui-theme.less`, `taiga-ui-fonts.less`) são compilados pelo build.
- A fonte (Manrope) vem do Google Fonts (`@import` em `taiga-ui-fonts.less`); sem internet usa a fonte de fallback.
- Orçamento do bundle em `angular.json` (produção): inicial 800 kB (warning) / 1,5 MB (erro); estilo por componente 4 kB / 8 kB. Dependência nova pesada pode quebrar o build.
- Tabelas são `<table class="app-table">` nativas (classes em `src/styles.scss`); não há `@taiga-ui/addon-table`.
- Os selects de responsável (pendência) carregam só os 100 primeiros do contrato, por nome (`size: 100`, teto da API); `toPageParams` limita `size` a 100.
- O contrato de responsável (`ResponsiblePerson`/`ResponsiblePersonRequest`) não muda: não altere campos nem rotas sem mudar a API.
- O proxy (`proxy.conf.json`) só vale no `ng serve`. Em produção, `apiBaseUrl` vazio exige mesma origem; com outra origem, ela precisa estar em `APP_CORS_ALLOWED_ORIGINS` na API.
- Não coloque segredos em `environment*.ts`: tudo ali vai para o bundle público.
- Seleção de contrato fica em `localStorage` (`punch-list.selected-contract`); o código tolera storage indisponível.

## Contrato com o backend

Rotas, nomes de campos e formatos de data vêm do `punch-list-api` (`/api/v1/contract`, `/responsible-person`, `/pendency`, incluindo `/pendency/contract/{id}/chart/pie` e `/chart/bar/{status}`). Ao mudar um model aqui, confira o DTO correspondente no backend; ao mudar o backend, atualize `features/*/data-access`.

- Listas paginadas: `{ content, page: { size, number, totalElements, totalPages } }`; requisição com `page` (base 0), `size` (máx. 100) e `sort` (`campo,asc|desc`). A lista de contratos não é paginada (`Contract[]`).
- Erros: ProblemDetail (RFC 9457) com `type`, `title`, `status`, `detail` e, na validação (400), `errors: [{ field, message }]`. 404 = não encontrado; 422 = regra de negócio (ex.: campos de fechamento do status). O app nunca exibe corpo que não seja ProblemDetail.
- Datas: horário local `yyyy-MM-ddTHH:mm` (igual ao valor de `<input type="datetime-local">`); vazio vai como `null`. Veja `shared/util/date-time.ts`.
- Status da pendência: `OPEN`, `CLOSED`, `DISAPPROVED`, `CANCELED`. Só os campos de fechamento do status atual são enviados; os demais vão `null`.
