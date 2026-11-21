# Portfólio com visualizador interno progressivo

## Objetivo

Adicionar o portfólio de Serginho Barbosa ao site por uma rota interna `/portfolio`, preservando a identidade visual e oferecendo navegação fluida em desktop e celular. O visitante poderá visualizar as 70 páginas do material dentro do site, sem botão de download e sem incorporar o PDF pesado diretamente no navegador.

## Fonte e escopo

- Fonte: `Atualizacoes/drive-download-20261120T133846Z-1-001/Portfolio - Serginho Barbosa 2026.pdf`.
- O PDF possui 70 páginas horizontais em proporção 16:9 e aproximadamente 105 MB.
- O arquivo original permanece como fonte local e não será copiado para `public/`.
- Cada página será convertida para imagens WebP responsivas e carregada sob demanda.
- O conteúdo e o desenho de cada página devem permanecer fiéis ao PDF.
- Não haverá botão, link ou chamada para baixar o portfólio.
- A mudança não inclui uma reconstrução integral do portfólio em HTML nem alterações no conteúdo editorial do documento.

## Navegação do site

- Adicionar `Portfólio` ao menu principal imediatamente após `Biografia`.
- O item apontará para `/portfolio` e usará o mesmo estado ativo das demais rotas.
- A fonte única de navegação continuará alimentando o cabeçalho desktop, o menu móvel e o bloco `Acesso Rápido` do rodapé.
- Alterar o breakpoint do menu móvel de 960 para 1100 px para impedir sobreposição do novo item em larguras intermediárias, sem reduzir tipografia ou espaçamentos existentes.

## Página interna

- Criar a rota estática `/portfolio` com metadados próprios.
- Reutilizar o shell, o breadcrumb, a hero interna, o cabeçalho e o rodapé já usados nas demais páginas.
- Reutilizar `editorial/biografia-retrato.webp` na hero da rota, com posição `center 35%` em desktop e mobile, evitando criar ou duplicar outro asset de banner.
- Usar o título `Portfólio` e a introdução: `Conheça a trajetória artística de Serginho Barbosa como cantor, ator, compositor, locutor e produtor. Navegue pelas páginas para acompanhar seus projetos, apresentações e realizações.`
- Inserir o visualizador logo após a introdução, dentro da largura e dos espaçamentos do design atual.
- Não adicionar estilos globais que alterem outras páginas.

## Visualizador

- Exibir uma página do portfólio por vez, mantendo a proporção 16:9 e sem cortes.
- Oferecer botões `Anterior` e `Próxima`, contador `Página N de 70`, navegação pelas setas do teclado quando o visualizador estiver em foco e gesto horizontal de pelo menos 48 px, com deslocamento horizontal predominante, em telas sensíveis ao toque.
- Desabilitar `Anterior` na primeira página e `Próxima` na última.
- Carregar a página 1 com prioridade e, após sua exibição, pré-carregar somente a página 2. Em cada avanço sequencial, solicitar no máximo uma nova página ainda ausente, a próxima da sequência; a página anterior permanecerá disponível pelo cache. Não haverá prefetch em lote.
- Não carregar automaticamente as 70 páginas, nem criar um `iframe` de PDF.
- Usar uma transição de opacidade de 160 ms entre páginas e removê-la quando `prefers-reduced-motion: reduce` estiver ativo.
- Reservar o espaço 16:9 antes da imagem chegar para evitar mudança brusca de layout.
- Em caso de falha de uma imagem, manter os controles disponíveis e exibir uma mensagem localizada no quadro, sem quebrar o restante da página.

## Imagens e pipeline

- Gerar duas variações por página: `960 × 540` para telas compactas e `1600 × 900` para desktop.
- Usar nomes determinísticos com três dígitos, por exemplo `page-001-960.webp` e `page-001-1600.webp`.
- Armazenar os arquivos em `public/sites/serginho-barbosa/portfolio/pages/`.
- Exportar em WebP sRGB, sem metadados desnecessários e com nitidez suficiente para preservar textos e fotografias.
- Usar `srcset` e `sizes` para que o navegador selecione a menor imagem adequada à tela.
- Buscar até 180 KB por página compacta e até 300 KB por página desktop, com limites máximos de 250 KB e 400 KB, respectivamente. Se uma página exceder o alvo para preservar legibilidade, ela ainda deverá respeitar o limite máximo.
- Criar um script reproduzível para renderizar e otimizar as páginas a partir de um caminho de PDF informado na execução; nenhum caminho absoluto da máquina será gravado no código.
- Manter um manifesto com as 70 páginas, seus arquivos e textos alternativos descritivos baseados no título ou conteúdo principal de cada página.

## Acessibilidade e SEO

- Definir título e descrição específicos para a rota.
- Usar região nomeada para o visualizador e anunciar a mudança do contador sem interromper a navegação.
- Garantir foco visível, ordem de tabulação previsível e nomes acessíveis para todos os controles.
- Fornecer texto alternativo significativo para cada página, em vez de usar somente o número.
- Manter contraste, tamanhos mínimos de toque e comportamento de teclado coerentes com os componentes atuais.
- A introdução em HTML fornecerá contexto indexável; o conteúdo integral continuará sendo uma experiência visual fiel ao documento original.

## Componentes e dados

- A rota será responsável por metadados e composição da página.
- Um componente de página reutilizará a estrutura visual interna existente.
- Um componente cliente isolado controlará página atual, teclado, gesto, pré-carregamento e estados de erro.
- Um manifesto separado concentrará a lista de assets e textos alternativos, permitindo validação automática sem misturar conteúdo com comportamento.
- A conversão do PDF ficará em um script independente e não fará parte do runtime do site.

## Verificação

- Validar que o menu mostra `Portfólio` após `Biografia` no desktop, no menu móvel e no rodapé.
- Testar que o menu móvel é usado em 960, 1024 e 1100 px e que o menu desktop permanece sem overflow em 1101 e 1280 px.
- Testar primeira página, última página, botões desabilitados, contador, teclado, gesto e recuperação de erro.
- Verificar que o primeiro carregamento solicita somente as páginas 1 e 2 e que cada avanço sequencial solicita no máximo a próxima página ainda ausente, sem prefetch em lote.
- Conferir as 70 páginas renderizadas contra o PDF, incluindo capa, páginas com texto denso, fotografias, certificados e contato.
- Validar dimensões, proporção, duplicidade, nomes e limites de peso de todos os assets.
- Executar a suíte completa, lint, TypeScript e build estático.
- Abrir a prévia local em desktop e mobile para aprovação antes de qualquer deploy.

## Critérios de aceitação

1. `Portfólio` aparece após `Biografia` e abre `/portfolio` sem sair do site.
2. A página mantém o padrão visual atual de hero interna, conteúdo, cabeçalho e rodapé.
3. As 70 páginas podem ser visualizadas em ordem, sem botão ou link de download.
4. O PDF de aproximadamente 105 MB não é publicado nem carregado pelo navegador.
5. A primeira visualização carrega somente os assets necessários, e as demais páginas são carregadas progressivamente.
6. Textos e fotografias permanecem nítidos em desktop e celular, sem cortes ou deformações.
7. Controles funcionam por clique, teclado e gesto, com estados de limite e foco acessíveis.
8. O novo item não causa sobreposição no menu em nenhuma largura suportada.
9. Outras páginas, rotas e estilos permanecem inalterados.
10. Testes, lint, TypeScript e build estático terminam sem erros.

## Fora de escopo

- Download público do PDF.
- `iframe` ou visualizador nativo de PDF.
- Recriação semântica das 70 páginas em HTML.
- Edição do conteúdo, fotografias ou identidade visual do portfólio.
- Autenticação, bloqueio de cópia ou DRM; a ausência de download significa somente que não haverá uma ação explícita de baixar no site.
