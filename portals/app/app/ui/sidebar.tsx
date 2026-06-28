"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";
import { NAV_GROUPS, activeItemFor } from "./nav-model";

/**
 * Console sidebar (design data-arda): a rail with collapse toggle + active
 * functional-domain label, grouped collapsible navigation, and a footer metric
 * card. App-composed from DS `Icon` + layout-only CSS (DS `SectionNav` is flat;
 * see console-ui.md decision D2). Section group collapse is local; the whole
 * sidebar collapse (rail mode) is owned by the shell.
 */
export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const tn = useTranslations("nav");
  const td = useTranslations("domain");
  const ts = useTranslations("sidebar");
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const active = useMemo(() => activeItemFor(pathname), [pathname]);
  const toggleGroup = (key: string) =>
    setClosed((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className={"app-side" + (collapsed ? " is-collapsed" : "")}>
      <div className="app-side-rail">
        <button
          type="button"
          className="app-side-toggle"
          onClick={onToggle}
          title={collapsed ? ts("expand") : ts("collapse")}
          aria-label={collapsed ? ts("expand") : ts("collapse")}
        >
          <Icon name={collapsed ? "text-indent" : "text-outdent"} size="sm" />
        </button>
        {!collapsed && (
          <span className="app-side-domain" title={td(active.domain)}>
            {td(active.domain)}
          </span>
        )}
      </div>

      <nav className="app-side-nav" aria-label={tn("group.overview")}>
        {NAV_GROUPS.map((group) => {
          const isClosed = !!closed[group.key];
          return (
            <section key={group.key} className="app-nav-section">
              {!collapsed && (
                <button
                  type="button"
                  className="app-nav-section-trigger"
                  onClick={() => toggleGroup(group.key)}
                  aria-expanded={!isClosed}
                >
                  <span className="app-nav-section-title">{tn(`group.${group.key}`)}</span>
                  <Icon
                    name={isClosed ? "chevron-right" : "chevron-down"}
                    size="sm"
                    className="app-nav-section-caret"
                  />
                </button>
              )}
              {(collapsed || !isClosed) && (
                <div className="app-nav-items">
                  {group.items.map((item) => {
                    const isActive = item.key === active.key;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        className={"app-nav-item" + (isActive ? " is-active" : "")}
                        onClick={() => router.push(item.route)}
                        title={tn(item.key)}
                        aria-label={tn(item.key)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon name={item.icon} size="sm" />
                        <span className="app-nav-item-label">{tn(item.key)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="app-side-foot">
          <div className="app-side-metric">
            <div className="app-side-metric-top">
              <Icon name="shield-check" size="sm" />
              <span>{ts("metricTitle")}</span>
            </div>
            <div className="app-side-metric-bar">
              <span style={{ width: "96.8%" }} />
            </div>
            <div className="app-side-metric-caption">{ts("metricCaption")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
