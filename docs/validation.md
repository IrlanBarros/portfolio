# Verificação da entrega

Executada em 15/11/2026, em ambiente local, sobre o build estático de produção. Não houve deploy nem publicação no GitHub.

## Resultado

| Verificação | Resultado observado |
| --- | --- |
| Astro check / TypeScript | 0 erros, 0 avisos, 0 hints |
| ESLint | Aprovado |
| npm audit final | 0 vulnerabilidades, após remoção do Lighthouse temporário |
| Build estático | 8 páginas: início, seis estudos de caso e 404; robots e sitemap adicionais |
| Testes de estado | 6 casos aprovados |
| Integridade da saída | 4 casos aprovados; referências locais, catálogo, currículo e metadados |
| Playwright | 18 cenários validados em Chromium: 9 em desktop e 9 em Pixel 7 emulado |
| Axe | Nenhuma violação encontrada nas regras WCAG 2 A/AA, 2.1 A/AA e 2.2 AA selecionadas, nos dois temas, no seletor de avatar e na paleta |
| Responsividade | Sem overflow horizontal em 320, 360, 393, 768, 1024, 1440 e 1920px |
| Currículo | PDF original preservado e acessível pela URL local |
| JavaScript de interface | Aproximadamente 11 kB minificados; sem framework de hidratação |

Na última execução completa, 16 cenários passaram e 2 identificaram contraste insuficiente no texto secundário da paleta no tema claro. A cor foi corrigida e **os dois cenários foram reexecutados com sucesso**, incluindo todos os temas, os dois diálogos e o ciclo de foco por teclado. As capturas também foram regeneradas depois da correção. Não há falha de teste pendente.

O executor Node 24 agrega `node --test` por arquivo neste ambiente; a execução direta de cada arquivo confirmou os 6 + 4 casos individuais.

## Lighthouse

Lighthouse **12.8.2**, Chromium 159, prévia em `http://127.0.0.1:4321/`, emulação mobile padrão e preset desktop. Medições locais com throttling simulado, sem extensões. Não representam resultados de uma hospedagem pública.

| Categoria / métrica | Celular | Desktop |
| --- | --- | --- |
| Performance | **99** | **100** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |
| First Contentful Paint | 1,4 s | 0,4 s |
| Largest Contentful Paint | 2,0 s | 0,4 s |
| Total Blocking Time | 0 ms | 0 ms |
| Cumulative Layout Shift | 0,002 | 0,002 |

Relatórios completos: [celular](qa/lighthouse-mobile.json) e [desktop](qa/lighthouse-desktop.json). O Lighthouse foi usado como ferramenta temporária de auditoria e removido das dependências finais. Sugestões de otimização remanescentes incluem dimensionamento ainda mais específico de imagens e a cadeia de carregamento das fontes; não são falhas funcionais.

## Interações verificadas

- Todos os seis retratos carregam; troca reflete na Hero e no perfil, persiste após reload e sobrevive à mudança de modo. Restauração retorna à ilustração azul.
- Identificador inválido e armazenamento bloqueado não interrompem a navegação.
- Miniaturas têm carregamento sob demanda; pixel art usa lossless/nearest-neighbor e `image-rendering: pixelated`.
- Diálogos têm nomes acessíveis, ciclo de foco, Escape e retorno ao acionador.
- Paleta busca sem acentos, mostra estado vazio, aceita setas/Enter e encontra projetos, habilidades e ações.
- Filtros mostram os projetos correspondentes; estudos de caso são páginas HTML reais.
- Progresso exige visibilidade/interação real, alcança 100%, persiste e reinicia sem alterar o avatar.
- Modo profissional conserva a seção de leitura, pausa novas conquistas e simplifica a apresentação.
- Temas persistem; menu móvel abre, navega e fecha.
- Sem JavaScript: apresentação, retrato padrão, projetos, competências alternativas, contatos, currículo e detalhes da trajetória continuam disponíveis.
- Imagens efetivamente usadas na página foram carregadas e tiveram suas dimensões naturais verificadas.

## Links

Aplicação Planeja UFCA, quatro repositórios e perfil GitHub responderam **HTTP 200**, incluindo redirecionamentos de URLs terminadas em `.git`. O LinkedIn respondeu **405** à solicitação HEAD; a disponibilidade desse perfil não pôde ser confirmada automaticamente. Seu endereço foi mantido exatamente como fornecido no README.

Registro: [links.json](qa/links.json). Links externos podem mudar depois da verificação.

## Inspeção visual e limites

Foram revisadas as capturas reais [desktop](qa/portfolio-desktop.png) e [celular](qa/portfolio-mobile.png), além da página no navegador integrado. Fontes, retratos, mapa, composição e adaptação responsiva foram inspecionados.

A validação automática não equivale a certificação WCAG. Safari, Firefox e leitores de tela reais não foram testados nesta entrega. O domínio definitivo não foi fornecido: sitemap com URLs absolutas, canonical e OG URL serão gerados quando `SITE_URL` estiver configurado.

## Arquivos e informações ausentes

- Os seis avatares existentes foram preservados e usados. A fotografia original, possível sétimo avatar, não foi fornecida.
- O e-mail foi informado pelo autor após a entrega inicial e adicionado ao perfil, ao botão de envio e à ação de copiar.
- Mídias de projetos não descritos no README foram preservadas sem inventar conteúdo.
- Não foram criados resultados de pesquisa, métricas de adoção, certificações ou contribuições individuais além das documentadas.

## Alterações locais

Criados: configuração Astro/TypeScript/ESLint/Playwright, manifesto e lock de dependências, `src/`, `tests/`, documentação, identidade orbital e cópia do currículo em `public/documents/`. Atualizado: README técnico do portfólio. As imagens originais fornecidas e os arquivos da pasta `readme-profissional-github` não foram modificados.

O projeto está pronto para publicação estática posterior a partir de `dist/`, sob autorização do autor.

## Ajustes de contato e legibilidade — 15/11/2026

- E-mail informado pelo autor: `irlanbarros100@gmail.com`. Botão “Envie um e-mail” junto ao LinkedIn no desktop, com empilhamento no celular; endereço e ação de copiar também disponíveis. O destino `mailto:` foi conferido no navegador, sem enviar mensagem.
- Os seis subtítulos de seção agora exibem somente português.
- Fontes menores ampliadas na navegação, legendas, filtros, tags, contatos, diálogos e estudos de caso, incluindo os estilos responsivos.
- Tema claro com texto secundário mais escuro, bordas mais visíveis, sombras suaves e fundos próprios para prévias de projetos e diagramas.
- Build, testes de estado/integridade e Astro check aprovados (0 erros, avisos ou hints). Dos 18 cenários de navegador, 16 passaram na execução completa; os dois de acessibilidade detectaram uma legenda do grafo com pouco contraste no tema claro. Após corrigir a cor, ambos passaram em nova execução, incluindo home nos dois temas, seletor de avatar e paleta. Nenhuma falha pendente.
- Conferência adicional nos dois temas, em 320, 360, 393, 768, 1024, 1100, 1440 e 1920 px, sem overflow horizontal após atualização do layout.
- Inspeção visual de desktop e celular realizada sobre capturas reais. Exemplos: [contato claro](qa/contact-light.png), [início claro no celular](qa/light-mobile.png) e [contato claro no celular](qa/contact-light-mobile.png).

Alterações locais; sem deploy nesta atualização.
