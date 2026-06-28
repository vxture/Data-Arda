"use client";

import { Drawer, EmptyState, Icon } from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";

/**
 * Notifications drawer (design data-arda: 消息中心). The header bell opens this
 * right-side DS `Drawer`. Frame only: the alert feed and unread count are wired
 * in a later phase, so the body shows an EmptyState until a feed exists. Note:
 * per the P3 scope, settings has NO drawer - only notifications.
 */
export function NotificationsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("notifications");
  return (
    <Drawer open={open} onClose={onClose} side="right" title={t("title")}>
      <EmptyState
        title={
          <span className="app-empty-title">
            <Icon name="bell" size="sm" />
            {t("emptyTitle")}
          </span>
        }
        description={t("emptyDescription")}
      />
    </Drawer>
  );
}
