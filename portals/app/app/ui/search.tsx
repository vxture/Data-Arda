"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@vxture/design-system";
import { useTranslations } from "@arda/shared/i18n";

/**
 * Header search (design data-arda: 搜索栏). Composed affordance - a search icon,
 * a borderless input, and a shortcut hint - since DS has no command-palette /
 * search-field primitive (console-ui.md decision D4). Ctrl/Cmd+K focuses it.
 * The query is local state; the actual search backend is wired in a later phase
 * (submit is a stub here).
 */
export function HeaderSearch() {
  const t = useTranslations("search");
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      className="app-search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        /* search backend wired in a later phase */
      }}
    >
      <Icon name="search" size="sm" className="app-search-ico" />
      <input
        ref={ref}
        type="search"
        className="app-search-input"
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <kbd className="app-search-kbd">{t("shortcut")}</kbd>
    </form>
  );
}
