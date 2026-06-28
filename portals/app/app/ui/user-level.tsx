"use client";

import { Icon, type IconName } from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";

/**
 * User level / medal slots (design data-arda: 等级标识). A lead medal plus four
 * slots - role, level, and two locked medal placeholders - shown in the user
 * menu head (console-ui.md decision D5). Driven by real session data where
 * available: `role` from the session roles, `level` from the subscription tier
 * rank (interim, until a dedicated level/achievement system exists).
 */
interface Slot {
  readonly state: "role" | "level" | "locked";
  readonly icon: IconName;
  readonly title: string;
}

export function UserLevel({ role, level }: { role?: string; level: number }) {
  const t = useTranslations("user.level");
  const slots: Slot[] = [
    { state: "role", icon: "role", title: `${t("role")} · ${role || t("member")}` },
    { state: "level", icon: "star", title: `${t("level")} · L${level}` },
    { state: "locked", icon: "medal", title: t("locked") },
    { state: "locked", icon: "medal", title: t("locked") },
  ];
  return (
    <span className="app-userlevel">
      <Icon name="medal" size="sm" className="app-userlevel-lead" />
      <span className="app-userlevel-slots">
        {slots.map((s, i) => (
          <span key={i} className="app-userlevel-slot" data-state={s.state} title={s.title}>
            <Icon name={s.icon} size="sm" />
          </span>
        ))}
      </span>
    </span>
  );
}
