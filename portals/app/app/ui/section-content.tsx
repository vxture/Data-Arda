"use client";

import {
  EmptyState,
  Icon,
  MetricCard,
  PageHeader,
  PageSection,
  PageStack,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  type IconName,
  type StatusBadgeTone,
} from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";
import { NAV_ITEMS } from "./nav-model";

/**
 * Per-section content (design data-arda: tpl-head + stat grid + tpl-block).
 * Composed from DS `PageHeader` + `MetricCard` + `PageSection` + `EmptyState`
 * with layout-only CSS. Visual meta (icon + accent tone per stat) lives in TS;
 * the localized, locale-specific text/values come from the message catalog via
 * `t.raw`, so real data can replace the sample values later without touching the
 * component (console-ui.md Phase 4).
 */

/** Accent tone for a stat card's icon chip. */
type StatTone = "brand" | "info" | "success" | "warning" | "danger";

interface StatMeta {
  readonly icon: IconName;
  readonly tone: StatTone;
}

/** A stat's footer key/value row. */
interface StatFoot {
  readonly k: string;
  readonly v: string;
  readonly danger?: boolean;
}

/** Localized stat content (from messages `section.<key>.stats[i]`). */
interface StatContent {
  readonly title: string;
  readonly value: string;
  readonly delta?: string;
  readonly dir?: "up" | "down";
  readonly hint?: string;
  readonly foot?: readonly StatFoot[];
}

interface SectionData {
  readonly description: string;
  readonly block: { readonly title: string; readonly sub: string };
  readonly stats: readonly StatContent[];
}

/** Icon + tone per stat, by section. Order matches the localized stats array. */
const SECTION_META: Record<string, readonly StatMeta[]> = {
  catalog: [
    { icon: "database", tone: "brand" },
    { icon: "star", tone: "info" },
    { icon: "plus", tone: "info" },
    { icon: "graph", tone: "success" },
  ],
  standards: [
    { icon: "list", tone: "brand" },
    { icon: "code", tone: "warning" },
    { icon: "success", tone: "success" },
    { icon: "plug", tone: "info" },
  ],
  quality: [
    { icon: "shield-check", tone: "success" },
    { icon: "list", tone: "brand" },
    { icon: "warning", tone: "warning" },
    { icon: "settings", tone: "info" },
  ],
  lineage: [
    { icon: "graph", tone: "brand" },
    { icon: "workflow", tone: "info" },
    { icon: "search", tone: "info" },
    { icon: "warning", tone: "warning" },
  ],
  security: [
    { icon: "shield-check", tone: "brand" },
    { icon: "key", tone: "warning" },
    { icon: "key", tone: "info" },
    { icon: "list", tone: "success" },
  ],
  services: [
    { icon: "api", tone: "brand" },
    { icon: "chart-bar", tone: "info" },
    { icon: "users", tone: "info" },
    { icon: "chart-bar", tone: "success" },
  ],
  dataDevelopment: [
    { icon: "workflow", tone: "brand" },
    { icon: "workflow", tone: "info" },
    { icon: "success", tone: "success" },
    { icon: "error", tone: "warning" },
  ],
};

export function SectionContent({ sectionKey }: { sectionKey: string }) {
  const tn = useTranslations("nav");
  const ts = useTranslations("section");
  const tph = useTranslations("placeholder");

  const navIcon: IconName = NAV_ITEMS.find((n) => n.key === sectionKey)?.icon ?? "cube";
  const meta = SECTION_META[sectionKey];
  const data = ts.raw<SectionData>(sectionKey);

  return (
    <PageStack>
      <PageHeader icon={navIcon} title={tn(sectionKey)} description={data?.description} />

      {data && meta && (
        <TooltipProvider>
          <div className="app-stat-grid">
            {data.stats.map((s, i) => {
              const m = meta[i];
              const tone: StatusBadgeTone = s.dir === "down" ? "danger" : "success";
              return (
                <MetricCard
                  key={i}
                  icon={
                    <span className="app-stat-ico" data-tone={m?.tone ?? "brand"}>
                      <Icon name={m?.icon ?? navIcon} size="sm" />
                    </span>
                  }
                  label={
                    <span className="app-stat-label">
                      {s.title}
                      {s.hint && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="app-stat-hint" aria-label={s.hint}>
                              <Icon name="info" size="sm" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>{s.hint}</TooltipContent>
                        </Tooltip>
                      )}
                    </span>
                  }
                  value={s.value}
                  trend={
                    s.delta ? (
                      <span className="app-stat-trend">
                        <Icon name={s.dir === "down" ? "arrow-down" : "arrow-up"} size="sm" />
                        {s.delta}
                      </span>
                    ) : undefined
                  }
                  trendTone={s.delta ? tone : undefined}
                  description={
                    s.foot && s.foot.length > 0 ? (
                      <span className="app-stat-foot">
                        {s.foot.map((f, j) => (
                          <span
                            key={j}
                            className={"app-stat-foot-item" + (f.danger ? " is-danger" : "")}
                          >
                            <small className="app-stat-foot-k">{f.k}</small>
                            <b className="app-stat-foot-v">{f.v}</b>
                          </span>
                        ))}
                      </span>
                    ) : undefined
                  }
                />
              );
            })}
          </div>
        </TooltipProvider>
      )}

      <PageSection title={data?.block.title} description={data?.block.sub}>
        <EmptyState
          title={
            <span className="app-empty-title">
              <Icon name={navIcon} size="sm" />
              {tph("title")}
            </span>
          }
          description={tph("description")}
        />
      </PageSection>
    </PageStack>
  );
}
