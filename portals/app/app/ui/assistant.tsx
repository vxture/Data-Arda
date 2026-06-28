"use client";

import { useState } from "react";
import {
  AIAssistantBubble,
  Icon,
  ModelBadge,
  PromptInput,
  ShellIconButton,
} from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";

/** Assistant resize state, mirroring the design (narrow / wide / full). */
export type AssistantMode = "narrow" | "wide" | "full";

/** Model id shown in the panel badge. The real model + conversation are owned by
 *  the Varda build; this is the design's placeholder id. */
const VARDA_MODEL = "claude-sonnet-4-5";

/**
 * Varda assistant panel - FRAME ONLY (console-ui.md decision D8). Composed from
 * DS AI atoms (AIAssistantBubble / ModelBadge / PromptInput) with layout-only
 * CSS: header (mark + title + model badge + resize/close), a body that Varda
 * fills with the real thread, and a prompt footer. Input submit is a stub here;
 * the Varda build wires the conversation, tools, and model.
 */
export function Assistant({
  mode,
  onClose,
  onToggleWide,
  onToggleFull,
}: {
  mode: AssistantMode;
  onClose: () => void;
  onToggleWide: () => void;
  onToggleFull: () => void;
}) {
  const t = useTranslations("assistant");
  const [input, setInput] = useState("");
  const wide = mode === "wide";
  const full = mode === "full";

  return (
    <aside
      className={"app-assistant" + (wide ? " is-wide" : "") + (full ? " is-full" : "")}
      aria-label={t("title")}
    >
      <div className="app-assistant-hd">
        <span className="app-assistant-mark">
          <Icon name="agent" size="sm" />
        </span>
        <div className="app-assistant-id">
          <div className="app-assistant-title">
            <span>{t("title")}</span>
            <ModelBadge modelId={VARDA_MODEL} />
          </div>
          <div className="app-assistant-sub">{t("subtitle")}</div>
        </div>
        {!full && (
          <ShellIconButton
            icon={wide ? "arrow-right" : "arrow-left"}
            label={wide ? t("restore") : t("widen")}
            onClick={onToggleWide}
          />
        )}
        <ShellIconButton
          icon={full ? "corners-in" : "corners-out"}
          label={full ? t("exitFullscreen") : t("fullscreen")}
          onClick={onToggleFull}
        />
        <ShellIconButton icon="x" label={t("close")} onClick={onClose} />
      </div>

      <div className="app-assistant-body">
        {/* Varda fills the real conversation here; the greeting is the only
            scaffold content so the empty frame reads as the assistant surface. */}
        <AIAssistantBubble role="ai">{t("greeting")}</AIAssistantBubble>
      </div>

      <div className="app-assistant-ft">
        <PromptInput
          value={input}
          onChange={setInput}
          placeholder={t("inputPlaceholder")}
          submitLabel={t("send")}
          onSubmit={() => {
            /* Varda build wires submit -> conversation; no-op in the frame. */
          }}
        />
      </div>
    </aside>
  );
}
