"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, Popover, PopoverContent, PopoverTrigger, type IconName } from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";

/**
 * App-center launcher (design data-arda: 应用中心). The header dots/app-grid
 * button opens a popover grid of subscribed apps; selecting one navigates to its
 * route, or opens the Varda assistant. Composed from DS `Popover` + `Icon` with
 * layout-only CSS (console-ui.md decision D4). The app set follows the design;
 * a real per-tier subscription list replaces it in the entitlement workstream.
 */
interface LauncherApp {
  /** i18n name key: nav.<key> for surfaces, assistant.open for Varda. */
  readonly key: string;
  readonly icon: IconName;
  readonly route?: string;
  readonly opensAssistant?: boolean;
}

const APPS: readonly LauncherApp[] = [
  { key: "dashboard", icon: "chart-bar", route: "/data-assets/overview" },
  { key: "catalog", icon: "database", route: "/catalog" },
  { key: "quality", icon: "shield-check", route: "/quality" },
  { key: "services", icon: "api", route: "/services" },
  { key: "dataDevelopment", icon: "workflow", route: "/data-development" },
  { key: "varda", icon: "agent", opensAssistant: true },
];

export function Launcher({ onOpenAssistant }: { onOpenAssistant?: () => void }) {
  const tl = useTranslations("launcher");
  const tn = useTranslations("nav");
  const ta = useTranslations("assistant");
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const appName = (a: LauncherApp) => (a.opensAssistant ? ta("open") : tn(a.key));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={"app-launcher-btn" + (open ? " is-active" : "")}
        aria-label={tl("open")}
        title={tl("open")}
      >
        <Icon name="app-grid" size="sm" />
      </PopoverTrigger>
      <PopoverContent align="start" className="app-launcher">
        <div className="app-launcher-hd">
          <span className="app-launcher-title">{tl("title")}</span>
          <span className="app-launcher-sub">{tl("subscribed", { count: APPS.length })}</span>
        </div>
        <div className="app-launcher-grid">
          {APPS.map((a) => (
            <button
              key={a.key}
              type="button"
              className="app-launcher-app"
              onClick={() => {
                setOpen(false);
                if (a.opensAssistant) onOpenAssistant?.();
                else if (a.route) router.push(a.route);
              }}
            >
              <span className="app-launcher-ico">
                <Icon name={a.icon} size="sm" />
              </span>
              <span className="app-launcher-copy">
                <strong>{appName(a)}</strong>
                <small>{tl(`apps.${a.key}`)}</small>
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
