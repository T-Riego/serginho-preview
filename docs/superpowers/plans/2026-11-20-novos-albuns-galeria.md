# Novos álbuns da Galeria de Fotos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Publicar sete novos álbuns com 43 fotos únicas, WebPs leves e duas heroes derivadas, sem alterar a UI/UX da galeria existente.

**Architecture:** Manter media-pages-data.json como fonte canônica e gerar os novos assets e registros por um importador Node ESM idempotente baseado em Sharp. O menu global continuará explícito em site-content.ts, enquanto media-pages.tsx ganhará apenas o suporte opcional a um banner dedicado, preservando o fallback atual.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Vitest 5, Testing Library, Sharp 0.35.4, exportação estática para GitHub Pages.

---

## Estrutura de arquivos

- Criar **scripts/import-gallery-albums.mjs**: deduplicar JPEGs por álbum, converter WebPs, gerar duas heroes e atualizar o JSON de dados.
- Criar **src/components/sites/serginho-barbosa/media-pages-data.test.ts**: validar álbuns, rotas, menu, assets e orçamento de bytes.
- Criar **src/components/sites/serginho-barbosa/media-pages.test.tsx**: provar banner dedicado e fallback horizontal.
- Modificar **src/components/sites/serginho-barbosa/media-pages-data.json**: acrescentar os sete álbuns gerados.
- Modificar **src/components/sites/serginho-barbosa/site-content.ts**: acrescentar sete links ao submenu.
- Modificar **src/components/sites/serginho-barbosa/media-pages.tsx**: aceitar banner opcional.
- Modificar **package.json** e **package-lock.json**: declarar Sharp e o comando de importação.
- Modificar **.gitignore**: impedir versionamento de Atualizacoes.
- Criar 43 arquivos em **public/sites/serginho-barbosa/gallery-albums/full/**.
- Criar 43 arquivos em **public/sites/serginho-barbosa/gallery-albums/thumbs/**.
- Criar 2 arquivos em **public/sites/serginho-barbosa/gallery-albums/banners/**.

### Task 1: Confirmar ambiente e baseline

**Files:**
- Read: **AGENTS.md**
- Read: **node_modules/next/dist/docs/01-app/02-guides/static-exports.md**
- Read: **node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md**
- Read: **node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md**
- Read: **node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md**

- [ ] **Step 1: Confirmar branch e árvore de trabalho**

    git status --short --branch
    git branch --show-current

Expected: branch feat/galeria-novos-albuns-2026; apenas Atualizacoes aparece como não rastreada.

- [ ] **Step 2: Instalar exatamente o lockfile**

    npm.cmd ci

Expected: exit 0. O aviso de engine do jsdom em Node 24.11.1 deve ser registrado, mas não invalida o baseline se os testes passarem.

- [ ] **Step 3: Ler integralmente a documentação Next 16 relevante**

    Get-Content -Raw node_modules/next/dist/docs/01-app/02-guides/static-exports.md
    Get-Content -Raw node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md
    Get-Content -Raw node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md
    Get-Content -Raw node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md

Expected: confirmar que export estático exige generateStaticParams para as rotas dinâmicas, dynamicParams false rejeita rotas ausentes e o carregador padrão de imagens não opera no export estático.

- [ ] **Step 4: Executar o baseline de testes**

    npm.cmd test

Expected: 7 arquivos de teste e 19 testes passando antes das mudanças.

### Task 2: Escrever o teste de contrato da nova galeria

**Files:**
- Create: **src/components/sites/serginho-barbosa/media-pages-data.test.ts**
- Test: **src/components/sites/serginho-barbosa/media-pages-data.test.ts**

- [ ] **Step 1: Criar o teste de dados, rotas, navegação e assets**

Adicionar o arquivo completo:

    // @vitest-environment node

    import { existsSync, statSync } from "node:fs";
    import path from "node:path";
    import { describe, expect, it } from "vitest";
    import data from "./media-pages-data.json";
    import { getAlbum, getAlbumParams } from "./media-pages";
    import { navigation } from "./site-content";

    type BannerRecord = {
      src: string;
      position?: string;
      mobilePosition?: string;
    };

    type PhotoRecord = {
      src: string;
      thumbnail: string;
      caption?: string;
      width: number;
      height: number;
    };

    type AlbumRecord = {
      label: string;
      slug: string;
      id: string;
      banner?: BannerRecord;
      photos: PhotoRecord[];
    };

    const expectedAlbums = [
      { label: "Carnaval 2026", slug: "carnaval-2026", id: "13", photoCount: 6, banner: false },
      { label: "Conserto Natal 2025", slug: "conserto-natal-2025", id: "14", photoCount: 3, banner: false },
      { label: "DVD Vander LIma - 2025", slug: "dvd-vander-lima-2025", id: "15", photoCount: 2, banner: true },
      { label: "Feat - Venezuela, Cuba, Argentina", slug: "feat-venezuela-cuba-argentina", id: "16", photoCount: 3, banner: true },
      { label: "Festival Gastronómico 2024", slug: "festival-gastronomico-2024", id: "17", photoCount: 7, banner: false },
      { label: "Julifet 2026", slug: "julifet-2026", id: "18", photoCount: 7, banner: false },
      { label: "Show Cenico Voz Companheira 2025", slug: "show-cenico-voz-companheira-2025", id: "19", photoCount: 15, banner: false },
    ] as const;

    const albums = data.albums as AlbumRecord[];
    const assetRoot = path.join(process.cwd(), "public", "sites", "serginho-barbosa");
    const assetPath = (relativePath: string) => path.join(assetRoot, ...relativePath.split("/"));

    describe("atualização da galeria em novembro de 2026", () => {
      it("publica os sete álbuns e as 43 fotos únicas", () => {
        const imported = expectedAlbums.map((expected) => {
          const album = albums.find(({ slug, id }) => slug === expected.slug && id === expected.id);
          expect(album, expected.label).toBeDefined();
          expect(album?.label).toBe(expected.label);
          expect(album?.photos).toHaveLength(expected.photoCount);
          expect(Boolean(album?.banner)).toBe(Boolean(expected.banner));
          expect(getAlbum(expected.slug, expected.id)).toBe(album);
          return album as AlbumRecord;
        });

        expect(imported.flatMap(({ photos }) => photos)).toHaveLength(43);
        expect(getAlbumParams()).toEqual(expect.arrayContaining(
          expectedAlbums.map(({ slug, id }) => ({ slug, id })),
        ));
      });

      it("mantém slugs, ids e caminhos de fotos únicos", () => {
        expect(new Set(albums.map(({ slug }) => slug)).size).toBe(albums.length);
        expect(new Set(albums.map(({ id }) => id)).size).toBe(albums.length);

        const photos = albums.flatMap(({ photos }) => photos);
        expect(new Set(photos.map(({ src }) => src)).size).toBe(photos.length);
        expect(new Set(photos.map(({ thumbnail }) => thumbnail)).size).toBe(photos.length);
      });

      it("referencia apenas WebPs existentes e leves", () => {
        const imported = albums.filter(({ id }) => Number(id) >= 13 && Number(id) <= 19);
        const files = imported.flatMap((album) => [
          ...album.photos.flatMap(({ src, thumbnail, width, height }) => {
            expect(width).toBeGreaterThan(0);
            expect(height).toBeGreaterThan(0);
            expect(src).toMatch(/\.webp$/);
            expect(thumbnail).toMatch(/_400\.webp$/);
            return [
              { relativePath: src, maxBytes: 300 * 1024 },
              { relativePath: thumbnail, maxBytes: 100 * 1024 },
            ];
          }),
          ...(album.banner ? [{ relativePath: album.banner.src, maxBytes: 300 * 1024 }] : []),
        ]);

        let totalBytes = 0;
        for (const { relativePath, maxBytes } of files) {
          const absolutePath = assetPath(relativePath);
          expect(existsSync(absolutePath), relativePath).toBe(true);
          const bytes = statSync(absolutePath).size;
          expect(bytes, relativePath).toBeLessThanOrEqual(maxBytes);
          totalBytes += bytes;
        }
        expect(totalBytes).toBeLessThanOrEqual(6 * 1024 * 1024);
      });

      it("mantém o submenu global sincronizado com os dados", () => {
        const links = navigation.find(({ label }) => label === "Galeria de Fotos")?.children ?? [];
        for (const { label, slug, id } of expectedAlbums) {
          expect(links).toContainEqual([label, slug + "/" + id]);
        }
      });
    });

- [ ] **Step 2: Executar o teste para comprovar o estado vermelho**

    npm.cmd test -- src/components/sites/serginho-barbosa/media-pages-data.test.ts

Expected: FAIL em "publica os sete álbuns e as 43 fotos únicas", pois Carnaval 2026 e os demais registros ainda não existem.

### Task 3: Criar o importador e gerar assets/dados

**Files:**
- Create: **scripts/import-gallery-albums.mjs**
- Modify: **package.json**
- Modify: **package-lock.json**
- Modify: **src/components/sites/serginho-barbosa/media-pages-data.json**
- Create: **public/sites/serginho-barbosa/gallery-albums/full/carnaval-2026-01.webp** e outros 42 full
- Create: **public/sites/serginho-barbosa/gallery-albums/thumbs/carnaval-2026-01_400.webp** e outros 42 thumbs
- Create: **public/sites/serginho-barbosa/gallery-albums/banners/dvd-vander-lima-2025.webp**
- Create: **public/sites/serginho-barbosa/gallery-albums/banners/feat-venezuela-cuba-argentina.webp**

- [ ] **Step 1: Declarar Sharp e o comando do importador**

    npm.cmd install --save-dev sharp@0.35.4
    npm.cmd pkg set "scripts.import:gallery=node scripts/import-gallery-albums.mjs"

Expected: package.json declara sharp 0.35.4 em devDependencies e import:gallery em scripts; package-lock.json permanece consistente.

- [ ] **Step 2: Criar o importador completo**

Adicionar **scripts/import-gallery-albums.mjs**:

    import { createHash } from "node:crypto";
    import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
    import path from "node:path";
    import sharp from "sharp";

    const projectRoot = process.cwd();
    const sourceRoot = path.join(
      projectRoot,
      "Atualizacoes",
      "drive-download-20261120T133846Z-1-001",
    );
    const publicRoot = path.join(projectRoot, "public", "sites", "serginho-barbosa");
    const dataPath = path.join(
      projectRoot,
      "src",
      "components",
      "sites",
      "serginho-barbosa",
      "media-pages-data.json",
    );
    const collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
    const acceptedExtensions = new Set([".jpg", ".jpeg", ".png"]);

    const albumDefinitions = [
      { label: "Carnaval 2026", folder: "Carnaval 2026", slug: "carnaval-2026", id: "13" },
      { label: "Conserto Natal 2025", folder: "Conserto Natal 2025", slug: "conserto-natal-2025", id: "14" },
      {
        label: "DVD Vander LIma - 2025",
        folder: "DVD Vander LIma - 2025",
        slug: "dvd-vander-lima-2025",
        id: "15",
        bannerSource: "WhatsApp Image 2026-11-19 at 19.21.21.jpeg",
      },
      {
        label: "Feat - Venezuela, Cuba, Argentina",
        folder: "Feat - Venezuela, Cuba, Argentina",
        slug: "feat-venezuela-cuba-argentina",
        id: "16",
        bannerSource: "WhatsApp Image 2026-11-19 at 19.51.12.jpeg",
      },
      {
        label: "Festival Gastronómico 2024",
        folder: "Festival Gastronómico 2024",
        slug: "festival-gastronomico-2024",
        id: "17",
      },
      { label: "Julifet 2026", folder: "Julifet 2026", slug: "julifet-2026", id: "18" },
      {
        label: "Show Cenico Voz Companheira 2025",
        folder: "Show Cenico Voz Companheira 2025",
        slug: "show-cenico-voz-companheira-2025",
        id: "19",
      },
    ];

    function outputPath(relativePath) {
      return path.join(publicRoot, ...relativePath.split("/"));
    }

    async function hashFile(filePath) {
      return createHash("sha256").update(await readFile(filePath)).digest("hex");
    }

    async function uniqueSourceFiles(folder) {
      const directory = path.join(sourceRoot, folder);
      const entries = (await readdir(directory, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && acceptedExtensions.has(path.extname(entry.name).toLowerCase()))
        .sort((first, second) => collator.compare(first.name, second.name));
      const hashes = new Set();
      const files = [];
      let duplicateCount = 0;

      for (const entry of entries) {
        const absolutePath = path.join(directory, entry.name);
        const hash = await hashFile(absolutePath);
        if (hashes.has(hash)) {
          duplicateCount += 1;
          continue;
        }
        hashes.add(hash);
        files.push({ name: entry.name, absolutePath });
      }

      return { files, duplicateCount };
    }

    async function writeWebp(sourcePath, relativePath, resize, quality) {
      const absolutePath = outputPath(relativePath);
      await mkdir(path.dirname(absolutePath), { recursive: true });
      await sharp(sourcePath)
        .rotate()
        .resize({ ...resize, kernel: sharp.kernel.lanczos3 })
        .webp({ quality, effort: 6, smartSubsample: true })
        .toFile(absolutePath);
      const metadata = await sharp(absolutePath).metadata();
      if (!metadata.width || !metadata.height) {
        throw new Error("Dimensões ausentes em " + relativePath);
      }
      return { width: metadata.width, height: metadata.height };
    }

    async function buildAlbum(definition) {
      const { files, duplicateCount } = await uniqueSourceFiles(definition.folder);
      const photos = [];

      for (const [index, source] of files.entries()) {
        const sequence = String(index + 1).padStart(2, "0");
        const full = "gallery-albums/full/" + definition.slug + "-" + sequence + ".webp";
        const thumbnail = "gallery-albums/thumbs/" + definition.slug + "-" + sequence + "_400.webp";
        const size = await writeWebp(
          source.absolutePath,
          full,
          { width: 1280, height: 1280, fit: "inside", withoutEnlargement: true },
          78,
        );
        await writeWebp(
          source.absolutePath,
          thumbnail,
          { width: 600, height: 600, fit: "inside", withoutEnlargement: true },
          72,
        );
        photos.push({ src: full, thumbnail, width: size.width, height: size.height });
      }

      const album = {
        label: definition.label,
        slug: definition.slug,
        id: definition.id,
        photos,
      };

      if (definition.bannerSource) {
        const banner = "gallery-albums/banners/" + definition.slug + ".webp";
        await writeWebp(
          path.join(sourceRoot, definition.folder, definition.bannerSource),
          banner,
          {
            width: 1280,
            height: 720,
            fit: "cover",
            position: sharp.strategy.attention,
            withoutEnlargement: false,
          },
          78,
        );
        album.banner = { src: banner, position: "center" };
      }

      return { album, duplicateCount };
    }

    const generated = [];
    let duplicates = 0;
    for (const definition of albumDefinitions) {
      const result = await buildAlbum(definition);
      generated.push(result.album);
      duplicates += result.duplicateCount;
    }

    const data = JSON.parse(await readFile(dataPath, "utf8"));
    const managedIds = new Set(albumDefinitions.map(({ id }) => id));
    data.albums = [
      ...data.albums.filter(({ id }) => !managedIds.has(id)),
      ...generated,
    ];
    await writeFile(dataPath, JSON.stringify(data, null, 2) + "\n", "utf8");

    const photoCount = generated.reduce((total, album) => total + album.photos.length, 0);
    if (generated.length !== 7 || photoCount !== 43 || duplicates !== 9) {
      throw new Error(
        "Inventário inesperado: " +
        generated.length + " álbuns, " +
        photoCount + " fotos, " +
        duplicates + " duplicatas",
      );
    }
    console.log("Gerados 7 álbuns, 43 fotos únicas e 2 banners; 9 duplicatas ignoradas.");

- [ ] **Step 3: Executar o importador**

    npm.cmd run import:gallery

Expected: Gerados 7 álbuns, 43 fotos únicas e 2 banners; 9 duplicatas ignoradas.

- [ ] **Step 4: Confirmar que documentos e JPEGs não foram copiados**

    rg --files public/sites/serginho-barbosa/gallery-albums | rg -i "\.(pdf|docx|jpe?g|png)$"

Expected: nenhum resultado.

### Task 4: Sincronizar menu e proteger as origens

**Files:**
- Modify: **src/components/sites/serginho-barbosa/site-content.ts**
- Modify: **.gitignore**
- Test: **src/components/sites/serginho-barbosa/media-pages-data.test.ts**

- [ ] **Step 1: Acrescentar os links ao final de galleries**

Adicionar antes do fechamento do array galleries:

    ["Carnaval 2026", "carnaval-2026/13"],
    ["Conserto Natal 2025", "conserto-natal-2025/14"],
    ["DVD Vander LIma - 2025", "dvd-vander-lima-2025/15"],
    ["Feat - Venezuela, Cuba, Argentina", "feat-venezuela-cuba-argentina/16"],
    ["Festival Gastronómico 2024", "festival-gastronomico-2024/17"],
    ["Julifet 2026", "julifet-2026/18"],
    ["Show Cenico Voz Companheira 2025", "show-cenico-voz-companheira-2025/19"],

- [ ] **Step 2: Ignorar a pasta de materiais recebidos**

Adicionar ao fim de .gitignore:

    # Local source materials
    Atualizacoes/

- [ ] **Step 3: Executar o teste de contrato para atingir o estado verde**

    npm.cmd test -- src/components/sites/serginho-barbosa/media-pages-data.test.ts

Expected: 4 testes passando; 7 álbuns, 43 fotos e 88 novos assets validados dentro do orçamento total de 6 MiB.

- [ ] **Step 4: Confirmar staging seletivo e commit**

    git status --short
    git add .gitignore package.json package-lock.json scripts/import-gallery-albums.mjs src/components/sites/serginho-barbosa/media-pages-data.json src/components/sites/serginho-barbosa/media-pages-data.test.ts src/components/sites/serginho-barbosa/site-content.ts public/sites/serginho-barbosa/gallery-albums
    git diff --cached --check
    git commit -m "feat: importar novos albuns da galeria"

Expected: Atualizacoes não entra no commit; o commit contém apenas pipeline, dados, testes e WebPs processados.

### Task 5: Usar os banners dedicados sem alterar o fallback

**Files:**
- Create: **src/components/sites/serginho-barbosa/media-pages.test.tsx**
- Modify: **src/components/sites/serginho-barbosa/media-pages.tsx**
- Test: **src/components/sites/serginho-barbosa/media-pages.test.tsx**

- [ ] **Step 1: Escrever o teste de banner dedicado e fallback**

Adicionar:

    import { render, screen } from "@testing-library/react";
    import { expect, it } from "vitest";
    import { GalleryPage, getAlbum } from "./media-pages";

    function requiredAlbum(slug: string, id: string) {
      const album = getAlbum(slug, id);
      if (!album) throw new Error("Álbum ausente: " + slug);
      return album;
    }

    it("usa a hero horizontal dedicada nos álbuns sem foto em paisagem", () => {
      const dvd = requiredAlbum("dvd-vander-lima-2025", "15");
      const { rerender } = render(<GalleryPage album={dvd} />);
      expect(screen.getByRole("img", {
        name: "Foto de destaque do álbum DVD Vander LIma - 2025",
      })).toHaveAttribute("src", expect.stringContaining(
        "gallery-albums/banners/dvd-vander-lima-2025.webp",
      ));

      const feat = requiredAlbum("feat-venezuela-cuba-argentina", "16");
      rerender(<GalleryPage album={feat} />);
      expect(screen.getByRole("img", {
        name: "Foto de destaque do álbum Feat - Venezuela, Cuba, Argentina",
      })).toHaveAttribute("src", expect.stringContaining(
        "gallery-albums/banners/feat-venezuela-cuba-argentina.webp",
      ));
    });

    it("mantém a primeira foto horizontal como fallback dos outros álbuns", () => {
      const carnaval = requiredAlbum("carnaval-2026", "13");
      const expected = carnaval.photos.find(({ width, height }) => width >= height);
      if (!expected) throw new Error("Carnaval 2026 precisa de foto horizontal");

      render(<GalleryPage album={carnaval} />);
      expect(screen.getByRole("img", {
        name: "Foto do álbum Carnaval 2026",
      })).toHaveAttribute("src", expect.stringContaining(expected.src));
    });

- [ ] **Step 2: Executar o teste para comprovar o estado vermelho**

    npm.cmd test -- src/components/sites/serginho-barbosa/media-pages.test.tsx

Expected: FAIL porque GalleryPage ainda ignora album.banner e usa a primeira foto do grid.

- [ ] **Step 3: Implementar o banner opcional**

Em media-pages.tsx, substituir a declaração de Album e o acesso direto a data.albums por:

    type Album = (typeof data.albums)[number] & {
      banner?: {
        src: string;
        position?: string;
        mobilePosition?: string;
      };
    };

    const albums = data.albums as Album[];

    const albumLinks = albums.map(({ label, slug, id }) => ({
      label,
      href: "/galeria-de-fotos/" + slug + "/" + id,
    }));

    export function getAlbumParams() {
      return albums.map(({ slug, id }) => ({ slug, id }));
    }

    export function getAlbum(slug: string, id: string) {
      return albums.find((album) => album.slug === slug && album.id === id);
    }

Adicionar antes de GalleryPage:

    function albumBanner(album: Album) {
      if (album.banner) {
        return {
          src: assetRoot + "/" + album.banner.src,
          alt: "Foto de destaque do álbum " + album.label,
          position: album.banner.position ?? "center",
          mobilePosition: album.banner.mobilePosition,
        };
      }

      const photo = album.photos.find(({ width, height }) => width >= height) ?? album.photos[0];
      if (!photo) return undefined;
      return {
        src: assetRoot + "/" + photo.src,
        alt: photo.caption || "Foto do álbum " + album.label,
        position: "center 35%",
      };
    }

No início de GalleryPage, substituir current e bannerPhoto por:

    const current = album ?? albums[0];
    const bannerMedia = album ? albumBanner(album) : undefined;

No InnerBanner, substituir a expressão media atual por:

    media={bannerMedia}

- [ ] **Step 4: Executar o teste dedicado**

    npm.cmd test -- src/components/sites/serginho-barbosa/media-pages.test.tsx

Expected: 2 testes passando.

- [ ] **Step 5: Executar todos os testes e commit**

    npm.cmd test
    git add src/components/sites/serginho-barbosa/media-pages.tsx src/components/sites/serginho-barbosa/media-pages.test.tsx
    git diff --cached --check
    git commit -m "feat: usar banners dedicados na galeria"

Expected: 9 arquivos de teste e 25 testes passando.

### Task 6: Verificar exportação estática e rotas

**Files:**
- Verify: **out/galeria-de-fotos/**
- Verify: **public/sites/serginho-barbosa/gallery-albums/**

- [ ] **Step 1: Executar lint, tipos e exportação com o ambiente do Pages**

    $env:NEXT_STATIC_EXPORT = "1"
    $env:NEXT_PUBLIC_BASE_PATH = "/serginho-preview"
    npm.cmd run check
    Remove-Item Env:NEXT_STATIC_EXPORT
    Remove-Item Env:NEXT_PUBLIC_BASE_PATH

Expected: lint, typecheck e build terminam com exit 0; Next exporta o site em out.

- [ ] **Step 2: Confirmar cada rota gerada**

    $routes = @(
      "carnaval-2026/13",
      "conserto-natal-2025/14",
      "dvd-vander-lima-2025/15",
      "feat-venezuela-cuba-argentina/16",
      "festival-gastronomico-2024/17",
      "julifet-2026/18",
      "show-cenico-voz-companheira-2025/19"
    )
    foreach ($route in $routes) {
      $file = Join-Path "out/galeria-de-fotos" (Join-Path $route "index.html")
      if (-not (Test-Path -LiteralPath $file)) { throw "Rota ausente: $route" }
    }
    "7 rotas estáticas confirmadas"

Expected: 7 rotas estáticas confirmadas.

- [ ] **Step 3: Confirmar que a árvore versionada não contém originais ou documentos**

    git ls-files | rg -i "Atualizacoes|Portfolio - Serginho|Resumo Rellease|\.(jpe?g|docx|pdf)$"

Expected: nenhum arquivo da pasta Atualizacoes, nenhum dos dois documentos e nenhum dos JPEGs recebidos.

### Task 7: QA visual e funcional

**Files:**
- Verify: **src/components/sites/serginho-barbosa/media-pages.tsx**
- Verify: **src/components/sites/serginho-barbosa/media-pages-data.json**
- Verify: **public/sites/serginho-barbosa/gallery-albums/**

- [ ] **Step 1: Iniciar preview local com o mesmo basePath**

    $env:NEXT_PUBLIC_BASE_PATH = "/serginho-preview"
    npm.cmd run dev -- --hostname 127.0.0.1 --port 3000

Expected: servidor disponível em http://127.0.0.1:3000/serginho-preview/.

- [ ] **Step 2: Validar desktop em 1440 × 1000**

Abrir /serginho-preview/galeria-de-fotos/ e os sete novos links. Confirmar:

- pills quebram linha sem sobrepor título ou hero;
- cada álbum mostra a contagem correta;
- grid mantém quatro colunas;
- nenhuma imagem está quebrada ou distorcida;
- DVD Vander LIma e Feat usam as heroes horizontais dedicadas;
- as outras cinco páginas usam foto horizontal do próprio álbum;
- lightbox abre a foto correta, percorre limites e fecha restaurando foco.

- [ ] **Step 3: Validar mobile em 390 × 844**

Confirmar:

- categorias aparecem no dropdown;
- grid mantém duas colunas sem overflow horizontal;
- heroes preservam o assunto principal;
- swipe, setas, filmstrip e Escape continuam funcionais;
- nenhuma legenda ou controle é cortado.

- [ ] **Step 4: Revisar console e peso transferido**

Expected: zero erros de runtime, zero 404 de imagens e nenhuma imagem full acima de 300 KiB ou thumbnail acima de 100 KiB.

- [ ] **Step 5: Encerrar preview e limpar variável**

Interromper o servidor com Ctrl+C e executar:

    Remove-Item Env:NEXT_PUBLIC_BASE_PATH -ErrorAction SilentlyContinue

### Task 8: Verificação final da entrega local

**Files:**
- Verify: all changed files

- [ ] **Step 1: Executar evidência fresca**

    npm.cmd test
    $env:NEXT_STATIC_EXPORT = "1"
    $env:NEXT_PUBLIC_BASE_PATH = "/serginho-preview"
    npm.cmd run check
    Remove-Item Env:NEXT_STATIC_EXPORT
    Remove-Item Env:NEXT_PUBLIC_BASE_PATH

Expected: 9 arquivos e 25 testes passando; lint, tipos e build com exit 0.

- [ ] **Step 2: Auditar diff e escopo**

    git status --short
    git diff --check origin/main...HEAD
    git diff --stat origin/main...HEAD
    git log --oneline --decorate origin/main..HEAD

Expected: somente especificação, plano, pipeline, testes, dados, navegação, suporte a banner e assets WebP; nenhum documento ou JPEG de origem.

- [ ] **Step 3: Não publicar**

Não executar git push, merge ou deploy. Entregar o resultado local na branch feat/galeria-novos-albuns-2026 e aguardar autorização explícita para publicação.
