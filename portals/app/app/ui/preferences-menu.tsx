"use client";

import { useState } from "react";
import { ShellPreferencePanel, useTheme, type ShellPreferenceLabels } from "@vxture/design-system";
import type { Locale } from "@vxture/shared";
import { useLocale } from "@arda/shared/locale-provider";
import { useTranslations } from "@arda/shared/i18n";
import { ARDA_LOCALE_OPTIONS } from "@arda/shared/locales";
import {
  getFontSize,
  persistDensity,
  persistFontSize,
  persistLocale,
  persistTheme,
  type PrefFontSize,
  type PrefTheme,
} from "@arda/shared/preferences";

/**
 * Preferences surface rendered inside the user menu (design: theme / language /
 * density / font size). Pure DS `ShellPreferencePanel`; this only sources the
 * current values from the DS theme context + locale provider + font-size pref
 * and persists each change across subdomains.
 */
export function PreferencesMenu() {
  const tp = useTranslations("user.prefs");
  const { mode, setMode, density, setDensity } = useTheme();
  const { locale, setLocale } = useLocale();
  const [fontSize, setFontSizeState] = useState<PrefFontSize>(() => getFontSize());

  const labels: ShellPreferenceLabels = {
    title: tp("title"),
    theme: tp("theme"),
    locale: tp("language"),
    density: tp("density"),
    fontSize: tp("fontSize"),
    themeOptions: { system: tp("themeSystem"), light: tp("themeLight"), dark: tp("themeDark") },
    densityOptions: {
      compact: tp("densityCompact"),
      default: tp("densityDefault"),
      comfortable: tp("densityComfortable"),
    },
    fontSizeOptions: { small: tp("fontSmall"), default: tp("fontDefault"), large: tp("fontLarge") },
  };

  return (
    <ShellPreferencePanel
      locale={locale as Locale}
      localeOptions={ARDA_LOCALE_OPTIONS}
      theme={mode}
      density={density}
      fontSize={fontSize}
      labels={labels}
      showDensity
      showFontSize
      onLocaleChange={(next) => {
        setLocale(next);
        persistLocale(next);
      }}
      onThemeChange={(next) => {
        setMode(next);
        persistTheme(next as PrefTheme);
      }}
      onDensityChange={(next) => {
        setDensity(next);
        persistDensity(next);
      }}
      onFontSizeChange={(next) => {
        setFontSizeState(next);
        persistFontSize(next);
      }}
    />
  );
}
