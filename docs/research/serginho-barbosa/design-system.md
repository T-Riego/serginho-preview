# Design do site de Serginho Barbosa

## Identidade visual

A assinatura vermelha e as fotos de palco do artista dão continuidade à identidade. Instrument Serif foi aplicada aos títulos, Roboto aos textos, menus e campos, e Instrument Sans aos botões das seções Discografias e Galeria de Fotos. As fontes são servidas pelo projeto.

| Uso | Cor |
| --- | --- |
| Fundo de leitura | `#faf5ee` |
| Cards e campos | `#fffdf9` |
| Texto principal | `#271a1f` |
| Ação principal | `#ad2441` |
| Molduras de Discografias e Galeria de Fotos | `#a7203e` |
| Cabeçalhos de palco e rodapé | `#21121d` |
| Destaque em fundos escuros | `#efafba` |

O CSS compartilhado está em `src/components/sites/serginho-barbosa/site.css`. Os cards de discos usam `AlbumCard` na home e na discografia. O banner e o caminho de navegação são compartilhados pelas páginas internas. A busca, o orçamento, a newsletter e o formulário de Contatos usam `SiteInput` e `SiteTextarea`.

Na home, Discografias e Galeria de Fotos usam a moldura vermelha ao redor do título, com o botão separado e alinhado à direita da grade.

## Hero e imagens das páginas internas

A hero abre com a foto de Serginho sob luz roxa e alterna os seis destaques do site original. A composição combina títulos editoriais e fotos de palco, com capas inteiras para os discos e o selo da Voz Companheira. A navegação por miniaturas permite escolher um destaque e os controles permitem pausar a rotação. [Referência de direção visual no Dribbble](https://dribbble.com/shots/27142628-Personal-Branding-Website-UI-Design-for-Music-Artist)

Os cabeçalhos internos usam fotos do acervo por seção, capas na discografia e fotos dos respectivos álbuns da galeria. O enquadramento muda no celular para preservar o assunto da imagem e deixar o título legível.

## Uso da uiux-base

Foram adaptados os padrões de variantes de botão, altura mínima dos controles, contorno dos campos e estados de foco da versão 0.2.0, de Daniel Riego. A implementação usa CSS local, os componentes de diálogo existentes e os elementos nativos de formulário. A distribuição integral da biblioteca declara app kit, Radix e TanStack como dependências. [Código e licença da uiux-base](https://github.com/danielriegoor/uiux-base)

## Checkpoint

O commit `0edcd53` e a tag `checkpoint/pre-redesign-2026-11-12` apontam para a réplica antes da revisão visual. A branch `master` preserva essa versão. A branch `redesign/serginho-barbosa` contém a versão redesenhada.
