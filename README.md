# Serginho Barbosa

Prévia do site do cantor, compositor e ator Serginho Barbosa.

## Desenvolvimento

Use Node.js 24 e execute `npm ci`. `npm run dev` abre a versão local. `npm test` roda os testes e `npm run check` verifica lint, tipos e build.

O conteúdo das páginas está em `src/app/`. Os componentes e dados compartilhados ficam em `src/components/sites/serginho-barbosa/`. As imagens, capas e fontes estão em `public/sites/serginho-barbosa/`.

## Publicação

O workflow GitHub Pages exporta as páginas para `out/`. A branch `main` publica em [t-riego.github.io/serginho-preview](https://t-riego.github.io/serginho-preview/). A configuração do repositório usa GitHub Actions como fonte do Pages. Alterações na branch principal passam pelo build estático antes da publicação.

Para reproduzir o build do Pages localmente, defina `NEXT_STATIC_EXPORT=1` e `NEXT_PUBLIC_BASE_PATH=/serginho-preview` antes de executar `npm run check`. A busca da discografia usa o parâmetro `search` da URL no navegador.

Projeto iniciado com o [AI Website Cloner Template](https://github.com/JCodesMore/ai-website-cloner-template). O arquivo [LICENSE](LICENSE) mantém a licença do template.
