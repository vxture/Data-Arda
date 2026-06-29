"use client";

import { Button, MetricGrid, PageHeader, StatusBadge, type MetricGridItem } from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";
import { PIcon } from "../../ui/phosphor-icon";
import { DOMAINS, LEVEL_TONE, METHOD_COLOR, SERVICES, STATUS_META } from "./seed";

export default function ServicePage() {
  const t = useTranslations("service");

  const metrics: MetricGridItem[] = [
    { id: "online", label: t("metrics.online"), value: "248", trend: t("metrics.onlineTrend"), tone: "positive" },
    { id: "calls", label: t("metrics.calls"), value: "1.98M", trend: t("metrics.callsTrend"), tone: "positive" },
    { id: "p99", label: t("metrics.p99"), value: "96ms", trend: t("metrics.p99Trend"), tone: "positive" },
    { id: "sla", label: t("metrics.sla"), value: "99.93%" },
  ];

  return (
    <div className="screen">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
        actions={
          <>
            <Button variant="secondary">
              <PIcon name="book-open" /> {t("docs")}
            </Button>
            <Button>
              <PIcon name="plus" /> {t("publish")}
            </Button>
          </>
        }
      />

      <MetricGrid items={metrics} />

      <div className="service-grid">
        {SERVICES.map((s) => {
          const dom = DOMAINS[s.domain];
          const st = STATUS_META[s.status];
          return (
            <div className="service-card" key={s.id}>
              <div className="sc-top">
                <span className="sc-method" style={{ color: METHOD_COLOR[s.method] }}>
                  {s.method}
                </span>
                <StatusBadge tone={st.tone}>
                  <PIcon name={st.icon} /> {t("status." + s.status)}
                </StatusBadge>
              </div>
              <div className="sc-name">{s.name}</div>
              <div className="sc-path">{s.path}</div>
              <div className="sc-desc">{s.desc}</div>
              <div className="sc-tags">
                <span className="tag" style={{ color: dom.color }}>
                  <PIcon name={dom.icon} /> {t("domain." + s.domain)}
                </span>
                <StatusBadge tone={LEVEL_TONE[s.level]}>{t("level." + s.level)}</StatusBadge>
              </div>
              <div className="sc-stats">
                <div>
                  <span className="scs-val">{s.calls}</span>
                  <span className="scs-label">{t("stat.calls")}</span>
                </div>
                <div>
                  <span className="scs-val">{s.p99}ms</span>
                  <span className="scs-label">P99</span>
                </div>
                <div>
                  <span className="scs-val">{s.sla}%</span>
                  <span className="scs-label">SLA</span>
                </div>
                <div>
                  <span className="scs-val">{s.subs}</span>
                  <span className="scs-label">{t("stat.subs")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
