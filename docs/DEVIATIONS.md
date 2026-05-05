# Deviations from Specification

This file records every decision that diverges from `srs.md`, `design_system.md`, `coding_standards.md`, or `ag_instructions.md`.
Format per `coding_standards.md §0`: date, section reference, decision, rationale.

---

## DEV-001 — Next.js 16 instead of Next.js 15

**Date:** 2026-05-05
**Spec section:** `ag_instructions.md §0.1`, `srs.md §2.1`
**Spec says:** Next.js 15.x
**What we did:** `pnpm create next-app@latest` installed Next.js 16.2.4 (latest stable at install time).
**Rationale:** The roadmap specifies `@latest` in the init command, which resolves to 16 at the time of install. Next.js 16 is backward-compatible for App Router usage. The upgrade was recorded here rather than pinning to 15 because using latest is what the command dictates and the API surface we depend on (App Router, Server Actions, Route Handlers) is stable across both versions.
**Impact:** None expected. Any API changes are caught by `pnpm typecheck`.

---

## DEV-002 — Tailwind 4 CSS-first configuration instead of `tailwind.config.ts`

**Date:** 2026-05-05
**Spec section:** `ag_instructions.md §0.9`, `design_system.md §9`
**Spec says:** `tailwind.config.ts` consuming CSS variables; Tailwind 3.4+
**What we did:** Next.js 16 ships with Tailwind 4.2.4 which uses CSS-first configuration via `@theme` in `globals.css` instead of `tailwind.config.ts`.
**Rationale:** Tailwind 4 dropped `tailwind.config.ts` in favor of the `@theme` directive in CSS. The design tokens are still exposed as CSS custom properties (identical to spec) and consumed by Tailwind via `@theme`. The end result — tokens as CSS variables usable in both Tailwind classes and raw CSS — is functionally equivalent.
**Impact:** Component classes use the same token names (e.g. `bg-charcoal-900`, `text-chiliz-red`). The hex values are NOT duplicated in any config — they live only in `tokens.css`.

---

## DEV-003 — `@fontsource/rajdhani` (non-variable) instead of `@fontsource-variable/rajdhani`

**Date:** 2026-05-05
**Spec section:** `ag_instructions.md §0.9`
**Spec says:** `pnpm add @fontsource-variable/rajdhani`
**What we did:** Installed `@fontsource/rajdhani` (individual weight files: 400, 500, 600, 700).
**Rationale:** `@fontsource-variable/rajdhani` does not exist on npm — Rajdhani is not a variable font (it has fixed weight axes). Using the standard weight-specific CSS imports achieves the same visual result.
**Impact:** None. All four weights used in the design system (400, 500, 600, 700) are imported individually.

---

## DEV-004 — `@google/genai` 1.x instead of unversioned

**Date:** 2026-05-05
**Spec section:** `ag_instructions.md §0.3`
**Spec says:** `pnpm add @google/genai` (no version pinned)
**What we did:** Installed `@google/genai@1.52.0` (latest stable).
**Rationale:** Latest stable at install time. Version recorded here per spec requirement to document installed versions.
**Impact:** None. Phase 6 (Gemini integration) will verify the API surface.

---

## DEV-005 — `proxy.ts` instead of `middleware.ts` (Next.js 16)

**Date:** 2026-05-05
**Spec section:** `ag_instructions.md §0.10`, `srs.md §10`
**Spec says:** Auth middleware stub in `src/middleware.ts`
**What we did:** Created `src/proxy.ts` with a `proxy` export.
**Rationale:** Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts` with a named `proxy` export. The runtime behavior is identical.
**Impact:** None. The route matching and redirect logic in Phase 1 will work identically.

---
