# Snapshot público de DNS antes da migração

Consultado em 24 de novembro de 2026 diretamente em `ns1.esinet.com.br`.

> Este arquivo é apenas um registro operacional para retorno temporário durante a janela de migração. Ele não representa a zona final.

| Nome | Tipo | TTL | Valor |
| --- | --- | ---: | --- |
| `@` | `A` | 3600 | `3.22.47.173` |
| `@` | `A` | 3600 | `3.129.155.246` |
| `@` | `A` | 3600 | `18.218.220.232` |
| `www` | `CNAME` | 3600 | `serginhobarbosa.com.br` |
| `@` | `MX` | 3600 | prioridade `0`, `mail.serginhobarbosa.com.br` |
| `@` | `TXT` | 3600 | `v=spf1 a mx include:_spf.onedns.com.br ~all` |
| `mail` | `A` | 3600 | `177.38.229.8` |
| `webmail` | `A` | 3600 | `177.38.229.8` |
| `smtp` | `A` | 3600 | `177.38.229.8` |

Nameservers atuais:

- `ns1.esinet.com.br` (`177.38.229.11`)
- `ns2.esinet.com.br` (`177.38.229.13`)

SOA observado:

- Serial: `2025073010`
- Responsável: `system.hradm.com`
- Refresh/retry: `3600`
- Expiração: `1209600`
- TTL padrão: `86400`

## Uso em retorno

Se o novo site falhar, restaurar temporariamente os três registros `A` e `www` acima. Se o encaminhamento de e-mail falhar enquanto a ESInet ainda estiver ativa, restaurar também o MX, os três hosts de correio e o SPF antigo. Não manter dois registros SPF simultâneos.
