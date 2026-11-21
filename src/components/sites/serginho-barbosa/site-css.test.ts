// @vitest-environment node

import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const siteCss = readFileSync(new URL("./site.css", import.meta.url), "utf8");

type CssRule = {
  selectors: string[];
  declarations: string;
  position: number;
  mediaConditions: string[];
};

type CssDeclaration = {
  value: string;
  important: boolean;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findClosingBrace(source: string, openingIndex: number) {
  let depth = 0;

  for (let index = openingIndex; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  throw new Error(`Bloco CSS incompleto a partir da posição ${openingIndex}`);
}

function splitSelectorList(value: string) {
  const selectors: string[] = [];
  let start = 0;
  let parentheses = 0;
  let brackets = 0;
  let quote: "\"" | "'" | undefined;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quote) {
      if (character === quote && value[index - 1] !== "\\") {
        quote = undefined;
      }
      continue;
    }

    if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === "(") {
      parentheses += 1;
    } else if (character === ")") {
      parentheses -= 1;
    } else if (character === "[") {
      brackets += 1;
    } else if (character === "]") {
      brackets -= 1;
    } else if (character === "," && parentheses === 0 && brackets === 0) {
      selectors.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  selectors.push(value.slice(start).trim());
  return selectors.filter(Boolean);
}

function parseCssRules(
  source: string,
  start = 0,
  end = source.length,
  mediaConditions: string[] = [],
): CssRule[] {
  const rules: CssRule[] = [];
  let cursor = start;

  while (cursor < end) {
    while (/\s/.test(source[cursor] ?? "")) {
      cursor += 1;
    }

    const openingIndex = source.indexOf("{", cursor);
    if (openingIndex === -1 || openingIndex >= end) {
      break;
    }

    const semicolonIndex = source.indexOf(";", cursor);
    if (semicolonIndex !== -1 && semicolonIndex < openingIndex) {
      cursor = semicolonIndex + 1;
      continue;
    }

    const closingIndex = findClosingBrace(source, openingIndex);
    const prelude = source.slice(cursor, openingIndex).trim();

    if (prelude.startsWith("@media")) {
      const condition = prelude.slice("@media".length).trim();
      rules.push(
        ...parseCssRules(source, openingIndex + 1, closingIndex, [
          ...mediaConditions,
          condition,
        ]),
      );
    } else if (prelude && !prelude.startsWith("@")) {
      rules.push({
        selectors: splitSelectorList(prelude),
        declarations: source.slice(openingIndex + 1, closingIndex),
        position: cursor,
        mediaConditions,
      });
    }

    cursor = closingIndex + 1;
  }

  return rules;
}

const parsedCss = siteCss.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
  " ".repeat(comment.length),
);
const cssRules = parseCssRules(parsedCss);

function getExactRules(selector: string, rules = cssRules) {
  return rules.filter((rule) => rule.selectors.includes(selector));
}

function getRulesAtMedia(selector: string, condition: string) {
  return getExactRules(selector).filter(
    (rule) =>
      rule.mediaConditions.length === 1 &&
      rule.mediaConditions[0] === condition,
  );
}

function getDeclarations(declarations: string, property: string) {
  const escapedProperty = escapeRegExp(property);
  const matches = declarations.matchAll(
    new RegExp(`(?:^|;)\\s*${escapedProperty}\\s*:\\s*([^;{}]+)(?:;|$)`, "g"),
  );

  return Array.from(matches, (match): CssDeclaration => {
    const rawValue = match[1].trim();

    return {
      value: rawValue.replace(/\s*!important\s*$/i, "").trim(),
      important: /\s*!important\s*$/i.test(rawValue),
    };
  });
}

function getDeclarationValues(declarations: string, property: string) {
  return getDeclarations(declarations, property).map(
    (declaration) => declaration.value,
  );
}

function getMainRule(selector: string) {
  const matches = getExactRules(selector).filter(
    (rule) => rule.mediaConditions.length === 0,
  );

  if (matches.length !== 1) {
    throw new Error(`Bloco CSS principal ausente para o seletor ${selector}`);
  }

  return matches[0].declarations;
}

function getNumericZIndex(selector: string) {
  const rule = getMainRule(selector);
  const match = rule.match(/(?:^|;)\s*z-index\s*:\s*(-?\d+)\s*(?:;|$)/);

  if (!match) {
    throw new Error(`z-index numérico ausente no seletor ${selector}`);
  }

  return Number(match[1]);
}

function mediaMatchesWidth(condition: string, width: number) {
  const maxWidths = Array.from(
    condition.matchAll(/\(\s*max-width\s*:\s*(\d+)px\s*\)/g),
    (match) => Number(match[1]),
  );
  const minWidths = Array.from(
    condition.matchAll(/\(\s*min-width\s*:\s*(\d+)px\s*\)/g),
    (match) => Number(match[1]),
  );

  return (
    maxWidths.every((maxWidth) => width <= maxWidth) &&
    minWidths.every((minWidth) => width >= minWidth)
  );
}

function getEffectiveDeclaration(
  selector: string,
  property: string,
  width: number,
  rules = cssRules,
) {
  let effectiveDeclaration: CssDeclaration | undefined;

  for (const rule of getExactRules(selector, rules)) {
    const mediaApplies = rule.mediaConditions.every((condition) =>
      mediaMatchesWidth(condition, width),
    );

    if (!mediaApplies) {
      continue;
    }

    for (const declaration of getDeclarations(rule.declarations, property)) {
      if (
        !effectiveDeclaration ||
        !effectiveDeclaration.important ||
        declaration.important
      ) {
        effectiveDeclaration = declaration;
      }
    }
  }

  return effectiveDeclaration?.value;
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

it("mantém a cascata móvel em 1100px e restaura o desktop em 1101px/1280px", () => {
  const headerCondition = "(max-width: 1100px)";
  const menuDisplayRules = getExactRules(".sb-menu-trigger").filter(
    (rule) => getDeclarationValues(rule.declarations, "display").length > 0,
  );
  const baseMenuRule = menuDisplayRules.find(
    (rule) => rule.mediaConditions.length === 0,
  );
  const mobileMenuRule = menuDisplayRules.find(
    (rule) =>
      rule.mediaConditions.length === 1 &&
      rule.mediaConditions[0] === headerCondition,
  );
  const navDisplayRules = getExactRules(".sb-desktop-nav").filter(
    (rule) => getDeclarationValues(rule.declarations, "display").length > 0,
  );
  const [mobileNavRule] = navDisplayRules;
  const headerInnerRules = getRulesAtMedia(
    ".sb-header-inner",
    headerCondition,
  );

  expect(menuDisplayRules).toHaveLength(2);
  expect(baseMenuRule).toBeDefined();
  expect(mobileMenuRule).toBeDefined();
  expect(navDisplayRules).toHaveLength(1);
  expect(headerInnerRules).toHaveLength(1);

  if (!baseMenuRule || !mobileMenuRule || !mobileNavRule) {
    return;
  }

  expect(getDeclarationValues(baseMenuRule.declarations, "display")).toEqual([
    "none",
  ]);
  expect(mobileMenuRule.mediaConditions).toEqual([headerCondition]);
  expect(
    getDeclarationValues(mobileMenuRule.declarations, "display"),
  ).toEqual(["inline-flex"]);
  expect(baseMenuRule.position).toBeLessThan(mobileMenuRule.position);
  expect(
    menuDisplayRules.filter(
      (rule) => rule.position > mobileMenuRule.position,
    ),
  ).toHaveLength(0);

  expect(mobileNavRule.mediaConditions).toEqual([headerCondition]);
  expect(
    getDeclarationValues(mobileNavRule.declarations, "display"),
  ).toEqual(["none"]);
  expect(
    navDisplayRules.filter((rule) => rule.position > mobileNavRule.position),
  ).toHaveLength(0);
  expect(
    getExactRules(".sb-desktop-nav").filter(
      (rule) =>
        rule.position > mobileNavRule.position &&
        rule.mediaConditions.some((condition) =>
          /\b(?:min|max)-width\b/.test(condition),
        ) &&
        getDeclarationValues(rule.declarations, "display").length > 0,
    ),
  ).toHaveLength(0);

  expect(
    getDeclarationValues(headerInnerRules[0].declarations, "min-height"),
  ).toEqual(["66px"]);
  expect(getEffectiveDeclaration(".sb-menu-trigger", "display", 1100)).toBe(
    "inline-flex",
  );
  expect(getEffectiveDeclaration(".sb-desktop-nav", "display", 1100)).toBe(
    "none",
  );

  for (const desktopWidth of [1101, 1280]) {
    expect(
      getEffectiveDeclaration(".sb-menu-trigger", "display", desktopWidth),
    ).toBe("none");
    expect(
      getEffectiveDeclaration(".sb-desktop-nav", "display", desktopWidth),
    ).toBeUndefined();
  }
});

it("preserva !important ao simular a cascata responsiva", () => {
  const importantRules = parseCssRules(`
    .sb-menu-trigger { display: none !important; }
    @media (max-width: 1100px) {
      .sb-menu-trigger { display: inline-flex; }
    }
  `);

  expect(
    getEffectiveDeclaration(
      ".sb-menu-trigger",
      "display",
      1100,
      importantRules,
    ),
  ).toBe("none");
});

it("mantém as declarações essenciais do dropdown do banner em 960px", () => {
  const bannerCondition = "(max-width: 960px)";
  const openBannerSelector =
    '.sb-inner-banner:has(.sb-banner-links[data-open="true"])';

  const bannerSelectors = [
    openBannerSelector,
    ".sb-banner-links-trigger",
    ".sb-banner-links ul",
    '.sb-banner-links[data-open="false"] ul',
    ".sb-banner-links li",
    ".sb-banner-links a",
    ".sb-banner-links a:hover",
  ];

  for (const selector of bannerSelectors) {
    expect(getRulesAtMedia(selector, bannerCondition)).toHaveLength(1);
    expect(getRulesAtMedia(selector, "(max-width: 1100px)")).toHaveLength(0);
  }

  const [triggerRule] = getRulesAtMedia(
    ".sb-banner-links-trigger",
    bannerCondition,
  );
  const [listRule] = getRulesAtMedia(".sb-banner-links ul", bannerCondition);
  const [closedListRule] = getRulesAtMedia(
    '.sb-banner-links[data-open="false"] ul',
    bannerCondition,
  );
  const [itemRule] = getRulesAtMedia(".sb-banner-links li", bannerCondition);
  const [linkRule] = getRulesAtMedia(".sb-banner-links a", bannerCondition);
  const [openBannerRule] = getRulesAtMedia(
    openBannerSelector,
    bannerCondition,
  );

  expect(getDeclarationValues(triggerRule.declarations, "display")).toEqual([
    "flex",
  ]);
  expect(getDeclarationValues(listRule.declarations, "position")).toEqual([
    "absolute",
  ]);
  expect(getDeclarationValues(listRule.declarations, "display")).toEqual([
    "grid",
  ]);
  expect(
    getDeclarationValues(closedListRule.declarations, "display"),
  ).toEqual(["none"]);
  expect(getDeclarationValues(itemRule.declarations, "max-width")).toEqual([
    "none",
  ]);
  expect(getDeclarationValues(linkRule.declarations, "width")).toEqual([
    "100%",
  ]);
  expect(getDeclarationValues(openBannerRule.declarations, "z-index")).toEqual([
    "3",
  ]);

  expect(
    getEffectiveDeclaration(".sb-banner-links-trigger", "display", 960),
  ).toBe("flex");
  expect(getEffectiveDeclaration(openBannerSelector, "z-index", 960)).toBe(
    "3",
  );

  for (const desktopWidth of [961, 1024, 1100]) {
    expect(
      getEffectiveDeclaration(
        ".sb-banner-links-trigger",
        "display",
        desktopWidth,
      ),
    ).toBe("none");
    expect(
      getEffectiveDeclaration(openBannerSelector, "z-index", desktopWidth),
    ).toBeUndefined();
  }
});
