# Novos álbuns da Galeria de Fotos

## Objetivo

Adicionar sete álbuns à Galeria de Fotos do site Serginho Barbosa, preservando integralmente a UI e a UX existentes. As novas imagens devem carregar com peso semelhante ao acervo atual, funcionar no grid responsivo e no lightbox e produzir hero sections coerentes com as páginas já publicadas.

## Escopo

Os álbuns serão adicionados depois dos oito álbuns atuais, mantendo os nomes recebidos como rótulos públicos:

1. `Carnaval 2026`
2. `Conserto Natal 2025`
3. `DVD Vander LIma - 2025`
4. `Feat - Venezuela, Cuba, Argentina`
5. `Festival Gastronómico 2024`
6. `Julifet 2026`
7. `Show Cenico Voz Companheira 2025`

Os nomes públicos não serão corrigidos ou reinterpretados nesta etapa. O mapeamento de rotas será:

- `Carnaval 2026` → `/galeria-de-fotos/carnaval-2026/13/`
- `Conserto Natal 2025` → `/galeria-de-fotos/conserto-natal-2025/14/`
- `DVD Vander LIma - 2025` → `/galeria-de-fotos/dvd-vander-lima-2025/15/`
- `Feat - Venezuela, Cuba, Argentina` → `/galeria-de-fotos/feat-venezuela-cuba-argentina/16/`
- `Festival Gastronómico 2024` → `/galeria-de-fotos/festival-gastronomico-2024/17/`
- `Julifet 2026` → `/galeria-de-fotos/julifet-2026/18/`
- `Show Cenico Voz Companheira 2025` → `/galeria-de-fotos/show-cenico-voz-companheira-2025/19/`

## Conteúdo excluído

Não serão publicados, copiados para `public/` nem adicionados ao Git:

- `Portfolio - Serginho Barbosa 2026.pdf`
- `Resumo Rellease  para o ANexo 2, edital 01.docx`

Das 52 imagens recebidas, nove são cópias exatas identificadas por SHA-256. Apenas uma ocorrência de cada par será processada, totalizando 43 fotos publicadas. Os arquivos de origem permanecerão intactos em `Atualizacoes/`; descartar significa excluí-los da publicação, não apagá-los do disco.

## Preservação da interface

Não haverá alteração estrutural nos componentes, no grid, no lightbox, nos breakpoints, na tipografia, nas cores ou nos espaçamentos atuais.

- A página continuará com duas colunas no mobile, três a partir de 740 px e quatro a partir de 1100 px.
- O lightbox continuará oferecendo teclado, swipe, filmstrip, legendas opcionais, limites sem loop e restauração de foco.
- As categorias continuarão como pills no desktop e dropdown até 960 px.
- Os novos álbuns serão anexados à lista atual para não alterar o álbum inicial nem o metadata da rota raiz.

## Imagens e desempenho

Cada foto única produzirá dois arquivos WebP:

- imagem completa: maior lado de até 1280 px, qualidade 78;
- miniatura: maior lado de até 600 px, qualidade 72.

A conversão usará redimensionamento Lanczos, removerá metadados e não ampliará imagens menores. Os nomes serão ASCII e determinísticos:

- `public/sites/serginho-barbosa/gallery-albums/full/<slug>-NN.webp`
- `public/sites/serginho-barbosa/gallery-albums/thumbs/<slug>-NN_400.webp`

As dimensões finais reais serão registradas em `media-pages-data.json`. A meta é manter imagens completas próximas da média atual de 90 KB e miniaturas próximas de 27 KB, sem sacrificar visualmente retratos e fotografias de palco.

## Hero sections

O comportamento visual existente será mantido: cada álbum terá uma imagem de banner preenchendo a hero com `object-fit: cover`.

- Álbuns com fotos horizontais usarão a melhor foto horizontal do próprio conjunto.
- `DVD Vander LIma - 2025` e `Feat - Venezuela, Cuba, Argentina`, que não possuem foto horizontal, receberão um WebP horizontal derivado de uma foto do próprio álbum, com recorte editorial centralizado e ajuste de posição quando necessário.
- Esses dois derivados serão usados somente como banner, não como fotos adicionais no grid.

Para suportar isso sem alterar o layout, o modelo de álbum aceitará um banner opcional. Na ausência dele, continuará valendo a regra atual de primeira foto horizontal e, depois, primeira foto do álbum.

## Dados, rotas e navegação

`media-pages-data.json` continuará sendo a fonte canônica dos álbuns e fotos. Cada novo álbum terá rótulo, slug, ID, banner opcional e fotos com `src`, `thumbnail`, `width`, `height` e legenda somente quando houver informação útil.

`generateStaticParams()` continuará derivando as rotas do JSON. A navegação global em `site-content.ts` receberá os mesmos sete nomes e URLs, na mesma ordem dos dados.

`Atualizacoes/` será ignorada pelo Git para impedir que originais, duplicatas e documentos entrem acidentalmente no repositório. Somente WebPs processados e alterações de código/dados serão versionados.

## Estratégia de testes

A implementação seguirá TDD:

1. Criar teste de integridade e executá-lo em estado vermelho.
2. Cobrir os sete álbuns, slugs/IDs únicos, álbuns não vazios, dimensões positivas, WebPs existentes e pares full/thumbnail.
3. Cobrir `getAlbumParams()` e `getAlbum()` para todas as novas rotas.
4. Cobrir o sincronismo entre dados da galeria e submenu global.
5. Cobrir o banner opcional e o fallback atual.
6. Manter os testes existentes do lightbox sem regressões.

Depois do ciclo vermelho-verde-refatoração, a verificação final executará:

- `npm test`;
- lint, typecheck e build com `NEXT_STATIC_EXPORT=1` e `NEXT_PUBLIC_BASE_PATH=/serginho-preview`;
- confirmação dos sete `index.html` exportados em `out/galeria-de-fotos/...`;
- QA visual desktop e mobile para banner, categorias, grid, lightbox, teclado e ausência de imagens quebradas.

## Fora do escopo

- Alterar a home, biografia, discografia, vídeos ou contatos.
- Redesenhar a galeria ou modificar sua identidade visual.
- Publicar o PDF ou o DOCX recebidos.
- Corrigir nomes dos álbuns fornecidos.
- Fazer push, merge ou publicação no GitHub Pages sem uma etapa posterior explícita.

## Critérios de aceite

- Os sete álbuns aparecem na galeria e no menu global com os nomes fornecidos.
- As 43 fotos únicas aparecem uma única vez e abrem corretamente no lightbox.
- Nenhuma das nove cópias exatas, nenhum original JPEG e nenhum dos dois documentos entra na publicação.
- Todas as novas imagens publicadas são WebP otimizadas, com versões full e thumbnail.
- As duas coleções sem paisagem têm banners horizontais próprios sem adicionar fotos artificiais ao grid.
- UI, UX e comportamento responsivo permanecem iguais aos atuais.
- Testes, lint, tipos, exportação estática e QA visual passam antes da entrega.
