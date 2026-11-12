# Páginas internas

As 29 páginas internas usam o mesmo cabeçalho, rodapé, contatos flutuantes, tipografia e paleta da página inicial. Abra [a prévia de Discografias](http://127.0.0.1:3100/discografias) para navegar. Os [arquivos de mídia das páginas internas](./assets-internos.json) estão mapeados por URL e dimensões, com caminhos relativos a `public/sites/serginho-barbosa/`.

## Rotas

| Página original | Rota local |
| --- | --- |
| [`/biografia`](https://www.serginhobarbosa.com.br/biografia) | `/biografia` |
| [`/carnaval`](https://www.serginhobarbosa.com.br/carnaval) | `/carnaval` |
| [`/discografias`](https://www.serginhobarbosa.com.br/discografias) | `/discografias` |
| [`/discografias/brilho-novo/10/c`](https://www.serginhobarbosa.com.br/discografias/brilho-novo/10/c) | `/discografias/brilho-novo/10/c` |
| [`/discografias/carnaval/4/c`](https://www.serginhobarbosa.com.br/discografias/carnaval/4/c) | `/discografias/carnaval/4/c` |
| [`/discografias/boleros/5/c`](https://www.serginhobarbosa.com.br/discografias/boleros/5/c) | `/discografias/boleros/5/c` |
| [`/discografias/mpb/6/c`](https://www.serginhobarbosa.com.br/discografias/mpb/6/c) | `/discografias/mpb/6/c` |
| [`/discografias/estilos-variados/9/c`](https://www.serginhobarbosa.com.br/discografias/estilos-variados/9/c) | `/discografias/estilos-variados/9/c` |
| [`/discografias/samba-enredo/7/c`](https://www.serginhobarbosa.com.br/discografias/samba-enredo/7/c) | `/discografias/samba-enredo/7/c` |
| [`/discografias/hinos/8/c`](https://www.serginhobarbosa.com.br/discografias/hinos/8/c) | `/discografias/hinos/8/c` |
| [`/videos`](https://www.serginhobarbosa.com.br/videos) | `/videos` |
| [`/galeria-de-fotos`](https://www.serginhobarbosa.com.br/galeria-de-fotos) | `/galeria-de-fotos` |
| [`/galeria-de-fotos/banda-circo-dos-amores-carnaval/12`](https://www.serginhobarbosa.com.br/galeria-de-fotos/banda-circo-dos-amores-carnaval/12) | `/galeria-de-fotos/banda-circo-dos-amores-carnaval/12` |
| [`/galeria-de-fotos/semi-final-concurso-marchinhas-mestre-jonas-2019/11`](https://www.serginhobarbosa.com.br/galeria-de-fotos/semi-final-concurso-marchinhas-mestre-jonas-2019/11) | `/galeria-de-fotos/semi-final-concurso-marchinhas-mestre-jonas-2019/11` |
| [`/galeria-de-fotos/bloquinho-esmukids-contagem/10`](https://www.serginhobarbosa.com.br/galeria-de-fotos/bloquinho-esmukids-contagem/10) | `/galeria-de-fotos/bloquinho-esmukids-contagem/10` |
| [`/galeria-de-fotos/lancamento-cd-circo-dos-amores-2019/5`](https://www.serginhobarbosa.com.br/galeria-de-fotos/lancamento-cd-circo-dos-amores-2019/5) | `/galeria-de-fotos/lancamento-cd-circo-dos-amores-2019/5` |
| [`/galeria-de-fotos/ensaio-fotografico-palhaco-dos-amores/7`](https://www.serginhobarbosa.com.br/galeria-de-fotos/ensaio-fotografico-palhaco-dos-amores/7) | `/galeria-de-fotos/ensaio-fotografico-palhaco-dos-amores/7` |
| [`/galeria-de-fotos/carnaval/4`](https://www.serginhobarbosa.com.br/galeria-de-fotos/carnaval/4) | `/galeria-de-fotos/carnaval/4` |
| [`/galeria-de-fotos/circuito-vdl-lancamento-voz-companheira/9`](https://www.serginhobarbosa.com.br/galeria-de-fotos/circuito-vdl-lancamento-voz-companheira/9) | `/galeria-de-fotos/circuito-vdl-lancamento-voz-companheira/9` |
| [`/galeria-de-fotos/julifest-2018/8`](https://www.serginhobarbosa.com.br/galeria-de-fotos/julifest-2018/8) | `/galeria-de-fotos/julifest-2018/8` |
| [`/contatos`](https://www.serginhobarbosa.com.br/contatos) | `/contatos` |
| [`/discografias/branco-verde-vermelho-e-preto/9`](https://www.serginhobarbosa.com.br/discografias/branco-verde-vermelho-e-preto/9) | `/discografias/branco-verde-vermelho-e-preto/9` |
| [`/discografias/brilho-novo/11`](https://www.serginhobarbosa.com.br/discografias/brilho-novo/11) | `/discografias/brilho-novo/11` |
| [`/discografias/circo-dos-amores/4`](https://www.serginhobarbosa.com.br/discografias/circo-dos-amores/4) | `/discografias/circo-dos-amores/4` |
| [`/discografias/coletanea/7`](https://www.serginhobarbosa.com.br/discografias/coletanea/7) | `/discografias/coletanea/7` |
| [`/discografias/voz-companheira/6`](https://www.serginhobarbosa.com.br/discografias/voz-companheira/6) | `/discografias/voz-companheira/6` |
| [`/discografias/verde-rosa-branco-e-alegria/8`](https://www.serginhobarbosa.com.br/discografias/verde-rosa-branco-e-alegria/8) | `/discografias/verde-rosa-branco-e-alegria/8` |
| [`/discografias/uma-historia-de-amor/5`](https://www.serginhobarbosa.com.br/discografias/uma-historia-de-amor/5) | `/discografias/uma-historia-de-amor/5` |
| [`/discografias/trajetoria/10`](https://www.serginhobarbosa.com.br/discografias/trajetoria/10) | `/discografias/trajetoria/10` |

## Implementação e comparação

- `src/app/layout.tsx` compartilha a navegação. `inner-banner.tsx` aplica o banner original de cada seção e `inner-banner-links.tsx` renderiza a lista de categorias que se recolhe no celular.
- `editorial-content.tsx` contém os artigos de Biografia e Carnaval. `editorial-contact.tsx` valida os campos e prepara um rascunho para o aplicativo de e-mail.
- `discography-*` contém catálogo, busca local, categorias e oito detalhes. A busca ignora diferenças de acentuação e mantém o termo na URL.
- `media-pages.tsx` reúne 21 vídeos e oito álbuns com 123 fotos. `gallery-album.tsx` renderiza o visualizador local com miniaturas, setas, gesto e Escape.
- A 1280 × 800, a faixa de Discografias mediu 435 px em ambas as versões, com o título a 255 px do topo. No mosaico de vídeos, as posições de seis cartões de referência coincidiram após o ajuste de espaçamento. A foto aberta de Julifest manteve as dimensões originais de 400 × 600 px.
- A 390 × 844, o banner de categoria mediu 418 px nas duas versões. Foram testadas a lista recolhível, a navegação pelo menu lateral e a validação de Contatos.
- Os formulários de contato e newsletter não têm um serviço local de envio. Contatos prepara um rascunho de e-mail. O cadastro de novidades encaminha ao site oficial. O carregamento dos players depende de YouTube e Spotify. Os modais de vídeo e as páginas de discos com player oferecem links diretos.
- `npm test` passou os 11 testes e `npm run check` passou no ESLint, TypeScript e build. As 30 rotas, incluindo a inicial, responderam HTTP 200. Todos os links locais renderizados corresponderam ao mapa.
