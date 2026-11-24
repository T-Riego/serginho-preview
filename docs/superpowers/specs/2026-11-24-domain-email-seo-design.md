# Domínio, e-mail e SEO de produção

## Objetivo

Publicar o site em `https://www.serginhobarbosa.com.br`, manter o código e o deploy no GitHub Pages, mover o DNS autoritativo para o serviço gratuito do Registro.br e encaminhar todas as novas mensagens `@serginhobarbosa.com.br` para `barbosavozcompanheira@gmail.com`.

## Decisões aprovadas

- O domínio canônico será `www.serginhobarbosa.com.br`; o domínio sem `www` será atendido pelo GitHub Pages e direcionado ao canônico.
- O site continuará estático no GitHub Pages.
- O DNS avançado gratuito do Registro.br substituirá os nameservers da ESInet.
- O ImprovMX Free fará somente o recebimento, com alias catch-all `*` encaminhado ao Gmail aprovado.
- As respostas sairão como `barbosavozcompanheira@gmail.com`; não haverá SMTP nem caixa postal no domínio.
- A ESInet permanecerá ativa durante a transição e só poderá ser cancelada após site, HTTPS e e-mail permanecerem estáveis por 48 a 72 horas.

## Site e deploy

- O build de produção usará exportação estática sem `basePath`, pois o site passará a responder na raiz do domínio personalizado.
- O artefato conterá o domínio personalizado esperado pelo GitHub Pages.
- Desenvolvimento local continuará sem prefixo de rota.
- O preview legado em `/serginho-preview` não é a URL canônica depois do corte.

## Zona DNS final

- Quatro registros `A` no apex apontarão para os endereços oficiais do GitHub Pages.
- `www` será um `CNAME` para `t-riego.github.io`.
- Os registros `MX` serão os fornecidos pelo ImprovMX.
- Haverá somente um registro SPF no apex, correspondente ao serviço efetivamente usado.
- Será publicado DMARC inicialmente em monitoramento, sem bloquear mensagens legítimas.
- Registros antigos de `mail`, `webmail`, `smtp`, MX e SPF da ESInet não serão copiados para a zona final.

## SEO e descoberta

- O domínio canônico será declarado nos metadados.
- O site terá `robots.txt`, `sitemap.xml`, Open Graph, Twitter Card e dados estruturados coerentes com o conteúdo existente.
- Nenhum fato biográfico, prêmio, perfil ou rede social será inventado.
- O site ficará pronto para verificação posterior no Google Search Console e Bing Webmaster Tools.

## Corte e retorno

1. Salvar a configuração pública atual e manter a ESInet respondendo.
2. Preparar o domínio personalizado e o build sem `basePath` no GitHub Pages.
3. Criar e verificar o destino no ImprovMX, configurar o catch-all e obter os registros exatos.
4. Trocar para DNS do Registro.br e publicar toda a zona avançada na mesma janela.
5. Testar apex, `www`, HTTPS, páginas, imagens e mensagens enviadas para um endereço conhecido e outro aleatório do domínio.
6. Em caso de falha, corrigir a zona do Registro.br; se necessário, restaurar temporariamente os registros públicos antigos da ESInet.

## Critérios de aceitação

1. `https://www.serginhobarbosa.com.br` abre o site completo, responsivo e sem caminhos `/serginho-preview` nos assets.
2. O domínio sem `www` chega ao site canônico com HTTPS válido.
3. Uma mensagem enviada para qualquer endereço do domínio chega ao Gmail aprovado.
4. Respostas podem sair normalmente pelo endereço Gmail.
5. `robots.txt`, `sitemap.xml`, canonical e dados sociais usam o domínio de produção.
6. Testes, lint, TypeScript e exportação estática terminam sem erros.

## Fora de escopo

- Migrar o histórico de mensagens já armazenado na ESInet.
- Enviar mensagens como `@serginhobarbosa.com.br`.
- Contratar Google Workspace ou outro plano pago.
- Cancelar a ESInet antes do período de observação.
