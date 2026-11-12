# Design do site de Serginho Barbosa

## Identidade visual

A assinatura vermelha e as fotos de palco do artista dão continuidade à identidade. Instrument Serif foi aplicada aos títulos e Roboto aos textos, menus e campos. As duas fontes são servidas pelo projeto.

| Uso | Cor |
| --- | --- |
| Fundo de leitura | `#faf5ee` |
| Cards e campos | `#fffdf9` |
| Texto principal | `#271a1f` |
| Ação principal | `#ad2441` |
| Cabeçalhos de palco e rodapé | `#21121d` |
| Destaque em fundos escuros | `#efafba` |

O CSS compartilhado está em `src/components/sites/serginho-barbosa/site.css`. Os cards de discos usam `AlbumCard` na home e na discografia. O banner e o caminho de navegação são compartilhados pelas páginas internas. A busca, o orçamento, a newsletter e o formulário de Contatos usam `SiteInput` e `SiteTextarea`.

## Uso da uiux-base

Foram adaptados os padrões de variantes de botão, altura mínima dos controles, contorno dos campos e estados de foco da versão 0.2.0, de Daniel Riego. A implementação usa CSS local, os componentes de diálogo existentes e os elementos nativos de formulário. A distribuição integral da biblioteca declara app kit, Radix e TanStack como dependências. [Código e licença da uiux-base](https://github.com/danielriegoor/uiux-base)

## Checkpoint

O commit `0edcd53` e a tag `checkpoint/pre-redesign-2026-11-12` apontam para a réplica antes da revisão visual. A branch `master` preserva essa versão. A branch `redesign/serginho-barbosa` contém a versão redesenhada.
