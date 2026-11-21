// @vitest-environment node

import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const siteCss = readFileSync(new URL("./site.css", import.meta.url), "utf8");

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getMainRule(selector: string) {
  const escapedSelector = escapeRegExp(selector);
  const match = siteCss.match(
    new RegExp(`(?:^|\\})\\s*${escapedSelector}\\s*\\{([^{}]*)\\}`),
  );

  if (!match) {
    throw new Error(`Bloco CSS principal ausente para o seletor ${selector}`);
  }

  return match[1];
}

function getNumericZIndex(selector: string) {
  const rule = getMainRule(selector);
  const match = rule.match(/(?:^|;)\s*z-index\s*:\s*(-?\d+)\s*(?:;|$)/);

  if (!match) {
    throw new Error(`z-index numérico ausente no seletor ${selector}`);
  }

  return Number(match[1]);
}

function findMediaBlock(condition: string) {
  const marker = `@media (${condition})`;
  const markerIndex = siteCss.indexOf(marker);

  if (markerIndex === -1) {
    return undefined;
  }

  const openBraceIndex = siteCss.indexOf("{", markerIndex + marker.length);
  let depth = 0;

  for (let index = openBraceIndex; index < siteCss.length; index += 1) {
    if (siteCss[index] === "{") {
      depth += 1;
    } else if (siteCss[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return siteCss.slice(openBraceIndex + 1, index);
      }
    }
  }

  throw new Error(`Bloco @media incompleto para ${condition}`);
}

function getRuleFromBlock(block: string, selector: string) {
  const escapedSelector = escapeRegExp(selector);
  const match = block.match(
    new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`),
  );

  if (!match) {
    throw new Error(`Regra ausente para o seletor ${selector}`);
  }

  return match[1];
}

it("mantém o submenu desktop contido e acima dos contatos", () => {
  const subnav = getMainRule(".sb-subnav");
  const headerZIndex = getNumericZIndex(".sb-header");
  const floatZIndex = getNumericZIndex(".sb-float");
  const backdropZIndex = getNumericZIndex(".sb-menu-backdrop");

  expect.soft(subnav).toMatch(
    /(?:^|;)\s*max-height\s*:\s*calc\([^)]*100dvh[^)]*\)\s*;/,
  );
  expect.soft(subnav).toMatch(/(?:^|;)\s*overflow-y\s*:\s*auto\s*;/);
  expect.soft(subnav).toMatch(/(?:^|;)\s*right\s*:\s*0\s*;/);
  expect.soft(subnav).toMatch(/(?:^|;)\s*left\s*:\s*auto\s*;/);
  expect.soft(headerZIndex).toBeGreaterThan(floatZIndex);
  expect.soft(headerZIndex).toBeLessThan(backdropZIndex);
});

it("troca o menu principal em 1100px sem antecipar o menu do banner", () => {
  const headerBreakpoint = findMediaBlock("max-width: 1100px");
  const bannerBreakpoint = findMediaBlock("max-width: 960px");

  expect(headerBreakpoint).toBeDefined();
  expect(bannerBreakpoint).toBeDefined();

  if (!headerBreakpoint || !bannerBreakpoint) {
    return;
  }

  expect.soft(getRuleFromBlock(headerBreakpoint, ".sb-header-inner")).toMatch(
    /(?:^|;)\s*min-height\s*:\s*66px\s*;/,
  );
  expect.soft(getRuleFromBlock(headerBreakpoint, ".sb-desktop-nav")).toMatch(
    /(?:^|;)\s*display\s*:\s*none\s*;/,
  );
  expect.soft(getRuleFromBlock(headerBreakpoint, ".sb-menu-trigger")).toMatch(
    /(?:^|;)\s*display\s*:\s*inline-flex\s*;/,
  );

  const bannerSelectors = [
    '.sb-inner-banner:has(.sb-banner-links[data-open="true"])',
    ".sb-banner-links-trigger",
    ".sb-banner-links ul",
    '.sb-banner-links[data-open="false"] ul',
    ".sb-banner-links li",
    ".sb-banner-links a",
    ".sb-banner-links a:hover",
  ];

  for (const selector of bannerSelectors) {
    expect.soft(getRuleFromBlock(bannerBreakpoint, selector)).toBeTruthy();
    expect.soft(headerBreakpoint).not.toContain(`${selector} {`);
  }
});
