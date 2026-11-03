# Débitos

* [Sem teste e2e no navegador](teste-e2e-navegador.md) - Os fluxos de cadastro não são testados num navegador real contra a API.
* [Seletores de responsável limitados a 100](select-responsaveis-100.md) - O formulário de pendência só lista os 100 primeiros responsáveis do contrato.
* [Contorno para bug do TuiPieChart 5.31](bug-pie-chart-taiga.md) - Fatia zerada após um círculo completo é desenhada como círculo inteiro; o painel só passa valores maiores que zero.
* [Vulnerabilidades moderate via schematics do Taiga](vulnerabilidades-moderate-schematics.md) - O npm audit aponta 10 vulnerabilidades moderate (minimatch via ng-morph), sem correção disponível.
* [Fonte carregada do Google Fonts](fonte-google-fonts.md) - O tema do Taiga importa a fonte Manrope do Google Fonts em runtime.
* [i18n: chaves usadas sem verificação e erros não retraduzidos](i18n-chaves-e-retraducao.md) - Não há verificação de que toda chave usada no código existe no JSON, e erros já exibidos não mudam de idioma.

# Na API

* [Deploy conjunto](https://github.com/djbrunoramon/punch-list-api/blob/main/docs/conhecimento/debitos/deploy-conjunto.md) - publicar API e app juntos
* [Sem autenticação](https://github.com/djbrunoramon/punch-list-api/blob/main/docs/conhecimento/debitos/sem-autenticacao.md) - afeta o app (login e token quando existir)
