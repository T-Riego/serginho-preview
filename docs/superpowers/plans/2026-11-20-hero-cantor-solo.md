# Hero principal com cantor isolado Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir somente a imagem do primeiro slide da home por uma versão em que Serginho permanece idêntico ao original e os dois músicos e seus equipamentos são removidos.

**Architecture:** A edição parte do WebP original e usa edição localizada por IA apenas para reconstruir o fundo. O resultado aprovado vira um asset exclusivo da hero, enquanto a Biografia continua apontando para o arquivo original. A integração muda um único caminho de imagem, regenera a miniatura e adiciona uma proteção de teste.

**Tech Stack:** OpenAI ImageGen, Next.js 16, React 19, TypeScript, Next Image, Sharp 0.35.4, Vitest, Testing Library

---

## Estrutura de arquivos

- Create: `public/sites/serginho-barbosa/editorial/hero-serginho-solo.webp` — imagem aprovada e otimizada para o primeiro slide.
- Modify: `public/sites/serginho-barbosa/hero-thumbs/palco.webp` — miniatura derivada da nova hero.
- Modify: `src/components/sites/serginho-barbosa/hero-carousel.tsx` — aponta somente o primeiro slide para o novo asset.
- Modify: `src/components/sites/serginho-barbosa/home-controls.test.tsx` — protege o caminho dedicado da hero.
- Preserve: `public/sites/serginho-barbosa/editorial/biografia-show.webp` — fonte original e foto usada pela Biografia.

### Task 1: Gerar e aprovar a edição localizada

**Files:**
- Read: `public/sites/serginho-barbosa/editorial/biografia-show.webp`
- Temporary output: diretório temporário retornado pelo ImageGen

- [ ] **Step 1: Registrar a integridade da fonte**

Run:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'public\sites\serginho-barbosa\editorial\biografia-show.webp'
```

Expected: `387E67E451479B607CDF06049682F05E7D84E79CFECF725D4E41964D9A378349`.

- [ ] **Step 2: Editar o original com ImageGen**

Call `image_gen__imagegen` with:

```json
{
  "referenced_image_paths": [
    "F:\\RiegosDev\\Landing Page Serginho\\public\\sites\\serginho-barbosa\\editorial\\biografia-show.webp"
  ],
  "transparent_background": false,
  "prompt": "Edite somente o fundo desta fotografia. Remova completamente as duas pessoas atrás do cantor: o tecladista ao centro-direita e o percussionista na extrema direita. Remova também teclado, banco, instrumentos de percussão, suportes, partituras e cabos diretamente associados a eles. Reconstrua essas áreas com a continuação natural da cortina, do palco e da atmosfera azul e roxa já existentes, preservando a mesma direção de luz, intensidade, sombras, granulação, contraste e profundidade. O cantor Serginho Barbosa, seu rosto, cabelo, óculos, corpo, mãos, terno, sapatos, microfone e pedestal devem permanecer visualmente idênticos ao arquivo original, sem redesenho, retoque, mudança de posição ou alteração de proporção. Preserve o enquadramento e todos os pixels não relacionados às remoções. Não adicione pessoas, instrumentos, objetos, textos, logotipos ou novas luzes. Resultado fotográfico realista e de alta resolução."
}
```

Expected: uma fotografia horizontal sem os músicos ou equipamentos, com o cantor e o primeiro plano preservados.

- [ ] **Step 3: Inspecionar o candidato antes de integrar**

Use `view_image` no arquivo retornado. Rejeite e regenere se houver qualquer mudança perceptível em rosto, mãos, roupa, microfone, pedestal, proporção ou enquadramento do cantor; resíduos de músicos; repetição artificial da cortina; sombras incompatíveis; ou novos objetos.

- [ ] **Step 4: Confirmar resolução útil**

Run com o caminho local retornado pelo ImageGen atribuído a `$generatedCandidatePath`:

```powershell
$env:HERO_CANDIDATE = $generatedCandidatePath
node -e "const sharp=require('sharp'); sharp(process.env.HERO_CANDIDATE).metadata().then(m=>{console.log(JSON.stringify({width:m.width,height:m.height,format:m.format,space:m.space})); if(!m.width||!m.height||m.width<1536||m.height<1024) process.exit(1)})"
```

Expected: pelo menos `1536 × 1024`, formato raster válido e proporção próxima de `3:2`.

- [ ] **Step 5: Mostrar a prévia ao usuário**

Apresente original e candidato, abra a home local com a versão candidata apenas depois da integração temporária e solicite aprovação visual antes do commit da implementação.

### Task 2: Integrar com TDD sem alterar a Biografia

**Files:**
- Create: `public/sites/serginho-barbosa/editorial/hero-serginho-solo.webp`
- Modify: `public/sites/serginho-barbosa/hero-thumbs/palco.webp`
- Modify: `src/components/sites/serginho-barbosa/home-controls.test.tsx`
- Modify: `src/components/sites/serginho-barbosa/hero-carousel.tsx:9-24`

- [ ] **Step 1: Escrever o teste que falha**

Em `home-controls.test.tsx`, substitua a asserção simples da imagem inicial por:

```tsx
const openingImage = screen.getByRole("img", {
  name: "Serginho Barbosa cantando no palco sob luz roxa",
});
expect(openingImage).toBeVisible();
expect(openingImage).toHaveAttribute("src", expect.stringContaining("hero-serginho-solo.webp"));
```

- [ ] **Step 2: Executar o teste para confirmar RED**

Run:

```powershell
npm.cmd test -- src/components/sites/serginho-barbosa/home-controls.test.tsx
```

Expected: FAIL porque o `src` ainda contém `biografia-show.webp`.

- [ ] **Step 3: Otimizar o candidato aprovado como WebP dedicado**

Com `$generatedCandidatePath` ainda apontando para o arquivo aprovado, run:

```powershell
$env:HERO_CANDIDATE = $generatedCandidatePath
$env:HERO_OUTPUT = 'F:\RiegosDev\Landing Page Serginho\public\sites\serginho-barbosa\editorial\hero-serginho-solo.webp'
node -e "const sharp=require('sharp'); const input=process.env.HERO_CANDIDATE; const output=process.env.HERO_OUTPUT; sharp(input).rotate().toColourspace('srgb').webp({quality:88,effort:6,smartSubsample:true}).toFile(output).then(info=>console.log(JSON.stringify(info)))"
```

Expected: WebP sRGB legível, sem metadados extras e sem redimensionamento artificial.

- [ ] **Step 4: Regenerar a miniatura sem sobrescrita insegura**

Run:

```powershell
$env:HERO_OUTPUT = 'F:\RiegosDev\Landing Page Serginho\public\sites\serginho-barbosa\editorial\hero-serginho-solo.webp'
$env:HERO_THUMB_TMP = 'F:\RiegosDev\Landing Page Serginho\public\sites\serginho-barbosa\hero-thumbs\palco.next.webp'
node -e "const sharp=require('sharp'); sharp(process.env.HERO_OUTPUT).resize(96,96,{fit:'cover',position:'centre'}).webp({quality:80,effort:6,smartSubsample:true}).toFile(process.env.HERO_THUMB_TMP).then(info=>console.log(JSON.stringify(info)))"
Move-Item -LiteralPath $env:HERO_THUMB_TMP -Destination 'F:\RiegosDev\Landing Page Serginho\public\sites\serginho-barbosa\hero-thumbs\palco.webp' -Force
```

Expected: `palco.webp` com `96 × 96`, derivado da versão sem músicos.

- [ ] **Step 5: Apontar somente o primeiro slide ao novo asset**

Em `hero-carousel.tsx`, altere somente:

```tsx
image: "editorial/hero-serginho-solo.webp",
```

Mantenha `alt`, `visual`, `thumb`, textos e demais slides inalterados.

- [ ] **Step 6: Executar o teste para confirmar GREEN**

Run:

```powershell
npm.cmd test -- src/components/sites/serginho-barbosa/home-controls.test.tsx
```

Expected: todos os testes do arquivo passam.

- [ ] **Step 7: Confirmar que a fonte da Biografia não mudou**

Run:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'public\sites\serginho-barbosa\editorial\biografia-show.webp'
rg -n 'biografia-show\.webp' src/components/sites/serginho-barbosa/editorial-content.tsx
```

Expected: hash `387E67E451479B607CDF06049682F05E7D84E79CFECF725D4E41964D9A378349` e referência preservada na Biografia.

### Task 3: Verificar qualidade, responsividade e regressões

**Files:**
- Verify: `public/sites/serginho-barbosa/editorial/hero-serginho-solo.webp`
- Verify: `public/sites/serginho-barbosa/hero-thumbs/palco.webp`
- Verify: `src/components/sites/serginho-barbosa/hero-carousel.tsx`
- Verify: `src/components/sites/serginho-barbosa/home-controls.test.tsx`

- [ ] **Step 1: Conferir peso, resolução e arquivos alterados**

Run:

```powershell
Get-Item -LiteralPath 'public\sites\serginho-barbosa\editorial\hero-serginho-solo.webp','public\sites\serginho-barbosa\hero-thumbs\palco.webp' | Select-Object Name,Length
git status --short
git diff --check
```

Expected: hero visualmente limpa, peso preferencialmente até 509.698 bytes, thumbnail pequena e apenas os quatro arquivos de implementação alterados.

- [ ] **Step 2: Executar a suíte completa**

Run:

```powershell
npm.cmd test
```

Expected: todos os testes passam.

- [ ] **Step 3: Executar lint, TypeScript e build estático**

Run:

```powershell
$env:NEXT_STATIC_EXPORT='1'
$env:NEXT_PUBLIC_BASE_PATH='/serginho-preview'
npm.cmd run check
```

Expected: lint, typecheck e build aprovados, mantendo 39 páginas estáticas.

- [ ] **Step 4: Validar visualmente no navegador**

Inicie `npm.cmd run dev -- -p 3000` com `NEXT_PUBLIC_BASE_PATH=/serginho-preview`. Verifique a home em desktop e mobile: cantor intacto, nenhum músico/equipamento ao fundo, continuidade da luz, sem overflow, mesmo recorte e thumbnail coerente. Confirme também a foto original na rota `/biografia`.

- [ ] **Step 5: Obter aprovação do usuário antes do commit**

Deixe `http://127.0.0.1:3000/serginho-preview` aberto e aguarde a aprovação visual do usuário. Não faça push, merge ou deploy.

### Task 4: Registrar a implementação aprovada

**Files:**
- Commit: `public/sites/serginho-barbosa/editorial/hero-serginho-solo.webp`
- Commit: `public/sites/serginho-barbosa/hero-thumbs/palco.webp`
- Commit: `src/components/sites/serginho-barbosa/hero-carousel.tsx`
- Commit: `src/components/sites/serginho-barbosa/home-controls.test.tsx`

- [ ] **Step 1: Revisar o diff final**

Run:

```powershell
git diff --check
git diff -- src/components/sites/serginho-barbosa/hero-carousel.tsx src/components/sites/serginho-barbosa/home-controls.test.tsx
git status --short
```

Expected: somente os quatro arquivos aprovados e nenhum artefato temporário.

- [ ] **Step 2: Criar o commit após aprovação**

Run:

```powershell
git add -- 'public/sites/serginho-barbosa/editorial/hero-serginho-solo.webp' 'public/sites/serginho-barbosa/hero-thumbs/palco.webp' 'src/components/sites/serginho-barbosa/hero-carousel.tsx' 'src/components/sites/serginho-barbosa/home-controls.test.tsx'
git commit -m 'feat: destacar Serginho sozinho na hero'
```

Expected: commit criado no branch `feat/galeria-novos-albuns-2026`, sem push, merge ou deploy.
