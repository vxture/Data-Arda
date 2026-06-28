# Arda - Console UI Framework

Design specification for the arda destination app shell, derived strictly from
the Claude Design project `vxture-data-arda` (file `data-arda.html`). This doc is
the contract between the imported design and `@vxture/design-system` (DS). It is
written before implementation: code follows this doc, not the other way around.

> Status: CONFIRMED (strategy). Phase 1 ready to build; no code yet.
> Confirmed decisions: gaps are app-composed now from DS atoms (DS extensions
> proposed as follow-ups), and icons use the nearest DS `Icon` now (exact glyphs
> proposed to DS later). See section 4 and the icon map in section 8.

## 1. Source of truth

- Design project: `claude.ai/design/p/1e8574d8-...` -> `data-arda.html`.
- The HTML is a thin React-UMD loader. The real design lives in:
  - `vx/app/shell.jsx` - Header, Sidebar, Assistant, Drawer.
  - `vx/app/main-template.jsx` - App root, navigation/board/app data, page
    scaffold (`PlaceholderScreen`, `StatCard`).
  - `vx/app/ui.jsx`, `vx/_shell.css`, `vx/app/app.css`, `vx/tokens-*.css` -
    primitives and styling.
- The design names the product "智能数据中台" (smart data platform): a data
  asset / governance / service console with an embedded AI assistant ("Varda").

### Translation and ASCII policy

The design UI is entirely Chinese. Per repo standards, source/doc paths stay
ASCII. Therefore:

- All user-facing strings become i18n message keys; the Chinese text lives only
  in `portals/app/messages/zh-CN.json` (and English in `en-US.json`). This doc
  refers to strings by intent, not by literal glyphs.
- This doc, component code, and CSS contain ASCII only.

## 2. Framework architecture

The shell is a CSS-grid app frame with four regions plus two overlays. It
replaces the current minimal `Shell` in `portals/app/app/ui/shell.tsx`.

```
+--------------------------------------------------------------+
| Header (.vxh)  launcher | brand+plan | search | agent | sys  |
+-----------+--------------------------------------+-----------+
| Sidebar   | Content (scroll)                     | Assistant |
| (nav      |   PageHeader                         | (Varda,   |
|  groups,  |   MetricGrid (stat cards)            |  optional,|
|  footer   |   PageSection / block                |  narrow/  |
|  metric)  |                                      |  wide/full|
+-----------+--------------------------------------+-----------+
| Footer (legal)                                               |
+--------------------------------------------------------------+
   Overlays: Launcher popover | User panel | Drawer (notifications/settings)
```

Shell state (mirrors the design): `nav-collapsed`, `assistant open + mode`
(narrow/wide/full), active section route, active functional domain (derived from
route), open drawer, open header popover. Persistence via `localStorage` as in
the design (`vxtpl_*` keys), scoped/renamed under an arda prefix.

### 2.1 Navigation model (from the design, styling is ours)

Sections (left nav, grouped):

- Group "overview": dashboard.
- Group "asset governance": catalog, standards, quality, lineage, security.
- Group "shared apps": service, etl.

Functional domains (launcher / header domain label) map routes to a domain:
asset, integration, govern, analyze, serve. The active domain is derived from
the active screen.

> Note: this is a richer navigation than today's five flat sections
> (`data-assets`, `integration`, `management`, `governance`, `services`). The
> route map and `messages/*.json` `nav` keys will be expanded to match the
> design's section set. Flagged as decision D7 below.

## 3. Design -> DS component mapping

DS exports are rich and cover most of the design. Mapping (DS names verified
against `@vxture/design-system@1.3.2`):

| Design element | DS primitive | Fit |
|---|---|---|
| App frame layout (`.app`, `.app-body`) | layout-only app CSS + `styles/console.css` | OK (layout CSS is not a DS-component duplicate) |
| Brand lockup (`.vxh-brand`) | `ShellBrand` | OK (already used) |
| Plan tag (`.vxh-brand-tag`) | `Badge` / `StatusBadge` | OK |
| Theme / locale / fullscreen toggles | `ShellThemeToggle`, `ShellLocaleSwitcher`, `ShellFullscreenToggle` | OK (already used) |
| Preferences (theme/lang/density/font) inside user panel | `ShellPreferencePanel` (as `ShellUserMenu` `settings` slot) | OK |
| User avatar + menu (`.vxh-user-panel`) | `ShellUserMenu` (`links`, `actions`, `statusTag`, `settings`) | OK; level/medal slots = gap (D5) |
| Header icon buttons: help/bell/settings | `ShellIconButton` | OK; bell unread badge = gap (D3) |
| Content page header (`.tpl-head`) | `PageHeader` (eyebrow/icon/title/description/actions) | OK |
| Stat grid + StatCard (`.statc-grid`, `.statc`) | `MetricGrid` / `MetricCard` (label/value/description/icon/trend/trendTone) | OK; footer k/v rows + hint tooltip = minor gap (D6) |
| Content section block (`.tpl-block`) | `PageSection` / `SectionCard` | OK |
| Empty/placeholder state (`.tpl-empty`) | `EmptyState` | OK (already used) |
| Legal footer | `ShellLegalFooter` | OK (already used) |
| Drawer: notifications / settings | `Drawer` (open/onClose/side/title/footer) | OK; list/rows are app content |
| Assistant bubbles (user/ai) | `AIAssistantBubble` | OK |
| Assistant input | `PromptInput` | OK |
| Assistant model badge | `ModelBadge` | OK |
| Assistant token/throughput meta | `TokenCounter`, `GenerationStream` | OK |
| Icons (Phosphor `ph-*`) | `Icon` (`IconName`) | MAJOR gap (D1) |
| Left nav (`.side-nav`, grouped, collapsible, rail, domain label) | `SectionNav` (flat) | gap (D2) |
| Sidebar footer metric card (`.side-foot-card`, progress bar) | `MetricCard` / `Card` | partial; progress bar = gap (D2) |
| Header search + cmd-K (`.vxh-search`) | none | gap (D4) |
| Launcher: app center / domain switcher (`.vxh-applauncher`, `.vxh-board-list`) | none (compose `Popover` + grid) | gap (D4) |
| Assistant panel container (header, resize narrow/wide/full, tool-call rows) | none (compose from AI atoms) | gap (D8) |
| TweaksPanel (`vx/tweaks-panel.jsx`) | drop | dev-only design tool, not product |

## 4. DS conflict register (decisions needed)

Per requirement: where the design and DS disagree, the resolution is yours.
`@vxture/design-system` is consumed as a published package
(`portals/node_modules`, `npm.pkg.github.com`); it has no source workspace in
this repo, so "extend DS" means a change in the DS package's own repo, landed
and republished, before arda can consume it.

CONFIRMED strategy (applies to every item below):

- Gaps are app-composed now from DS atoms (`Icon`, `Button`, `Card`, `Popover`,
  `Badge`, ...) plus layout-only CSS, so Phase 1 ships from this repo with
  `quality-gate` green. Each gap also becomes a DS extension proposal tracked as
  a follow-up.
- Icons use the nearest existing DS `Icon` now (visual drift accepted in the
  framework phase); the exact data-platform glyphs are proposed to the DS
  `iconDictionary` afterward. Mapping table in section 8.

- D1 - Icons. Design uses ~40 Phosphor glyphs across regular/bold/fill weights
  via CDN (`gauge`, `stack`, `ruler`, `seal-check`, `tree-structure`,
  `lock-key`, `broadcast`, `flow-arrow`, `sparkle`, `chart-line-up`,
  `crown-simple`, `medal`, `trend-up/down`, ...). DS `Icon` ships a curated set
  (~40 names with DS naming, e.g. `shield-check`, `squares-four`, `chart-bar`,
  `chevron-*`, `corners-in/out`, `sign-out`) that excludes nearly all of the
  data-platform glyphs, and forbids CDN/local icon assets via the DS guardrail.
  Options: (1) extend DS `iconDictionary` to add the needed glyphs (DS-pure,
  preferred by the guardrail; needs a DS release); (2) map each design glyph to
  the nearest existing DS icon (ships now, visual drift); (3) load Phosphor in
  the app (violates the DS guardrail). Recommended: (1), with (2) as a temporary
  bridge for Phase 1 only.

- D2 - Sidebar. `SectionNav` is flat (`items` + `activeKey`). The design needs
  grouped collapsible sections, a rail collapse with a domain label, and a
  footer metric card with a progress bar. Options: (1) extend DS `SectionNav`
  with optional groups/collapse/footer; (2) compose the sidebar in the app from
  DS atoms (`Icon`, `Button`, `MetricCard`) with layout-only CSS. Recommended:
  (2) for the framework now; propose (1) to DS afterward.

- D3 - Notification badge. `ShellIconButton` has no unread-count badge. Options:
  extend DS, or overlay a `Badge` in the app. Recommended: overlay `Badge` (no
  DS-duplicate selector), revisit DS later.

- D4 - Search + Launcher. No DS command-palette/search field and no DS app
  launcher/domain switcher. Recommended: defer search to a later phase (render a
  disabled affordance), and compose the launcher from `Popover` + grid + `Icon`
  in the app. Flag both as DS extension candidates.

- D5 - User level / medal slots. No DS primitive for the role/level/medal slot
  strip. Recommended: omit from Phase 1; reintroduce via DS extension or as an
  app-composed strip once entitlement data is wired.

- D6 - Stat card detail. `MetricCard` lacks the design's footer k/v rows and the
  info-hint tooltip. Recommended: render footer rows inside `MetricCard`
  `description`/`children` and use DS `Tooltip` for the hint; no new selectors.

- D7 - Navigation set. The design's sections (dashboard, catalog, standards,
  quality, lineage, security, service, etl) differ from today's five
  (`data-assets`, `integration`, `management`, `governance`, `services`).
  Recommended: adopt the design's set, update `SECTION_ROUTES` and the `nav`
  message keys. Confirm the route slugs.

- D8 - Assistant panel. DS ships AI atoms but no assembled, resizable assistant
  panel (header with `ModelBadge`, narrow/wide/full modes, tool-call rows).
  Recommended: compose the panel in the app from DS atoms with layout-only CSS;
  propose a DS `AssistantPanel` afterward. Tool-call row styling is app-local
  layout, not a DS-component duplicate.

- D9 - Brand assets. The design ships its own logo PNGs and an animated agent
  GIF (`vela-agent.gif`). Recommended: use DS/brand-provided assets
  (`ardaBrandCore`, DS brand layer); do not import the design's raster assets.
  Confirm the agent icon source (static DS icon vs a brand-provided animation).

## 4a. Subscription tiers (authoritative)

The product has FIVE subscription tiers, lowest to highest:

    free  <  starter  <  pro  <  business  <  enterprise

This supersedes both the design's plan tags (`free/pro/team/enterprise`) and the
repo's prior tier set (`free/pro/team/enterprise`). Each tier is a distinct
product with its own feature set and limits, and is maintained independently
(per-tier config, not a single shared flag). Consequences:

- `entitlement/types.ts`: `Tier` and `TIER_ORDER` become the five tiers above;
  `team` is removed. Tier rank/compare helpers are unchanged in shape.
- The header renders the active tier as a DS `Badge`/`StatusBadge` using the
  i18n tier label (`user.tier*`). P1 wires the badge + labels.
- Independent per-tier maintenance (feature matrix, limits, gating differences)
  is its own entitlement workstream, not P1. P1 only carries the type + labels
  so the shell renders correctly; the per-tier registry lands later.
- IdP contract: `accounts.vxture.com` must emit `plan`/`tier` values from this
  five-tier set in the `arda` access-token claim. `claims.ts` already maps any
  unknown tier to `free`, so the app degrades safely until the IdP aligns.
- Doc sync (DONE): the five-tier set is now reflected across `CLAUDE.md`,
  `README.md`, `.env.example`, `portals/app/.env.local.example`,
  `docs/design/{entitlement,decisions,identity-app-integration-standard}.md`, and
  `docs/specs/product.md`. `MOCK_TIER`/`MIN_TIER` defaults stay `pro` (still a
  valid tier). The per-tier feature matrix/registry remains a later workstream.

## 5. Phased delivery

Framework first, content later (requirement #3).

- Phase 0 (this doc): design spec + DS conflict register. CONFIRM before code.
- Phase 1: Shell framework. Header (brand, preferences, user menu, help/bell/
  settings icon actions), grouped left nav, content region with `PageHeader` +
  `EmptyState`, legal footer. Routing + i18n wired. No business data. Resolves
  D2, D3, D6 (compose), D7; D1 via nearest-icon bridge unless DS extended.
- Phase 2 (DONE - frame only): Assistant (Varda) panel. Header agent toggle in
  the shell opens a docked right panel with narrow/wide/full modes (wide collapses
  the nav; full overlays). Composed from DS AI atoms (`AIAssistantBubble`,
  `ModelBadge`, `PromptInput`) with layout-only CSS. The frame ships ONLY the
  container + a greeting bubble + a stubbed prompt input; the real conversation,
  tools, model, and submit handling are owned by the Varda build, which plugs
  into `app/ui/assistant.tsx`. Resolves D8.
- Phase 3 (DONE): Launcher (app center) + notifications drawer. The header
  app-grid button opens a DS `Popover` grid of subscribed apps (navigate / open
  Varda); the bell opens a DS `Drawer` (frame only - EmptyState until the alert
  feed + unread count are wired). Settings has NO drawer (per scope); the icon
  stays but is inert. Resolves D4 (launcher). The app set is the design's; a
  real per-tier subscription list replaces it in the entitlement workstream.
- Phase 4 (DONE - content framework): Per-section page content. A reusable
  `SectionContent` (app/ui/section-content.tsx) renders PageHeader + a stat grid
  (DS `MetricCard`, per-stat icon + accent tone) + a `PageSection` block over an
  EmptyState, for catalog/standards/quality/lineage/security/services/
  dataDevelopment (dashboard keeps the real overview surface). Visual meta
  (icon + tone) is in TS; localized text + sample values come from the message
  catalog via `t.raw`, so real data replaces the values without touching the
  component. Real per-section data is a later data-services workstream.
- Phase 4c (DONE): Stat footer rows + info-hint (D6 resolved). Each `MetricCard`
  now renders two footer key/value rows (with a danger accent) inside
  `description`, and an info-hint `Tooltip` next to the title (grid wrapped in a
  DS `TooltipProvider`). Values are the design's sample data via the message
  catalog, replaced by real data later.
- Phase 4b (DONE): Header search + user level slots. Search (D4) is a composed
  affordance (app/ui/search.tsx: search icon + borderless input + Ctrl/Cmd+K
  focus); the query is local state and the search backend is wired later. User
  level/medal slots (D5, app/ui/user-level.tsx) render in the user-menu `meta`:
  a lead medal + role/level/two-locked slots, driven by the session role and the
  tier rank (interim level mapping until a real level/achievement system exists).
  Remaining: stat footer rows + hint tooltip (D6), real search + level data.

## 6. Out of scope / dropped

- `TweaksPanel` and the `EDITMODE` defaults: a design-time tool, not product.
- React UMD + Babel-standalone runtime and CDN Phosphor: replaced by Next.js +
  DS.
- The design's hardcoded sample data (city-government dataset): replaced by i18n
  placeholders in Phase 1, real data in Phase 4.

## 7. Acceptance gates

Every phase must keep `quality-gate` green:

- `09-check-ds-usage.py --strict`: no raw colors, no local `--vx-*` tokens, no
  local fonts, no DS-component-duplicate selectors. App CSS is layout-only.
- `06-check-deploy-contracts.py`: ASCII-only in scanned source/doc paths.
- Portal type-check + production build of `@arda/app`.

## 8. Icon map (Phase 1, nearest DS Icon)

Per the confirmed D1 resolution, framework glyphs map to the nearest existing
DS `IconName`. DS `Icon` supports a `weight` prop, so the design's
regular/bold/fill weights map to `IconWeight` rather than separate names. Each
row also records the exact glyph to propose for the DS `iconDictionary` later.

Navigation / domains:

| Design (`ph-*`) | Intent | DS `IconName` | DS proposal |
|---|---|---|---|
| `gauge` | dashboard | `chart-bar` | `gauge` |
| `stack` | catalog | `database` | `stack` |
| `ruler` | standards | `list` | `ruler` |
| `seal-check` | quality | `shield-check` | `seal-check` |
| `tree-structure` | lineage | `graph` | `tree-structure` |
| `lock-key` | security | `key` | `lock-key` |
| `broadcast` | service | `api` | `broadcast` |
| `flow-arrow` | etl / dev | `workflow` | `flow-arrow` |
| `shield-check` | govern domain | `shield-check` | exact |
| `chart-line-up` | analyze domain | `chart-bar` | `chart-line-up` |

Shell chrome (header / sidebar / assistant / drawer / user menu):

| Design (`ph-*`) | Intent | DS `IconName` |
|---|---|---|
| `dots-nine` | launcher | `app-grid` |
| `magnifying-glass` | search | `search` |
| `question` | help | `help` |
| `bell` | notifications | `bell` |
| `gear-six` | settings | `settings` |
| `sparkle` (fill) | assistant mark / Varda | `agent` (accents `sparkles`) |
| `user` | profile row | `user` |
| `buildings` | tenant admin | `buildings` |
| `user-switch` | switch user | `user-switch` |
| `sign-out` | logout | `sign-out` |
| `caret-right` / `caret-down` | nav section toggle | `chevron-right` / `chevron-down` |
| `caret-double-up` / `caret-double-down` | collapse all | `caret-double-up` / `caret-double-down` |
| `text-indent` / `text-outdent` | rail collapse | `text-indent` / `text-outdent` |
| `info` | stat hint | `info` |
| `trend-up` / `trend-down` | metric delta | `arrow-up` / `arrow-down` |
| `arrow-up` | assistant send | `paperplane-tilt` |
| `arrow-line-left` / `arrow-line-right` | assistant widen | `arrow-left` / `arrow-right` |
| `corners-out` / `corners-in` | assistant full | `corners-out` / `corners-in` |
| `wrench` | tool-call row | `settings` |
| `x` | close | `x` |
| `checks` | mark all read | `check` |
| `arrow-square-out` | open in center | `arrow-long-right` |
| `caret-right` | row affordance | `chevron-right` |

Preference rows (theme/locale/density/font) are owned by DS
`ShellPreferencePanel`, which renders its own icons; no manual mapping needed.

Per-section content stat icons (`presentation-chart`, `plugs-connected`,
`seal-check`, `git-pull-request`, `warning`, ...) are Phase 4 content and map
under the same rules when those pages are built.
