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
