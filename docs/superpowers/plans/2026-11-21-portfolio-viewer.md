# Visualizador interno do Portfólio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar a rota estática `/portfolio` com as 70 páginas do portfólio em um visualizador WebP progressivo, sem download nem PDF público, preservando a UI existente.

**Architecture:** A rota e o conteúdo introdutório permanecem Server Components; somente o visualizador é um Client Component. Um importador offline renderiza o PDF em duas larguras WebP, valida o lote em staging e promove o diretório somente após sucesso. Um manifesto TypeScript curado fornece os 70 textos alternativos e caminhos serializáveis.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, CSS Modules, Vitest/Testing Library, Sharp 0.35, Poppler 26, export estático para GitHub Pages.

---

## Pré-condição: preservar o trabalho já aprovado

O worktree contém ajustes aprovados da hero e da ordem do menu da galeria. Antes de tocar nos mesmos arquivos, registrar esses ajustes em commits separados, usando staging explícito:

```powershell
git add -- public/sites/serginho-barbosa/editorial/hero-serginho-solo.webp public/sites/serginho-barbosa/hero-thumbs/palco.webp src/components/sites/serginho-barbosa/hero-carousel.tsx src/components/sites/serginho-barbosa/home-controls.test.tsx
git commit -m "feat: usar hero com cantor isolado"

git add -- src/components/sites/serginho-barbosa/site-content.ts src/components/sites/serginho-barbosa/media-pages-data.test.ts
git commit -m "fix: ordenar menu da galeria"
```

Confirmar com `git status --short` que somente documentos já commitados permanecem fora do índice. Não incluir o PDF de `Atualizacoes/` em nenhum commit.

### Task 1: Gerar e validar os assets responsivos

**Files:**
- Create: `scripts/import-portfolio.mjs`
- Modify: `package.json`
- Create: `src/components/sites/serginho-barbosa/portfolio-pages-data.ts`
- Create: `src/components/sites/serginho-barbosa/portfolio-pages-data.test.ts`
- Create: `public/sites/serginho-barbosa/portfolio/pages/page-001-960.webp` até `page-070-960.webp`
- Create: `public/sites/serginho-barbosa/portfolio/pages/page-001-1600.webp` até `page-070-1600.webp`

- [ ] **Step 1: Criar o manifesto curado**

Criar `portfolio-pages-data.ts` com a interface e 70 descrições, na ordem do PDF:

```ts
import { assetRoot } from "./site-content";

export type PortfolioPageAsset = Readonly<{
  number: number;
  compactSrc: string;
  desktopSrc: string;
  alt: string;
}>;

const portfolioPageAlts = [
  "Capa do portfólio de Serginho Barbosa",
  "Sumário com as áreas de atuação de Serginho Barbosa",
  "Abertura da seção Quem sou",
  "Biografia e trajetória artística de Serginho Barbosa",
  "Missão artística de Serginho Barbosa",
  "Abertura da seção Ator",
  "Cursos e formação teatral",
  "Peças, filmes e trabalhos como ator",
  "Show Cênico Voz Companheira 20 anos",
  "Registro fotográfico do Show Cênico Voz Companheira 20 anos",
  "Gravação do DVD de Vander Lima",
  "Show Cênico Voz Companheira de 2024",
  "Ensaio sobre a Cegueira",
  "Espetáculo Yerma",
  "Abertura da seção Locutor",
  "Rádio web Voz Companheira",
  "Programa Voz Companheira na Rádio Cidade FM",
  "Abertura da seção Músico",
  "Lançamentos musicais de 2025 e 2026",
  "Discografia de 2005 a 2022",
  "Single Por um Bolero, parceria entre Brasil e Venezuela",
  "Single No Necesito, parceria entre Brasil e Cuba",
  "Single Caminos, parceria entre Brasil e Argentina",
  "Álbum Brilho Novo",
  "Álbum Circo dos Amores",
  "Álbum Boleros: Uma História de Amor",
  "Álbum Voz Companheira",
  "Álbum Trajetória",
  "Shows e apresentações de 2024 a 2026",
  "Shows e apresentações de 2005 a 2023",
  "Carnaval é Aqui no Circo dos Amores em Itabirito em 2026",
  "Carnaval é Aqui no Circo dos Amores em Ouro Preto em 2026",
  "Gravação do hino do Itabirito Futebol Clube",
  "Carnaval é Aqui no Circo dos Amores em Itabirito",
  "Carnaval em Itabirito",
  "Carnaval é Aqui no Circo dos Amores em Contagem",
  "Show em evento gastronômico",
  "Gravação da marchinha Itabirito em seu Centenário",
  "Show no Julifest 2023",
  "Lançamento do show Caminhos - Brilho Novo",
  "Show Serginho Barbosa convida Violeiro Chico Lobo",
  "Palco Iluminado com Thelmo Lins e Serginho Barbosa",
  "Abertura da seção Produtor",
  "Produções realizadas entre 2022 e 2025",
  "Produções realizadas entre 2018 e 2019",
  "Produções realizadas entre 2016 e 2017",
  "Produções realizadas entre 2006 e 2014",
  "Abertura da seção Deu na Mídia",
  "Participação no MGTV Primeira Edição",
  "Publicações no Antenados e na Rádio Barreiro",
  "Publicações no Cenário Minas e no jornal O Liberal",
  "Publicações no Boas Vindas BH e no jornal O Tempo",
  "Publicações no BH Eventos e no Portal UAI",
  "Publicações no Agenda BH e no Santa Tereza Tem",
  "Publicações no Culturaliza BH e no portal Belo Horizonte",
  "Notícia no jornal Super Notícia",
  "Notícia no jornal O Tempo",
  "Notícia no jornal Estado de Minas",
  "Entrevistas nas rádios América e Inconfidência",
  "Entrevista no programa Revista da Tarde da Rádio Inconfidência",
  "Participações de Serginho Barbosa na televisão",
  "Vídeo de participação de Serginho Barbosa",
  "Abertura da seção Certificados",
  "Primeiro certificado profissional apresentado no portfólio",
  "Segundo certificado profissional apresentado no portfólio",
  "Terceiro certificado profissional apresentado no portfólio",
  "Quarto certificado profissional apresentado no portfólio",
  "Quinto certificado profissional apresentado no portfólio",
  "Sexto certificado profissional apresentado no portfólio",
  "Página de contato de Serginho Barbosa",
] as const;

export const portfolioPages: readonly PortfolioPageAsset[] = portfolioPageAlts.map(
  (alt, index) => {
    const number = index + 1;
    const padded = String(number).padStart(3, "0");
    return {
      number,
      compactSrc: `${assetRoot}/portfolio/pages/page-${padded}-960.webp`,
      desktopSrc: `${assetRoot}/portfolio/pages/page-${padded}-1600.webp`,
      alt,
    };
  },
);
```

- [ ] **Step 2: Escrever o teste de assets antes da geração**

Criar `portfolio-pages-data.test.ts` com ambiente Node. O teste deve exigir 70 registros, numeração contínua, paths únicos, 140 arquivos, formato WebP, dimensões exatas, desktop até 400 KiB, compacto até 250 KiB e nenhum `.pdf` sob `public/`:

```ts
// @vitest-environment node
import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { portfolioPages } from "./portfolio-pages-data";

const pagesRoot = path.join(process.cwd(), "public", "sites", "serginho-barbosa", "portfolio", "pages");

describe("assets do portfólio", () => {
  it("mantém o manifesto completo e ordenado", () => {
    expect(portfolioPages).toHaveLength(70);
    expect(portfolioPages.map(({ number }) => number)).toEqual(
      Array.from({ length: 70 }, (_, index) => index + 1),
    );
    const paths = portfolioPages.flatMap(({ compactSrc, desktopSrc }) => [compactSrc, desktopSrc]);
    expect(new Set(paths).size).toBe(140);
  });

  it("mantém dimensões e pesos dentro dos limites", async () => {
    for (const { number } of portfolioPages) {
      const padded = String(number).padStart(3, "0");
      for (const variant of [
        { suffix: "960", width: 960, height: 540, max: 250 * 1024 },
        { suffix: "1600", width: 1600, height: 900, max: 400 * 1024 },
      ]) {
        const file = path.join(pagesRoot, `page-${padded}-${variant.suffix}.webp`);
        expect(existsSync(file), file).toBe(true);
        const metadata = await sharp(file).metadata();
        expect(metadata).toMatchObject({ format: "webp", width: variant.width, height: variant.height });
        expect(statSync(file).size).toBeLessThanOrEqual(variant.max);
      }
    }
    const publicFiles = readdirSync(path.join(process.cwd(), "public"), { recursive: true });
    expect(publicFiles.some((file) => String(file).toLowerCase().endsWith(".pdf"))).toBe(false);
  });
});
```

- [ ] **Step 3: Rodar o teste para comprovar a falha**

Run: `npm test -- src/components/sites/serginho-barbosa/portfolio-pages-data.test.ts`

Expected: FAIL porque `public/sites/serginho-barbosa/portfolio/pages/` ainda não contém os 140 WebPs.

- [ ] **Step 4: Criar o importador seguro**

Adicionar `"import:portfolio": "node scripts/import-portfolio.mjs"` aos scripts do `package.json`.

O importador deve:

```js
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rename, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const sourcePdf = process.argv[2] ? path.resolve(process.argv[2]) : undefined;
if (!sourcePdf || path.extname(sourcePdf).toLowerCase() !== ".pdf" || !existsSync(sourcePdf)) {
  throw new Error('Uso: npm run import:portfolio -- "caminho/Portfolio.pdf"');
}

const projectRoot = process.cwd();
const portfolioRoot = path.join(projectRoot, "public", "sites", "serginho-barbosa", "portfolio");
const destination = path.join(portfolioRoot, "pages");
const maxBytes = { "960": 250 * 1024, "1600": 400 * 1024 };

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", windowsHide: true });
  if (result.status !== 0) throw new Error(result.stderr || `${command} falhou`);
  return result.stdout;
}

function assertPdf() {
  const info = run("pdfinfo", [sourcePdf]);
  if (!/^Pages:\s+70$/m.test(info) || !/^Page size:\s+1440 x 810 pts/m.test(info)) {
    throw new Error("O PDF deve possuir 70 páginas de 1440 × 810 pt.");
  }
}

async function encode(source, destinationPath, width, height, quality) {
  await sharp(source)
    .resize({ width, height, fit: "fill", kernel: sharp.kernel.lanczos3 })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(destinationPath);
}
```

No `main()`, criar staging dentro de `portfolioRoot`, renderizar sequencialmente cada página com:

```js
run("pdftoppm", [
  "-f", String(page), "-l", String(page), "-singlefile",
  "-png", "-r", "80", sourcePdf, pngPrefix,
]);
await encode(pngPath, compactPath, 960, 540, 78);
await encode(pngPath, desktopPath, 1600, 900, 80);
```

Antes de promover, iterar pelos 140 arquivos e validar formato, dimensões, peso, nomes e hashes desktop únicos. Promover com troca de diretório no mesmo volume: renomear `pages` existente para um backup temporário, renomear o staging validado para `pages`, restaurar o backup se a segunda operação falhar e remover staging/backup em `finally`. Usar somente paths resolvidos sob `portfolioRoot`; nunca apagar um path fora dele.

- [ ] **Step 5: Gerar os 140 WebPs**

Run:

```powershell
npm run import:portfolio -- "F:\RiegosDev\Landing Page Serginho\Atualizacoes\drive-download-20261120T133846Z-1-001\Portfolio - Serginho Barbosa 2026.pdf"
```

Expected: `Geradas 70 páginas do portfólio em 140 WebPs validados.`

- [ ] **Step 6: Rodar o teste até passar**

Run: `npm test -- src/components/sites/serginho-barbosa/portfolio-pages-data.test.ts`

Expected: 2 tests PASS.

- [ ] **Step 7: Commit**

```powershell
git add -- package.json scripts/import-portfolio.mjs src/components/sites/serginho-barbosa/portfolio-pages-data.ts src/components/sites/serginho-barbosa/portfolio-pages-data.test.ts public/sites/serginho-barbosa/portfolio/pages
git commit -m "feat: preparar assets otimizados do portfolio"
```

### Task 2: Integrar Portfólio à navegação e à hero interna

**Files:**
- Modify: `src/components/sites/serginho-barbosa/site-content.ts`
- Modify: `src/components/sites/serginho-barbosa/home-controls.test.tsx`
- Modify: `src/components/sites/serginho-barbosa/lower-sections.test.tsx`
- Modify: `src/components/sites/serginho-barbosa/inner-banner.tsx`
- Modify: `src/components/sites/serginho-barbosa/inner-banner.test.tsx`

- [ ] **Step 1: Escrever testes falhos de integração**

Adicionar expectativas de que `Portfólio` possui `href="/portfolio"`, aparece imediatamente após `Biografia`, recebe `aria-current="page"` em `/portfolio`, aparece no menu móvel e no `Acesso rápido`. Em `inner-banner.test.tsx`, renderizar:

```tsx
render(<InnerBanner title="Portfólio" page="portfolio" />);
expect(screen.getByRole("heading", { level: 1, name: "Portfólio" })).toBeVisible();
expect(screen.getByRole("img", { name: /terno branco/i })).toHaveAttribute(
  "src",
  expect.stringContaining("editorial/biografia-retrato.webp"),
);
```

- [ ] **Step 2: Rodar os testes para comprovar a falha**

Run: `npm test -- src/components/sites/serginho-barbosa/home-controls.test.tsx src/components/sites/serginho-barbosa/lower-sections.test.tsx src/components/sites/serginho-barbosa/inner-banner.test.tsx`

Expected: FAIL porque a rota ainda não existe no array e `portfolio` ainda não é aceito pelo banner.

- [ ] **Step 3: Implementar a navegação e mídia**

Inserir após Biografia em `navigation`:

```ts
{ label: "Portfólio", href: "/portfolio" },
```

Adicionar a `bannerImages`:

```ts
portfolio: {
  src: `${assetRoot}/editorial/biografia-retrato.webp`,
  alt: "Serginho Barbosa de terno branco em um palco iluminado de azul",
  position: "center 35%",
  mobilePosition: "center 35%",
},
```

- [ ] **Step 4: Rodar os testes até passar**

Run: mesmo comando do Step 2.

Expected: todos PASS.

- [ ] **Step 5: Commit**

```powershell
git add -- src/components/sites/serginho-barbosa/site-content.ts src/components/sites/serginho-barbosa/home-controls.test.tsx src/components/sites/serginho-barbosa/lower-sections.test.tsx src/components/sites/serginho-barbosa/inner-banner.tsx src/components/sites/serginho-barbosa/inner-banner.test.tsx
git commit -m "feat: adicionar portfolio a navegacao"
```

### Task 3: Proteger o menu em larguras intermediárias

**Files:**
- Modify: `src/components/sites/serginho-barbosa/site.css`
- Modify: `src/components/sites/serginho-barbosa/site-css.test.ts`

- [ ] **Step 1: Escrever o teste falho do breakpoint**

Adicionar uma asserção que encontre `@media (max-width: 1100px)` e confirme que o bloco contém `.sb-desktop-nav { display: none; }` e `.sb-menu-trigger { display: inline-flex; }`.

- [ ] **Step 2: Rodar para comprovar a falha**

Run: `npm test -- src/components/sites/serginho-barbosa/site-css.test.ts`

Expected: FAIL porque o header ainda usa 960 px.

- [ ] **Step 3: Separar os breakpoints sem alterar submenus internos**

Mover apenas estas regras do bloco de 960 px para um novo bloco de 1100 px:

```css
@media (max-width: 1100px) {
  .sb-header-inner { min-height: 66px; }
  .sb-desktop-nav { display: none; }
  .sb-menu-trigger {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    gap: .45rem;
    padding: .4rem .8rem;
    border: 1px solid var(--sb-border-strong);
    border-radius: 999px;
    color: var(--sb-ink);
    font-size: .9rem;
    font-weight: 600;
    cursor: pointer;
  }
  .sb-menu-trigger:hover { background: var(--sb-surface); }
}
```

Manter as regras de `.sb-banner-links` no bloco original de 960 px.

- [ ] **Step 4: Rodar o teste até passar**

Run: mesmo comando do Step 2.

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add -- src/components/sites/serginho-barbosa/site.css src/components/sites/serginho-barbosa/site-css.test.ts
git commit -m "fix: adaptar menu ao item portfolio"
```

### Task 4: Implementar o visualizador progressivo

**Files:**
- Create: `src/components/sites/serginho-barbosa/portfolio-viewer.tsx`
- Create: `src/components/sites/serginho-barbosa/portfolio-viewer.test.tsx`
- Create: `src/components/sites/serginho-barbosa/portfolio.module.css`

- [ ] **Step 1: Escrever testes falhos do visualizador**

Usar três páginas de fixture. Cobrir contador inicial, limites, clique, teclado, swipe horizontal de 48 px, gesto vertical ignorado, erro de imagem e prefetch. Substituir `window.Image` por um mock que registre `srcset` e `sizes`.

```ts
const pages = [1, 2, 3].map((number) => ({
  number,
  compactSrc: `/page-${number}-960.webp`,
  desktopSrc: `/page-${number}-1600.webp`,
  alt: `Página ${number}`,
}));
```

- [ ] **Step 2: Rodar para comprovar a falha**

Run: `npm test -- src/components/sites/serginho-barbosa/portfolio-viewer.test.tsx`

Expected: FAIL porque o componente ainda não existe.

- [ ] **Step 3: Implementar estado, controles e prefetch**

O componente deve usar `useState`, `useEffect` e refs de toque. Sua estrutura pública será:

```tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PortfolioPageAsset } from "./portfolio-pages-data";
import styles from "./portfolio.module.css";

export function PortfolioViewer({ pages }: { pages: readonly PortfolioPageAsset[] }) {
  const [index, setIndex] = useState(0);
  const [failedPage, setFailedPage] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const current = pages[index];

  function move(offset: number) {
    setFailedPage(null);
    setIndex((value) => Math.min(pages.length - 1, Math.max(0, value + offset)));
  }

  useEffect(() => {
    const next = pages[index + 1];
    if (!next) return;
    const image = new window.Image();
    image.srcset = `${next.compactSrc} 960w, ${next.desktopSrc} 1600w`;
    image.sizes = "(max-width: 720px) calc(100vw - 2rem), min(1180px, calc(100vw - 3rem))";
  }, [index, pages]);

  if (!current) return null;

  return (
    <section className={styles.viewer} aria-label="Visualizador do portfólio">
      <div
        className={styles.stage}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
        }}
        onTouchStart={(event) => {
          const touch = event.changedTouches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - start.x;
          const deltaY = touch.clientY - start.y;
          if (Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
            move(deltaX < 0 ? 1 : -1);
          }
        }}
      >
        {failedPage === current.number ? (
          <p role="alert" className={styles.error}>Não foi possível carregar esta página do portfólio.</p>
        ) : (
          <picture key={current.number} className={styles.page}>
            <source media="(max-width: 720px)" srcSet={current.compactSrc} />
            <Image
              src={current.desktopSrc}
              alt={current.alt}
              width={1600}
              height={900}
              unoptimized
              loading="eager"
              fetchPriority={current.number === 1 ? "high" : "auto"}
              onError={() => setFailedPage(current.number)}
            />
          </picture>
        )}
      </div>
      <div className={styles.controls}>
        <button type="button" disabled={index === 0} onClick={() => move(-1)}>
          <ChevronLeft aria-hidden="true" /> Anterior
        </button>
        <p role="status" aria-live="polite">Página {index + 1} de {pages.length}</p>
        <button type="button" disabled={index === pages.length - 1} onClick={() => move(1)}>
          Próxima <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Estilizar conforme os tokens atuais**

Em `portfolio.module.css`, usar `aspect-ratio: 16 / 9`, `object-fit: contain`, fundo `var(--sb-dark)`, botões de no mínimo 44 px, `touch-action: pan-y pinch-zoom`, foco visível, animação de opacidade de 160 ms e:

```css
@media (prefers-reduced-motion: reduce) {
  .page { animation: none; }
}
```

- [ ] **Step 5: Rodar os testes até passar**

Run: mesmo comando do Step 2.

Expected: todos PASS.

- [ ] **Step 6: Commit**

```powershell
git add -- src/components/sites/serginho-barbosa/portfolio-viewer.tsx src/components/sites/serginho-barbosa/portfolio-viewer.test.tsx src/components/sites/serginho-barbosa/portfolio.module.css
git commit -m "feat: criar visualizador progressivo do portfolio"
```

### Task 5: Criar a página estática `/portfolio`

**Files:**
- Create: `src/app/portfolio/page.tsx`
- Create: `src/components/sites/serginho-barbosa/portfolio-page.tsx`
- Create: `src/components/sites/serginho-barbosa/portfolio-page.test.tsx`

- [ ] **Step 1: Escrever o teste falho de composição**

Renderizar `PortfolioPageContent` e exigir o heading `Portfólio artístico`, a introdução aprovada, o visualizador e ausência de links ou botões com nome contendo `baixar` ou `download`.

- [ ] **Step 2: Rodar para comprovar a falha**

Run: `npm test -- src/components/sites/serginho-barbosa/portfolio-page.test.tsx`

Expected: FAIL porque o componente ainda não existe.

- [ ] **Step 3: Criar o conteúdo e a rota**

`portfolio-page.tsx`:

```tsx
import { portfolioPages } from "./portfolio-pages-data";
import { PortfolioViewer } from "./portfolio-viewer";
import styles from "./portfolio.module.css";

export function PortfolioPageContent() {
  return (
    <section className={styles.content} aria-labelledby="portfolio-intro-title">
      <div className="sb-container">
        <div className={styles.intro}>
          <h2 className="sb-heading" id="portfolio-intro-title">Portfólio artístico</h2>
          <p>Conheça a trajetória artística de Serginho Barbosa como cantor, ator, compositor, locutor e produtor. Navegue pelas páginas para acompanhar seus projetos, apresentações e realizações.</p>
        </div>
        <PortfolioViewer pages={portfolioPages} />
      </div>
    </section>
  );
}
```

`src/app/portfolio/page.tsx`:

```tsx
import type { Metadata } from "next";
import { InnerBanner } from "@/components/sites/serginho-barbosa/inner-banner";
import { PortfolioPageContent } from "@/components/sites/serginho-barbosa/portfolio-page";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Portfólio artístico de Serginho Barbosa como cantor, ator, compositor, locutor e produtor.",
};

export default function PortfolioPage() {
  return (
    <main>
      <InnerBanner title="Portfólio" page="portfolio" />
      <PortfolioPageContent />
    </main>
  );
}
```

- [ ] **Step 4: Rodar o teste até passar**

Run: mesmo comando do Step 2.

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add -- src/app/portfolio/page.tsx src/components/sites/serginho-barbosa/portfolio-page.tsx src/components/sites/serginho-barbosa/portfolio-page.test.tsx src/components/sites/serginho-barbosa/portfolio.module.css
git commit -m "feat: adicionar pagina interna de portfolio"
```

### Task 6: Verificação completa e aprovação local

**Files:**
- Verify only, salvo correções estritamente necessárias.

- [ ] **Step 1: Rodar a suíte completa**

Run: `npm test`

Expected: todos os testes PASS, incluindo manifesto, navegação, banner, visualizador e página.

- [ ] **Step 2: Rodar lint, tipos e build**

Run: `npm run check`

Expected: ESLint, `tsc --noEmit` e `next build` terminam com exit code 0 e incluem a rota `/portfolio`.

- [ ] **Step 3: Confirmar export estático**

Run: `$env:NEXT_STATIC_EXPORT='1'; $env:NEXT_PUBLIC_BASE_PATH='/serginho-preview'; npm run build`

Expected: export estático completo e `out/portfolio/index.html` existente.

- [ ] **Step 4: Abrir a prévia local**

Run: `$env:NEXT_PUBLIC_BASE_PATH='/serginho-preview'; npm run dev -- --hostname 127.0.0.1 --port 3000`

Verificar no navegador:

- 390 px: hero, primeira página legível, gesto, botões e ausência de download.
- 960, 1024 e 1100 px: menu móvel sem sobreposição.
- 1101 e 1280 px: menu desktop sem overflow.
- Páginas 1, 20, 40, 60 e 70: nitidez, proporção e contador.
- Rede: primeiro carregamento solicita página 1 e prefetch da 2; cada avanço solicita somente a próxima ausente.
- Teclado: foco visível e setas funcionais.

- [ ] **Step 5: Entregar a prévia antes de deploy**

Manter o servidor local aberto para o usuário testar. Não executar merge, push ou deploy até aprovação explícita.
