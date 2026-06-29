/**
 * Static seed for Data Services (no DB yet). Generic intelligent data-platform
 * data APIs. Reuses DOMAINS + asset-meta helpers from the dashboard seed.
 */
import type { StatusBadgeTone } from "@vxture/design-system";
import type { AssetLevel } from "../dashboard/seed";
import type { PIconName } from "../../ui/phosphor-icon";

export { LEVEL_TONE, DOMAINS, type AssetLevel } from "../dashboard/seed";

export const METHOD_COLOR: Record<string, string> = {
  GET: "var(--vx-color-success-600)",
  POST: "var(--vx-color-info-600)",
};

export const STATUS_META: Record<string, { tone: StatusBadgeTone; icon: PIconName }> = {
  running: { tone: "success", icon: "play" },
  review: { tone: "warning", icon: "clock" },
  paused: { tone: "neutral", icon: "pause" },
};

export interface DataServiceEntry {
  id: string;
  name: string;
  path: string;
  method: "GET" | "POST";
  domain: string;
  level: AssetLevel;
  calls: string;
  p99: number;
  sla: number;
  subs: number;
  status: string; // running | review | paused
  desc: string;
}

export const SERVICES: DataServiceEntry[] = [
  { id: "API-1042", name: "Customer Verify", path: "/api/v2/customer/verify", method: "POST", domain: "customer", level: "core", calls: "482K", p99: 86, sla: 99.95, subs: 64, status: "running", desc: "Verify a customer by identifier and return a masked profile summary." },
  { id: "API-2087", name: "Org Lookup", path: "/api/v2/org/entity", method: "GET", domain: "finance", level: "internal", calls: "318K", p99: 112, sla: 99.92, subs: 53, status: "running", desc: "Look up an organization's registration and status by unified identifier." },
  { id: "API-3310", name: "Geocode", path: "/api/v2/geo/geocode", method: "GET", domain: "operations", level: "public", calls: "1.2M", p99: 64, sla: 99.99, subs: 88, status: "running", desc: "Forward and reverse geocoding against the standard address library." },
  { id: "API-4521", name: "Risk Score", path: "/api/v2/risk/score", method: "POST", domain: "customer", level: "core", calls: "96K", p99: 148, sla: 99.8, subs: 21, status: "review", desc: "Return a customer risk score; requires approval before invocation." },
  { id: "API-5093", name: "Realtime Heatmap", path: "/api/v2/web/heatmap", method: "GET", domain: "web", level: "sensitive", calls: "642K", p99: 92, sla: 99.9, subs: 37, status: "running", desc: "Aggregated realtime activity heatmap, refreshed every 5 minutes." },
  { id: "API-6320", name: "Inventory Report", path: "/api/v2/ops/report", method: "POST", domain: "operations", level: "internal", calls: "54K", p99: 134, sla: 99.85, subs: 14, status: "paused", desc: "Submit and retrieve inventory reconciliation reports." },
];
