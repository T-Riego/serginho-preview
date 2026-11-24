# Migração de domínio, e-mail e SEO — plano de implementação

**Objetivo:** levar o site ao domínio oficial, manter o deploy estático no GitHub Pages e encaminhar todos os novos e-mails do domínio ao Gmail, sem custo recorrente adicional.

## 1. Preparar o código

- [ ] Ajustar o export do GitHub Pages para domínio raiz, sem `basePath` de repositório.
- [ ] Garantir que o domínio personalizado acompanhe o artefato publicado.
- [ ] Adicionar metadata base, canonical, Open Graph, Twitter Card e dados estruturados.
- [ ] Adicionar `robots.txt`, `sitemap.xml` e manifesto quando apropriado.

## 2. Verificar localmente

- [ ] Executar testes, lint, typecheck e build.
- [ ] Executar exportação estática de produção e procurar referências indevidas a `/serginho-preview`.
- [ ] Servir `out/` localmente e validar as rotas principais em desktop e celular.

## 3. Preparar serviços externos

- [ ] Configurar no GitHub Pages o domínio `www.serginhobarbosa.com.br`.
- [ ] Criar o domínio no ImprovMX e verificar `barbosavozcompanheira@gmail.com`.
- [ ] Criar o alias catch-all `*` e registrar os MX/SPF exatos exibidos pelo serviço.

## 4. Executar a troca DNS

- [ ] Ativar DNS do Registro.br em modo avançado.
- [ ] Publicar os quatro `A` do GitHub Pages e o `CNAME` de `www`.
- [ ] Publicar MX do ImprovMX, um único SPF e DMARC em monitoramento.
- [ ] Confirmar propagação com consultas autoritativas e públicas.

## 5. Validar e observar

- [ ] Testar site, redirecionamento canônico, certificado e assets.
- [ ] Testar e-mail para `contato@serginhobarbosa.com.br` e um alias aleatório.
- [ ] Manter ESInet disponível por 48 a 72 horas.
- [ ] Cancelar o serviço antigo somente após aprovação explícita e estabilidade confirmada.
