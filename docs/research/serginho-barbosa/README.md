# Serginho Barbosa

## Rota e arquivos

A página inicial de [serginhobarbosa.com.br](https://www.serginhobarbosa.com.br/) foi recriada em `/`, com [as páginas internas do menu](./paginas-internas.md) nos caminhos originais. Execute `npm run dev -- --hostname 127.0.0.1 --port 3100` e acesse [a prévia](http://127.0.0.1:3100/).

- `src/app/page.tsx` organiza a página. `src/components/sites/serginho-barbosa/` contém a navegação, as seções, os estilos e os controles.
- `public/sites/serginho-barbosa/` contém a marca, banners, capas, fundos, fotos, miniaturas e a fonte.
- Os links para biografia, carnaval, categorias e álbuns, galeria, vídeos e contatos abrem as rotas locais.

## Comparação visual e interações

- Desktop a 1280 × 800. Conferidos cabeçalho, carrossel, colunas de álbuns, seções de texto, mosaicos, orçamento, newsletter, FAQ e rodapé. As grades de vídeos e fotos mediram 766 e 916 px de altura por seção, como no original.
- Celular a 390 × 844. Conferidos logotipo sobre o banner, menu lateral, capas empilhadas e posição dos botões flutuantes. O banner mediu 139 px, como no original. Há pequenas diferenças verticais nas seções de texto. Sem rolagem horizontal a 390, 1024, 1280 e 1600 px.
- A fonte é Roboto, com títulos em peso 900 e a cor de destaque `#ff2241`. Foram reutilizadas as imagens originais e suas proporções.
- Verificados os controles do carrossel, a navegação móvel com Escape, a abertura do vídeo, múltiplas respostas do FAQ e a validação local do orçamento.
- A seleção de vídeos e a ordem do FAQ foram fixadas a partir de uma observação do original, que varia a cada recarga. O YouTube recusou dois embeds na prévia local. O modal disponibiliza o link direto do vídeo.
- O orçamento valida os campos na prévia e leva à página local de Contatos. O cadastro de novidades oferece o link do site oficial para a inscrição.

## Arquivos de origem

| Caminho sob `public/sites/serginho-barbosa/` | Dimensões | Origem |
| --- | --- | --- |
| `logo.webp` | 405 × 83 | https://d4polyhz8pjtz.cloudfront.net/2578/logo-20181204082003.webp |
| `slide-brilho-novo.png` | 1660 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/1-20231002134721.png |
| `slide-youtube.png` | 1660 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/3-20231002134913.png |
| `slide-radio.png` | 1660 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/2-20231002134822.png |
| `slide-boleros.webp` | 1920 × 730 | https://d4polyhz8pjtz.cloudfront.net/2578/231933f23e4726fe71ea183f8d818834-20190117200626.webp |
| `slide-carnaval.webp` | 1920 × 730 | https://d4polyhz8pjtz.cloudfront.net/2578/82106ccebf685f8554c020e017d2fe9a-20190117191241.webp |
| `slide-circo.webp` | 1920 × 730 | https://d4polyhz8pjtz.cloudfront.net/2578/cropimage-20190117194252.webp |
| `album-hinos.webp` | 400 × 401 | https://d4polyhz8pjtz.cloudfront.net/2578/Branco-Verde-Vermelho-e-Pret-20190117214153_400.webp |
| `album-brilho-novo.png` | 400 × 400 | https://d4polyhz8pjtz.cloudfront.net/2578/Brilho-Novo-20231003150428_400.png |
| `album-circo.webp` | 400 × 342 | https://d4polyhz8pjtz.cloudfront.net/2578/Circo-dos-Amores-20190117203143_400.webp |
| `album-coletanea.webp` | 468 × 400 | https://d4polyhz8pjtz.cloudfront.net/2578/Coletanea-20190117213333_400.webp |
| `fundo-biografia.png` | 1522 × 560 | https://d4polyhz8pjtz.cloudfront.net/2578/7b51bbd169ea1d6a6a4aba69a9e470da-20231002140031.png |
| `fundo-carnaval.png` | 1522 × 560 | https://d4polyhz8pjtz.cloudfront.net/2578/00c2cfc439ffabd90af9df20c2384d19-20231003155154.png |
| `favicon.webp` | 405 × 419 | https://d4polyhz8pjtz.cloudfront.net/2578/favicon-20181204082004.webp |
| `videos/_Jou5h-7ndM.jpg` | 480 × 360 | https://i3.ytimg.com/vi/_Jou5h-7ndM/0.jpg |
| `videos/dbpqoQoFrJE.jpg` | 480 × 360 | https://i3.ytimg.com/vi/dbpqoQoFrJE/0.jpg |
| `videos/F5I2loKD-AE.jpg` | 480 × 360 | https://i3.ytimg.com/vi/F5I2loKD-AE/0.jpg |
| `videos/EM-mMv1MDEk.jpg` | 480 × 360 | https://i3.ytimg.com/vi/EM-mMv1MDEk/0.jpg |
| `videos/JsnJ4BEOISs.jpg` | 480 × 360 | https://i3.ytimg.com/vi/JsnJ4BEOISs/0.jpg |
| `gallery/Julifest-2018-20190206225457.webp` | 400 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/Julifest-2018-20190206225457.webp |
| `gallery/Julifest-2018-20190206225801.webp` | 900 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/Julifest-2018-20190206225801.webp |
| `gallery/Julifest-2018-20190206225542.webp` | 900 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/Julifest-2018-20190206225542.webp |
| `gallery/Julifest-2018-20190206225859.webp` | 400 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/Julifest-2018-20190206225859.webp |
| `gallery/Julifest-2018-20190206225909.webp` | 900 × 600 | https://d4polyhz8pjtz.cloudfront.net/2578/Julifest-2018-20190206225909.webp |
| `videos/play.png` | 64 × 64 | https://constru.site/components/modelos-CMS/9/images/icone-player.png |

- `roboto-latin.woff2` foi obtida do [Google Fonts](https://fonts.gstatic.com/s/roboto/v51/KFO7CnqEu92Fr1ME7kSn66aGLdTylUAMa3yUBA.woff2), com eixo de peso de 100 a 900. A licença está em `roboto-OFL.txt`.
- `construsite.png` (40 × 25) foi extraída da imagem inline do rodapé do site original.
