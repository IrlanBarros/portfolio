# Irlan Barros · Developer Odyssey

Portfólio estático autoral, com navegação profissional e exploração opcional. O conteúdo vem do README de perfil fornecido, preservado em [`docs/profile-source.md`](docs/profile-source.md). Este README documenta a implementação.

## Executar

```bash
npm ci
npm run dev
```

Abra a URL indicada pelo Astro (normalmente `http://127.0.0.1:4321`). Para revisar a versão compilada:

```bash
npm run build
npm run preview
```

Use Node 24 (`.nvmrc`). O projeto também inclui Node 24 como dependência **de desenvolvimento**: `npm run` usa esse executável local, sem alterar o Node do sistema. Não existe runtime Node na saída publicada. Em ambientes com configuração de usuário somente leitura, prefixe comandos Astro com `ASTRO_TELEMETRY_DISABLED=1`.

O Astro 7 pode manter a prévia em segundo plano. Consulte com `npm exec -- astro preview status` e encerre com `npm exec -- astro preview stop`.

## Experiência e arquitetura

- Astro 7, TypeScript e CSS em camadas; HTML completo com aprimoramento progressivo.
- Identidade em grafite e verde suave, mapa orbital em SVG e fontes Manrope/IBM Plex Mono servidas localmente.
- Dois modos sobre os mesmos dados: Exploração e Profissional, preservando o contexto da navegação.
- Seis estudos de caso, filtros, imagens reais, competências relacionadas a evidências, trajetória, formação e pesquisa.
- Seis avatares sincronizados, seletor acessível, restauração, fallback e persistência independente.
- Paleta `Ctrl+K` / `Cmd+K`: seções, projetos, competências, tema, modo, avatar e currículo; setas, Enter e Escape.
- Progresso e cinco conquistas da visita; sinal opcional no rodapé; nada bloqueia conteúdo.
- Temas sistema → escuro → claro; teclado, movimento reduzido e conteúdo sem JavaScript.
- Currículo original em PDF, LinkedIn e perfil GitHub identificado nos links de autoria.

Interações usam APIs nativas (`dialog`, `IntersectionObserver`, `localStorage`), sem React ou biblioteca de animação: os fluxos atuais não exigem esse custo adicional. Ícones são SVG locais. Não há backend, banco de dados, autenticação, cookies de análise, serviços pagos ou consulta à API GitHub em tempo de execução.

## Estrutura

```text
assets/images/
  brand/                    # Símbolo orbital / favicon
  profile/                  # Seis retratos originais
  projects/                 # Mídias fornecidas
docs/
  profile-source.md         # Fonte editorial preservada
  validation.md             # Verificações e limites da entrega
public/documents/           # Currículo PDF
src/
  components/               # Avatar, ícones e diálogos
  data/portfolio.ts         # Perfil, projetos, habilidades e trajetória
  data/avatars.ts           # Catálogo tipado dos retratos
  layouts/Layout.astro      # HTML, SEO, navegação e rodapé
  pages/index.astro         # Experiência principal
  pages/projetos/[slug].astro # Páginas geradas dos dados
  pages/404.astro           # Página não encontrada
  pages/robots.txt.ts       # Robots gerado
  pages/sitemap.xml.ts      # Sitemap condicionado ao domínio
  scripts/app.ts           # Interações progressivas
  scripts/state.ts         # Validação e persistência
  scripts/image-service.ts # Tratamento de pixel art no Sharp
  styles/global.css        # Tokens, componentes e responsividade
tests/                     # Estado, build e navegador
dist/                      # Saída gerada; não editar
```

## Atualizar perfil e projetos

Edite `src/data/portfolio.ts`. `profile`, `experience`, `education` e `skillGroups` centralizam as informações.

1. Coloque imagens em `assets/images/projects/`, em kebab-case ou numa pasta com o slug do projeto.
2. Importe a imagem e acrescente uma entrada ao array `projects`, seguindo a interface `Project`.
3. Defina um `slug` exclusivo, problema, arquitetura, funcionalidades, estado real e participação. Use somente informações verificáveis.
4. Preencha `demo`, `repository`, `image` e `gallery` apenas quando existirem. Para projetos sem captura, ajuste a apresentação editorial em `index.astro`; nunca use imagens de outro produto.
5. `diagram` descreve elementos conceituais documentados, não necessariamente um fluxo de execução.
6. Execute check, lint, build e testes.

Páginas, filtros, paleta e sitemap derivam do array. `relatedProjects()` relaciona tecnologias listadas em `tech`; associações conceituais adicionais entram em `skillProjectLinks` somente com evidência. Novas categorias de projetos devem entrar no tipo `Category`.

Preserve o estado metodológico da pesquisa até existirem novas informações. A contribuição documentada em PokeGrafo é DFS e identificação do vértice mais distante; FlowCount é trabalho em equipe.

## Currículo e contatos

- Substitua `public/documents/irlan-barros-curriculo.pdf` por um PDF real ou altere `profile.resume`.
- Edite `profile.linkedin` e `profile.github` para atualizar links.
- `profile.email` contém o e-mail informado pelo autor: `irlanbarros100@gmail.com`. O contato oferece envio por `mailto:` e cópia do endereço. Falhas da Clipboard API exibem uma alternativa textual.
- O e-mail do currículo não foi promovido automaticamente a contato do site, seguindo a restrição editorial do pedido.
- Não há formulário com envio simulado.

## Avatares

`src/data/avatars.ts` centraliza `id`, `name`, `image`, `alt`, `position`, `pixelated` e `order`. O padrão é `ilustracao-azul`.

Os seis arquivos foram inspecionados visualmente. **A fotografia original, sétima opção citada no briefing, não foi fornecida.** Nenhuma referência fictícia foi criada.

Para substituir/adicionar:

1. Guarde o original em `assets/images/profile/`, com nome em kebab-case e extensão real. Não apenas renomeie extensões.
2. Importe o arquivo e atualize o catálogo. IDs estáveis preservam preferências.
3. Configure enquadramento CSS e `pixelated`. Pixel art usa o prefixo `avatar-pixel-art-`, reconhecido pelo serviço para produzir WebP lossless com nearest-neighbor.
4. Ajuste `defaultAvatarId` se necessário. Há fallback para a primeira imagem local disponível.
5. Atualize a quantidade esperada no teste de catálogo quando um novo arquivo for fornecido.

O Astro importa as imagens da raiz e gera variantes em `dist/_astro/`; não há segunda cópia manual em `public/`. O padrão aparece no HTML. Miniaturas de 160px são solicitadas ao abrir o seletor; o retrato escolhido usa 640px. Dimensões são fixas, o tema e o modo permanecem independentes, e imagens de projeto/metadados não mudam. Falhas de carregamento percorrem as opções restantes sem loop infinito.

## Estado local

| Chave | Conteúdo |
| --- | --- |
| `irlan-odyssey:avatar` | Somente o ID do avatar |
| `irlan-odyssey:theme` | `system`, `dark` ou `light` |
| `irlan-odyssey:mode` | `exploration` ou `professional` |
| `irlan-odyssey:progress` | IDs de seções, conquistas e estilos experimentados |

Dados inválidos/bloqueados são tolerados. Seções precisam ficar visíveis por pelo menos 1,2 segundo. Projetos abertos e habilidades selecionadas geram conquistas reais da visita. Reiniciar progresso preserva as demais preferências. O modo profissional pausa novas conquistas e oculta gamificação.

## SEO e publicação futura

Defina `SITE_URL` em `.env` ou no ambiente do build **quando o domínio for conhecido**. Recompile após a alteração. Sem domínio, canonical e OG URL não são inventados; o sitemap fica com `urlset` vazio e robots não o anuncia.

Publique apenas `dist/` em hospedagem estática. Inclui HTML, assets, PDF, `404.html`, robots e sitemap. Não use fallback SPA para todas as rotas: os estudos já são páginas reais e URLs desconhecidas devem responder 404. Nenhum deploy ou push foi realizado nesta entrega.

SEO inclui títulos, descrições, Open Graph, Twitter Card, JSON-LD `Person`, idioma, favicon e URLs legíveis. O retrato de compartilhamento é fixo. A UFCA é apresentada como formação em andamento.

## Verificação

```bash
npm run check
npm run lint
npm run build
npm test
npm exec -- playwright install chromium
npm run test:e2e
```

`npm test` depende de `dist/`. Playwright cobre desktop, celular, teclado, avatares, persistência, filtros, progresso, temas, modos, ausência de JavaScript, armazenamento bloqueado, imagens e tamanhos de 320 a 1920px. Axe audita os dois temas e o seletor. Capturas ficam em `test-results/`.

Para cache temporário do Chromium, use `PLAYWRIGHT_BROWSERS_PATH=/tmp/portfolio-playwright` tanto na instalação quanto nos testes. Resultados executados e medições estão em `docs/validation.md`. Auditorias automáticas não substituem revisão completa com leitores de tela e outros navegadores.

## Decisões editoriais

- `projeta-ufca.png` mantém o nome original; a inspeção confirmou uma captura do Planeja UFCA.
- Mídias de History Fork e Probabilidado foram preservadas, sem criar projetos ausentes do README.
- Não foram inventados datas de projetos, métricas, certificações, níveis ou resultados científicos.
- Links não fornecidos não viraram botões fictícios.
- Fotografia original, e-mail explícito no README e domínio seguem configuráveis.

## Referências

[Versões do Astro](https://docs.astro.build/en/upgrade-astro/) · [Migração para Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/).

Manrope e IBM Plex Mono são servidas pelos pacotes Fontsource com suas licenças. Retratos e capturas foram fornecidos pelo autor. A identidade orbital e os elementos vetoriais foram desenhados no código.
