# Design System & Visual Manual
## Chiliz Clash: Live 1v1 Duels

**Vibe:** High-stakes Competitive Gaming. Dark, electric, dynamic.
**Reference moodboard:** fighting-game character select screens (Tekken 8, Street Fighter 6), esports broadcast overlays (Valorant Champions, LoL Worlds), high-end sports betting UIs (without the sleaze).

---

## 0. North star

Every screen should feel like the moment before a fight starts. There is always a clock ticking, a stake at risk, and an opponent on the other side of the glass. The UI is not "calm productivity software" — it is a stadium. The user should sit forward, not lean back.

That said: dark and intense ≠ illegible or hostile. Type contrast, hit areas, and motion durations are tuned for clarity. We earn the drama by being technically precise everywhere else.

---

## 1. Design tokens

All tokens live in `src/styles/tokens.css` as CSS custom properties and are consumed via Tailwind's `theme.extend`. AG must NOT hardcode hex values in components — only token references.

### 1.1 Color palette

```css
:root {
  /* Brand */
  --color-chiliz-red:        #FF0000;  /* Primary CTA, "fight", danger */
  --color-chiliz-red-hover:  #E60000;
  --color-chiliz-red-press:  #B80000;
  --color-chiliz-red-glow:   rgba(255, 0, 0, 0.45);

  /* Surfaces */
  --color-charcoal-900:      #0A0A0A;  /* App background */
  --color-charcoal-800:      #121212;  /* Cards, panels (secondary brand) */
  --color-charcoal-700:      #1A1A1A;  /* Elevated cards */
  --color-charcoal-600:      #232323;  /* Hover surfaces */
  --color-charcoal-500:      #2E2E2E;  /* Borders, dividers */
  --color-charcoal-400:      #3D3D3D;  /* Disabled fills */

  /* Text */
  --color-text-primary:      #FFFFFF;
  --color-text-secondary:    #B8B8B8;
  --color-text-tertiary:     #6F6F6F;
  --color-text-disabled:     #4A4A4A;
  --color-text-on-red:       #FFFFFF;

  /* Accent — Neon Cyan = "AI is thinking / arbitrating / live computation" */
  --color-cyan-500:          #00F0FF;
  --color-cyan-400:          #5CF6FF;  /* Hover */
  --color-cyan-glow:         rgba(0, 240, 255, 0.55);
  --color-cyan-dim:          #007885;  /* Inactive cyan elements */

  /* Accent — Gold = "Victory / claimed reward / achievement" */
  --color-gold-500:          #FFB800;
  --color-gold-400:          #FFD24A;  /* Highlight */
  --color-gold-glow:         rgba(255, 184, 0, 0.55);
  --color-gold-dim:          #7A5A00;

  /* Semantic */
  --color-success:           #00D67A;  /* Confirmation, "stake locked" */
  --color-warning:           #FF9F1C;  /* Timeout warning, low balance */
  --color-danger:            var(--color-chiliz-red);
  --color-info:              var(--color-cyan-500);

  /* Overlays */
  --overlay-modal:           rgba(0, 0, 0, 0.78);
  --overlay-scrim:           linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%);
}
```

**Use rules:**

- **Chiliz Red** is reserved. Primary CTAs only ("ENTER LOBBY", "ACCEPT DUEL", "STAKE NOW") and destructive confirmations ("FORFEIT"). Do not use red for ordinary chrome — it cheapens the moment.
- **Neon Cyan** marks anywhere the AI is doing work: the NLP parser pulse, the arbitrage spinner, the confidence ring on the resolution card. If the AI is idle, cyan is absent.
- **Gold** appears only at duel resolution for the winner, and on the user's lifetime victory count in their profile. Never gold for ordinary positive states (use `--color-success` for those).

### 1.2 Typography

Two typefaces, both variable, both self-hosted.

```css
:root {
  --font-display:  'Rajdhani', system-ui, sans-serif;  /* Headlines, scores, timers */
  --font-body:     'Inter', system-ui, sans-serif;     /* Everything else */
  --font-mono:     'JetBrains Mono', ui-monospace;     /* Stake amounts, IDs */
}
```

**Rajdhani** is a condensed, technical sans with an athletic edge. Used for:

- Duel titles ("FACE-OFF")
- Live scoreboard numerals (tabular figures enabled)
- Match minute counters
- Section headers within the duel page

**Inter** is for body, controls, and dialog. Variable weights 400/500/600/700.

#### Type scale

| Token | Size / Line | Weight | Letter-spacing | Use |
|---|---|---|---|---|
| `text-display-2xl` | 72px / 76px (Rajdhani) | 700 | -0.02em | Hero on landing only |
| `text-display-xl` | 56px / 60px (Rajdhani) | 700 | -0.02em | Score numerals on scoreboard |
| `text-display-lg` | 40px / 44px (Rajdhani) | 600 | -0.01em | Face-off card user names |
| `text-display-md` | 32px / 36px (Rajdhani) | 600 | 0.01em | Section headers |
| `text-display-sm` | 24px / 28px (Rajdhani) | 600 | 0.02em | Stake totals |
| `text-h1` | 28px / 34px (Inter) | 700 | -0.01em | Page titles |
| `text-h2` | 22px / 28px (Inter) | 700 | -0.01em | Card titles |
| `text-h3` | 18px / 24px (Inter) | 600 | 0 | Subheads |
| `text-body-lg` | 17px / 26px (Inter) | 400 | 0 | Long copy |
| `text-body` | 15px / 22px (Inter) | 400 | 0 | Default |
| `text-body-sm` | 13px / 18px (Inter) | 400 | 0 | Labels, captions |
| `text-mono-md` | 16px / 22px (JetBrains Mono) | 500 | 0 | Stake values |
| `text-mono-sm` | 13px / 18px (JetBrains Mono) | 500 | 0 | Match IDs, hashes |
| `text-overline` | 11px / 16px (Inter) | 600 | 0.12em UPPERCASE | Tags, status labels |

### 1.3 Spacing

4px base unit. Tokens: `space-1` through `space-16`. Tailwind uses these directly via `gap-2`, `p-4`, etc.

| Token | px |
|---|---|
| space-0 | 0 |
| space-1 | 4 |
| space-2 | 8 |
| space-3 | 12 |
| space-4 | 16 |
| space-5 | 20 |
| space-6 | 24 |
| space-8 | 32 |
| space-10 | 40 |
| space-12 | 48 |
| space-16 | 64 |
| space-20 | 80 |
| space-24 | 96 |

### 1.4 Radii

```css
--radius-sm:   4px;   /* Inputs, small chips */
--radius-md:   8px;   /* Buttons, default cards */
--radius-lg:   12px;  /* Major panels */
--radius-xl:   16px;  /* The Face-off Card */
--radius-pill: 9999px;
```

### 1.5 Elevation (shadows + glow)

We don't really do soft shadows on dark UI — they look muddy. Elevation is signalled by **borders + glow**.

```css
--elevation-0: none;
--elevation-1: 0 0 0 1px var(--color-charcoal-500);
--elevation-2: 0 0 0 1px var(--color-charcoal-500), 0 8px 24px rgba(0, 0, 0, 0.6);
--elevation-3: 0 0 0 1px var(--color-charcoal-500), 0 16px 48px rgba(0, 0, 0, 0.8);

/* State glows — apply to outline / box-shadow */
--glow-red:  0 0 0 1px var(--color-chiliz-red), 0 0 24px var(--color-chiliz-red-glow);
--glow-cyan: 0 0 0 1px var(--color-cyan-500),    0 0 24px var(--color-cyan-glow);
--glow-gold: 0 0 0 1px var(--color-gold-500),    0 0 32px var(--color-gold-glow);
```

### 1.6 Motion

```css
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out:      cubic-bezier(0.0, 0, 0.2, 1);
--ease-in:       cubic-bezier(0.4, 0, 1, 1);
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* Slight overshoot */

--dur-instant: 80ms;
--dur-fast:    160ms;   /* Hovers, button states */
--dur-base:    240ms;   /* Most transitions */
--dur-slow:    400ms;   /* Page-level entrance */
--dur-pulse:   1200ms;  /* Score pulse, AI "thinking" */
```

**Reduced motion:** when `prefers-reduced-motion: reduce`, durations collapse to `--dur-instant` for non-essential motion, and pulses become opacity-only (no scale).

---

## 2. Layout

### 2.1 Breakpoints

Mobile-first. The MVP is a responsive web app — most users will play on a phone while watching the match on TV.

| Token | Min width | Use |
|---|---|---|
| `sm` | 480px | Larger phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### 2.2 App shell

A persistent top bar (60px, charcoal-900, bottom border charcoal-500) and full-bleed content. No left sidebar — too much chrome for a dark, intense product.

Top bar contents (left → right):
1. Chiliz Clash wordmark (Rajdhani 600, 18px, white).
2. Current match pill (charcoal-800, shows score in mono, pulse on score change).
3. Right-aligned: SSU balance pill (charcoal-800, prefixed `⟁`), avatar menu.

### 2.3 Page templates

- **Lobby page**: hero — match face-off banner; below — stake selector + "Find Opponent" primary CTA; below — "Recent Duels" feed.
- **Duel page**: split layout. Top half: Face-off Card. Bottom half (mobile: scroll; desktop: side-by-side): Live Scoreboard + Challenge Status panel.
- **History page**: data table. Default sort by date desc.

---

## 3. Iconography

Use [Lucide](https://lucide.dev) icons exclusively. 1.5px stroke. Sized 16/20/24/32. Color inherits from `currentColor`. Never decorate icons with shadows.

Reserved icon mappings:
- ⚡ `Zap` — entering the lobby, "matchmaking active"
- 🛡️ `ShieldCheck` — stake escrowed
- 🤖 `Cpu` — AI arbitrage in progress (pair with cyan glow)
- 🏆 `Trophy` — win states (pair with gold glow)
- ❌ `X` — decline / void
- ⏱️ `Timer` — countdowns

---

## 4. Components

### 4.1 Button

Variants: `primary` (red), `secondary` (charcoal-700 fill, charcoal-500 border), `ghost` (text-only), `destructive` (red outline, white text).

Sizes: `sm` (32px), `md` (40px, default), `lg` (52px), `xl` (64px — used for the duel-page primary action only).

Properties:
- All buttons have a 1px inner highlight (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.08)`) to feel pressed-metal.
- `:hover` brightens fill by ~8%, never grows the button.
- `:active` darkens fill by ~10% and translates `1px` down.
- `:disabled` desaturates to charcoal-400 fill, text-disabled color, no pointer.
- `loading` swaps label for a 16px cyan spinner; button keeps its width (CSS `min-width: ${current}`).

```tsx
<Button variant="primary" size="lg" loading={isMatching}>
  ⚡ FIND OPPONENT
</Button>
```

### 4.2 Input / TextField

Charcoal-800 fill, charcoal-500 border. Focus = 2px cyan ring with `--glow-cyan`. Error = red ring.

The custom-challenge `<ChallengeInput>` (§4.6) is the special variant of this.

### 4.3 StakeChip

Pill that displays an amount + currency. Examples:

```
⟁ 50 SSU       (white text on charcoal-700, mono numerals)
$ARG 0.5       (charcoal-700 with team color underline)
```

Three sizes: sm (24h), md (32h), lg (44h, used in Face-off Card).

### 4.4 PresenceDot

A 10px circle, with the following states:

- `online`: solid `--color-success`, gentle 1.2s pulse opacity 1 → 0.6 → 1.
- `connecting`: solid `--color-cyan-500`, faster pulse.
- `offline`: solid `--color-text-tertiary`, no pulse.
- `disconnected_during_active`: solid `--color-warning`, no pulse, with tooltip "Opponent disconnected — duel resolves automatically".

### 4.5 Face-off Card (HERO COMPONENT)

This is the signature component. It anchors the duel page. Inspired by fighting-game character-select VS screens.

**Layout (desktop):**

```
┌────────────────────────────────────────────────────────────────┐
│  [SCRIM TOP — match info, ⏱ 67:42, score 1-1]                  │
│                                                                │
│   ┌────────────────┐         VS         ┌────────────────┐     │
│   │                │       (cyan        │                │     │
│   │   AVATAR_A     │       glyph,       │   AVATAR_B     │     │
│   │   @username_a  │       Rajdhani     │   @username_b  │     │
│   │   ⟁ 50 SSU     │       72px,        │   ⟁ 50 SSU     │     │
│   │                │       slow drift   │                │     │
│   │   ●online      │       horizontal)  │   ●online      │     │
│   └────────────────┘                    └────────────────┘     │
│                                                                │
│  [SCRIM BOTTOM — challenge text, status, primary CTA]          │
└────────────────────────────────────────────────────────────────┘
```

**Layout (mobile):** stacked, `AVATAR_A` on top, `VS` separator, `AVATAR_B` below.

**Visual spec:**

- Card background: full-bleed image of the match's stadium (provided by mock API), darkened with `--overlay-scrim`. If no image, fallback: `radial-gradient(ellipse at center, var(--color-charcoal-700), var(--color-charcoal-900))`.
- Avatar: 96px circular (mobile) / 128px (desktop). 2px border in user's chosen team color.
- Username: `text-display-lg` Rajdhani 600.
- "VS" glyph: `text-display-2xl` Rajdhani 700, color `--color-chiliz-red`, with subtle horizontal float animation (translate ±4px over 6s ease-in-out infinite). Replaced by 🤖 cyan-glowing during arbitrage, and 🏆 gold during resolution.
- Border: 1px charcoal-500. On state change, the entire card pulses its border color for 600ms (red → cyan → gold).
- Border radius: `--radius-xl`.

**States:**

| State | Background | VS color | CTA |
|---|---|---|---|
| `pending_proposal` | dim | red | A: "Propose challenge"; B: disabled "Waiting for proposal…" |
| `pending_acceptance` | dim | red | A: disabled "Awaiting opponent"; B: "Accept" + "Decline" |
| `active` | normal | red, livelier pulse | (no CTA — the scoreboard is the action) |
| `arbitrating` | slight cyan tint behind | cyan glow, 🤖 swap | disabled "Resolving…" with cyan spinner |
| `a_wins` | gold tint behind A's side | gold 🏆 | "Claim victory" (winner only) / dimmed for loser |
| `b_wins` | mirror of above | gold 🏆 | mirror |
| `voided` | grey | grey ✕ | "Refunded — Find another duel" |

### 4.6 Challenge Input (custom-NLP variant)

A composite component: textarea + AI validation strip + parsed-predicate preview.

```
┌────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Type your challenge…                                       │ │
│ │                                                            │ │
│ │ "Argentina will score in the next 10 minutes"              │ │
│ └────────────────────────────────────────────────────────────┘ │
│  240/240 chars                            [PARSE WITH AI →]    │
├────────────────────────────────────────────────────────────────┤
│ 🤖 cyan pulse · "Parsing your challenge…"                      │
├────────────────────────────────────────────────────────────────┤
│ ✅ Parsed: occurrence(goal, ARG, minutes 67–77)                │
│ Side A bets: YES  ·  Side B bets: NO                           │
│ [SEND TO OPPONENT]    [Edit]                                   │
└────────────────────────────────────────────────────────────────┘
```

**Visual states:**

- Idle: charcoal-800 bg, charcoal-500 border.
- Parsing: 1px cyan border with `--glow-cyan`, full-width 2px progress bar at top, indeterminate cyan pulse.
- Parsed (success): success-green left edge accent (4px), parsed predicate rendered in monospace, accept CTA primary red.
- Parse failed: red left edge accent, error message in `text-body-sm` red, retry CTA secondary.

**Critical:** the parsed predicate preview is rendered from the structured JSON — never from the user's raw text. This avoids prompt-injected text being shown back as if validated. See `coding_standards.md` §3.

### 4.7 Live Scoreboard

The scoreboard fuses two things: the actual football score and the predicate progress. It is the most-glanced component during the active phase.

**Anatomy (top → bottom):**

1. **Match strip** (40px tall): `home shortcode  HOME 1 — 1 AWAY  away shortcode`. Score numerals are `text-display-xl` Rajdhani tabular.
2. **Match minute** (`text-display-md`): `67:42`. Pulses cyan for 600ms each time the minute increments.
3. **Predicate progress strip** (full width, 8px tall):
   - For `count` and `comparison` predicates: a horizontal bar split A | B with the divider moving as events accrue.
   - For `occurrence` predicates: two outlined boxes side by side ("YES" / "NO") that flip-fill when the event happens or the window expires.
4. **Recent events feed** (last 5, max 80px tall, scrolls): each event a row with icon + minute + description. New events slide in from the top with `--ease-spring` 240ms, with a brief cyan flash on the row background that fades over 1s.

**Pulse animation (score change):**

```css
@keyframes score-pulse {
  0%   { transform: scale(1);    color: var(--color-text-primary); }
  20%  { transform: scale(1.18); color: var(--color-chiliz-red); text-shadow: 0 0 16px var(--color-chiliz-red-glow); }
  100% { transform: scale(1);    color: var(--color-text-primary); }
}
```

Duration 800ms, applied to the side that scored. Other side does not animate.

### 4.8 Toast

Bottom-right (desktop) / bottom-center (mobile). Charcoal-700 fill, 1px charcoal-500 border, accent left edge by severity color. 16px icon. Auto-dismiss 4s default, 8s for warnings, never auto-dismiss for `success` after duel resolution (user must close).

### 4.9 Modal

Used sparingly. `overlay-modal` backdrop. Modal panel: charcoal-800, `--elevation-3`, max-width 480px, radius `--radius-lg`. Always has an explicit close button. Pressing Esc closes.

### 4.10 EmptyState

Centered, 64px Lucide icon (charcoal-500), `text-h2` headline, `text-body` description, optional CTA. Used on lobby with no match selected, history with no duels, etc.

---

## 5. Critical screen specs

### 5.1 Lobby screen

```
TopBar (sticky)
─────────────────────────────────────────
[Match Face-off Banner — 240px, full width]
   ARGENTINA  vs  FRANCE       Live · 67:42
   1                  1
─────────────────────────────────────────
"Choose your stake"  (text-h2)

[StakeSelector]
  Tabs: SSU | Fan Token
  Quick chips: 25 / 50 / 100 / 250
  Custom amount input

[Primary CTA: ⚡ FIND OPPONENT, full-width on mobile]

If queued:
  [Searching state card]
  - Cyan-glowing spinner
  - Rajdhani timer counting up
  - "Looking for an opponent staking 50 SSU…"
  - Cancel link below

─────────────────────────────────────────
"Recent duels in this match" — 3 most recent public duels
```

### 5.2 Duel screen — pending_acceptance (User B's view)

```
TopBar
─────────────────────────────────────────
[Face-off Card — pending_acceptance state]
   timer pill top-right: 28s remaining
   CTAs: ACCEPT (red, lg) / Decline (ghost)
─────────────────────────────────────────
"Challenge proposed by @username_a"

[Predicate preview card]
  monospace rendering of the predicate
  "If a goal happens between minute 67 and 77,
   YOU win if you bet NO and they bet YES."
  Stake: ⟁ 50 SSU each · Total pot: ⟁ 100 SSU
─────────────────────────────────────────
"What if I disagree?"  (collapsible, text-body-sm)
  Inline explanation of how the AI arbitrates.
```

### 5.3 Duel screen — active

```
TopBar
─────────────────────────────────────────
[Face-off Card — active state, presence dots live]
─────────────────────────────────────────
[Live Scoreboard] (sticky on mobile)

[Predicate Status panel]
  Big visual: which side is currently winning
  Text: "Goal hasn't happened yet · 4:18 left"
  AI pre-arbitration confidence (only shown if window closed)
─────────────────────────────────────────
[Match event feed]
```

### 5.4 Duel screen — resolution

```
[Face-off Card — gold tint on winner's side, 🏆 swap]
[Resolution card]
  "@username_a won this duel"
  "+100 SSU credited to your balance"  (winner)
  "AI confidence: 0.94"
  Reasoning excerpt: <monospace block>
  CTAs: "Find next duel" (primary red) · "Share result" (secondary)
```

---

## 6. Motion choreography

A short sequence of motion across the user journey — the rhythm of the product:

1. **Enter lobby**: button squashes 96% → 100% (`--ease-spring`, 200ms), then a cyan ring expands from the button (radial, 600ms, opacity 0.4 → 0).
2. **Match found**: the searching card crossfades into the Face-off Card over 320ms. Both avatars do a "rush in" — A from the left translating 32px → 0, B mirrored from the right, staggered 80ms.
3. **Challenge parsed (NLP)**: the cyan border on the input runs a sweep (linear-gradient mask 0 → 100%, 600ms), then the predicate preview slides in from below with `--ease-spring`.
4. **Stakes locked**: the stake chips on each side flip 180deg on the Y axis (CSS 3D, 320ms) revealing a shield icon underneath, then flip back. Subtle but communicates "locked".
5. **Goal occurs**: score pulse (§4.7) + a 200ms full-screen vignette flash (red, opacity 0.15 → 0). The flash is gated by `prefers-reduced-motion`.
6. **Arbitrage starts**: VS glyph in Face-off Card morphs (cross-fade) into 🤖, the entire card border transitions from red to cyan over 400ms. A 1.2s breathing pulse begins on the border-glow.
7. **Resolution**: cyan border crossfades to gold over 320ms. The losing side's avatar desaturates to 30% saturation. The winner's avatar gets a slow rotate-shimmer (gold gradient sweeps across it once over 1.6s, then settles).

All of these are skippable / collapsed under reduced-motion.

---

## 7. Accessibility

- WCAG AA contrast minimums on all text: ≥ 4.5:1 for body, ≥ 3:1 for large text. The chosen palette satisfies this for white-on-charcoal-800 (15.8:1). Red-on-charcoal-800 is 4.91:1 — passes for body and large.
- All interactive elements have a visible focus state (cyan ring, 2px, offset 2px).
- Live regions: the score and predicate status updates use `aria-live="polite"`. Resolution announcement uses `aria-live="assertive"`.
- Color is never the only signal of state. Every state has an icon, text label, AND color.
- Targets ≥ 44×44px for primary actions on mobile.
- Animated content respects `prefers-reduced-motion`.
- Custom challenge input has a character counter announced via `aria-describedby`.

---

## 8. Copy voice

Concise, present-tense, second person. A bit aggressive — but never demeaning. We're a stadium announcer, not a sergeant.

✅ "Lock in your stake."
✅ "Your opponent is in. Fight."
✅ "AI is calling the result…"
❌ "Please confirm your stake amount." (too soft)
❌ "Loser. Try harder next time." (mean)

Numbers are always front-loaded: "50 SSU" not "stake of 50 Reward Points". Currency glyph (`⟁` for SSU, `$` for fan tokens) precedes the number with a hair-space.

Loading messages should be specific to what we're doing, never "Loading…":
- "Finding an opponent…"
- "Locking stakes…"
- "AI is reviewing the play…"
- "Crunching match data…"

---

## 9. Asset & implementation rules for AG

- All icons are imported from `lucide-react`. Never inline SVGs except for the wordmark and the cyan/gold "VS" glyph variants.
- All animations live in `src/styles/animations.css` as keyframes. React components apply them via Tailwind classes (`animate-score-pulse`, etc.) — never via inline `style={{ animation: ... }}`.
- The Face-off Card MUST be its own component file (`src/components/duel/FaceOffCard.tsx`) and MUST be Storybook'd with all 7 states (§4.5) before being wired into the duel page.
- Tailwind config consumes the CSS custom properties via `theme.extend.colors.chiliz.red = 'var(--color-chiliz-red)'` etc. AG must not duplicate hex values in `tailwind.config.ts`.
- Storybook is required for: `Button`, `StakeChip`, `FaceOffCard`, `LiveScoreboard`, `ChallengeInput`. Other components are nice-to-have.
- A `<DesignSystemProvider />` wraps the app to inject font-loading link tags and CSS variable validation in dev mode.

---

## 10. Anti-patterns (forbidden)

- Light-mode anything. There is no light mode. If a designer raises it, defer post-MVP.
- Gradient-on-gradient backgrounds. Use one gradient maximum per surface.
- Drop shadows on text. Glow yes, drop shadow no.
- Emoji in headlines (the `🤖` and `🏆` swaps in the Face-off Card are deliberate and not "emoji decoration"; they're functional state indicators).
- Modal-stacked-on-modal. Maximum modal depth is 1.
- Tooltips that are critical to understanding the UI — anything important is in-content.
- "Glassmorphism" / blurred translucent panels. They do not belong in this product.
- Comic-Sans-tier sports clichés ("CRUSH IT", "GET IN THE GAME"). Confidence comes from precision, not shouting.
