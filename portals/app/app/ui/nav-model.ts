import type { IconName } from "@vxture/design-system";

/**
 * Console navigation model, derived from the data-arda design (see
 * docs/design/console-ui.md). The left nav is grouped; each item belongs to a
 * functional domain (used for the sidebar/header domain label and the future
 * launcher). All labels are i18n keys, not literals - the text lives in
 * portals/app/messages/*.json. Icons use the nearest DS Icon per the design doc
 * section 8 icon map.
 */

/** Functional domain a section belongs to. */
export type DomainKey =
  | "asset"
  | "integrate"
  | "govern"
  | "analyze"
  | "serve";

export interface NavItem {
  /** Stable key; also the i18n key under `nav.*`. */
  readonly key: string;
  /** Destination route. */
  readonly route: string;
  /** Nearest DS icon (design doc section 8). */
  readonly icon: IconName;
  /** Owning functional domain. */
  readonly domain: DomainKey;
}

export interface NavGroup {
  /** Stable key; also the i18n key under `nav.group.*`. */
  readonly key: string;
  readonly items: readonly NavItem[];
}

/** Grouped left navigation. dashboard reuses the existing real overview surface
 *  so DEFAULT_LANDING (/data-assets/overview) is preserved; the rest are
 *  placeholder surfaces until their content phase. */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    key: "overview",
    items: [
      { key: "dashboard", route: "/data-assets/overview", icon: "chart-bar", domain: "asset" },
    ],
  },
  {
    key: "assetGovernance",
    items: [
      { key: "catalog", route: "/catalog", icon: "database", domain: "asset" },
      { key: "standards", route: "/standards", icon: "list", domain: "govern" },
      { key: "quality", route: "/quality", icon: "shield-check", domain: "govern" },
      { key: "lineage", route: "/lineage", icon: "graph", domain: "analyze" },
      { key: "security", route: "/security", icon: "key", domain: "govern" },
    ],
  },
  {
    key: "sharedApps",
    items: [
      { key: "services", route: "/services", icon: "api", domain: "serve" },
      { key: "dataDevelopment", route: "/data-development", icon: "workflow", domain: "integrate" },
    ],
  },
];

/** Flattened items, in nav order. */
export const NAV_ITEMS: readonly NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

/** Ordered functional domains (launcher + domain label). */
export const DOMAIN_KEYS: readonly DomainKey[] = [
  "asset",
  "integrate",
  "govern",
  "analyze",
  "serve",
];

/** Resolve the active nav item from a pathname by longest matching route.
 *  Falls back to the first item (dashboard). */
export function activeItemFor(pathname: string | null): NavItem {
  const path = pathname ?? "/";
  let best: NavItem | null = null;
  for (const item of NAV_ITEMS) {
    if (path === item.route || path.startsWith(item.route + "/")) {
      if (!best || item.route.length > best.route.length) best = item;
    }
  }
  return best ?? NAV_ITEMS[0];
}
