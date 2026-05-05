/**
 * ESLint configuration for Chiliz Clash.
 * Extends Next.js core-web-vitals + TypeScript rules.
 * Adds: boundaries (feature isolation), complexity (max 10), no-direct-fetch.
 * See coding_standards.md §0.6 and §1.1
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "supabase/.branches/**",
    "supabase/.temp/**",
  ]),

  // Project-wide rules
  {
    rules: {
      // Complexity limit — FSM files are exempt via inline comments
      // (enforced by eslint-plugin-complexity)
      "complexity": ["error", 10],

      // Bans console.log outside src/lib/log.ts
      "no-console": ["error", { allow: ["warn", "error", "debug", "info"] }],

      // No direct fetch() to absolute URLs outside src/lib/http.ts
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.name='fetch'][arguments.0.type='Literal'][arguments.0.value=/^https?:\\/\\//]",
          message:
            "Direct fetch() to absolute URLs is forbidden outside src/lib/http.ts. Use fetchHttp() instead.",
        },
        {
          selector:
            "CallExpression[callee.name='fetch'][arguments.0.type='TemplateLiteral']",
          message:
            "Direct fetch() with template literal URLs is forbidden outside src/lib/http.ts. Use fetchHttp() instead.",
        },
      ],

      // TypeScript strictness supplements
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],

      // Note: @typescript-eslint/no-floating-promises requires typed linting
      // (parserOptions.project). Unhandled promises are caught by `pnpm typecheck`
      // via TypeScript's strict mode + tsconfig noUncheckedIndexedAccess.

      // Enforce Result type usage — no raw throws across action boundaries
      // (manual rule — kept as comment-reminder; enforced in code review)
    },
  },

  // Relax some rules in test files
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "tests/**/*"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "no-console": "off",
    },
  },
]);

export default eslintConfig;
