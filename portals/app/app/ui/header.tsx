"use client";

import {
  Badge,
  ShellBrand,
  ShellIconButton,
  ShellUserMenu,
  StatusBadge,
  type ShellUserMenuUser,
  type StatusBadgeTone,
} from "@vxture/design-system";
import { useState } from "react";
import { useTranslations } from "@arda/shared/i18n";
import { ardaBrandCore } from "@arda/shared/brand";
import { useSession } from "./api";
import { Launcher } from "./launcher";
import { NotificationsDrawer } from "./notifications-drawer";
import { PreferencesMenu } from "./preferences-menu";
import { HeaderSearch } from "./search";
import { UserLevel } from "./user-level";
import { subscriptionFromClaim, tierRank, type ArdaClaim, type Tier } from "../entitlement/types";

const TIER_TONE: Record<Tier, StatusBadgeTone> = {
  free: "neutral",
  starter: "info",
  pro: "brand",
  business: "brand",
  enterprise: "success",
};

const TIER_KEY: Record<Tier, string> = {
  free: "tierFree",
  starter: "tierStarter",
  pro: "tierPro",
  business: "tierBusiness",
  enterprise: "tierEnterprise",
};

/**
 * Console header (design data-arda): brand + active plan tag on the left;
 * system actions (help / alerts / settings) and the account menu on the right.
 * Theme / language / density / font preferences live inside the account menu's
 * preferences panel, matching the design. All chrome is DS primitives; CSS is
 * layout-only. Header actions that open drawers (alerts, settings) are wired in
 * a later phase; in P1 they are present but inert.
 */
export function Header({
  assistantOpen = false,
  onToggleAssistant,
  onOpenAssistant,
}: {
  assistantOpen?: boolean;
  onToggleAssistant?: () => void;
  onOpenAssistant?: () => void;
}) {
  const th = useTranslations("header");
  const tb = useTranslations("brand");
  const tu = useTranslations("user");
  const ta = useTranslations("assistant");
  const { session } = useSession();
  const [notifOpen, setNotifOpen] = useState(false);

  const sessionUser = session?.authenticated ? session.user : null;
  const claim = sessionUser?.ardaClaim ?? null;
  const plan = planTag(claim, tu);

  const level = claim ? tierRank(subscriptionFromClaim(claim).tier) + 1 : 1;
  const role = sessionUser?.roles?.[0];

  const menuUser: ShellUserMenuUser | null = sessionUser
    ? {
        displayName: sessionUser.displayName || sessionUser.username || sessionUser.email,
        uniqueLine: sessionUser.email,
        avatarSrc: sessionUser.avatarUrl || undefined,
        avatarFallback: (sessionUser.displayName || sessionUser.email).slice(0, 2).toUpperCase(),
        statusTag: buildStatusTag(claim, tu),
        meta: <UserLevel role={role} level={level} />,
      }
    : null;

  return (
    <>
    <div className="app-header-inner">
      <div className="app-header-lead">
        <Launcher onOpenAssistant={onOpenAssistant} />
        <div className="app-brand-zone">
          <ShellBrand
            href={ardaBrandCore.siteUrl}
            label={
              <span className="app-brand-lockup">
                <span className="app-brand-name">{tb("name")}</span>
                <span className="app-brand-tag">{tb("tag")}</span>
              </span>
            }
          />
          {plan && (
            <StatusBadge tone={plan.tone} className="app-plan-tag">
              {plan.label}
            </StatusBadge>
          )}
        </div>
      </div>

      <HeaderSearch />

      <div className="app-header-actions" role="group" aria-label={th("display")}>
        {onToggleAssistant && (
          <ShellIconButton
            icon="agent"
            label={ta("open")}
            active={assistantOpen}
            onClick={onToggleAssistant}
            className="app-agent-btn"
          />
        )}
        <div className="app-action-group" role="group">
          <ShellIconButton icon="help" label={th("help")} onClick={noop} />
          <span className="app-bell">
            <ShellIconButton
              icon="bell"
              label={th("notifications")}
              active={notifOpen}
              onClick={() => setNotifOpen(true)}
            />
            {NOTIF_COUNT > 0 && <Badge className="app-action-badge">{NOTIF_COUNT}</Badge>}
          </span>
          <ShellIconButton icon="settings" label={th("settings")} onClick={noop} />
        </div>

        {menuUser && (
          <ShellUserMenu
            user={menuUser}
            openLabel={tu("openMenu")}
            align="end"
            settings={<PreferencesMenu />}
            links={[
              { key: "profile", label: tu("profile"), href: "/data-assets/overview", icon: "user" },
              { key: "tenant", label: tu("tenant"), href: "/data-assets/overview", icon: "buildings" },
            ]}
            actions={[
              { key: "switch", label: tu("switchUser"), icon: "user-switch", onClick: noop },
              {
                key: "logout",
                label: tu("logout"),
                icon: "sign-out",
                onClick: () => {
                  window.location.assign("/auth/logout");
                },
              },
            ]}
          />
        )}
      </div>
    </div>
    <NotificationsDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}

/** Unread alert count. 0 until the alert feed is wired (frame phase). */
const NOTIF_COUNT: number = 0;

function noop(): void {
  /* settings has no drawer (P3 scope); help is wired in a later phase */
}

type TuFn = (key: string) => string;

/** Active plan tag shown next to the brand. trial/expired override the tier. */
function planTag(
  claim: ArdaClaim | null,
  tu: TuFn,
): { label: string; tone: StatusBadgeTone } | null {
  if (!claim) return null;
  if (claim.state === "trial") return { label: tu("tierTrial"), tone: "warning" };
  if (claim.state === "expired") return { label: tu("stateExpired"), tone: "danger" };
  const sub = subscriptionFromClaim(claim);
  if (sub.status === "none") return { label: tu("tierFree"), tone: "neutral" };
  return { label: tu(TIER_KEY[sub.tier]), tone: TIER_TONE[sub.tier] };
}

function buildStatusTag(
  claim: ArdaClaim | null,
  tu: TuFn,
): { label: string; verified: boolean } | undefined {
  if (!claim) return undefined;
  const { state } = claim;
  const sub = subscriptionFromClaim(claim);
  if (sub.status === "active") {
    return {
      label: state === "trial" ? tu("tierTrial") : tu(TIER_KEY[sub.tier]),
      verified: state === "subscribed",
    };
  }
  if (state === "expired") return { label: tu("stateExpired"), verified: false };
  return { label: tu("tierFree"), verified: false };
}
