"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ShellLegalFooter } from "@vxture/design-system";
import { ardaBrandCore } from "@arda/shared/brand";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { Assistant, type AssistantMode } from "./assistant";

/** Element the (future) fullscreen toggle expands; the page root carries this id. */
const PAGE_FULLSCREEN_ID = "arda-page-root";
const NAV_COLLAPSE_KEY = "arda_nav_collapsed";
const ASSISTANT_OPEN_KEY = "arda_assistant_open";
const ASSISTANT_MODE_KEY = "arda_assistant_mode";

/**
 * App chrome (design data-arda): a fixed brand/header bar, a grouped left
 * sidebar with collapse, and a content column above the legal footer. All
 * primitives come from `@vxture/design-system`; this file only composes layout
 * and owns shell-level state (scroll glass, nav collapse).
 */
export function Shell({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>("narrow");

  useEffect(() => {
    try {
      setNavCollapsed(localStorage.getItem(NAV_COLLAPSE_KEY) === "1");
      setAssistantOpen(localStorage.getItem(ASSISTANT_OPEN_KEY) === "1");
      const m = localStorage.getItem(ASSISTANT_MODE_KEY);
      if (m === "narrow" || m === "wide" || m === "full") setAssistantMode(m);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const setNavCollapsedPersisted = (next: boolean) =>
    setNavCollapsed(() => {
      try {
        localStorage.setItem(NAV_COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* storage unavailable */
      }
      return next;
    });

  const toggleNav = () => setNavCollapsedPersisted(!navCollapsed);

  const persistAssistant = (open: boolean, mode: AssistantMode) => {
    try {
      localStorage.setItem(ASSISTANT_OPEN_KEY, open ? "1" : "0");
      localStorage.setItem(ASSISTANT_MODE_KEY, mode);
    } catch {
      /* storage unavailable */
    }
  };

  const toggleAssistant = () =>
    setAssistantOpen((o) => {
      const next = !o;
      persistAssistant(next, assistantMode);
      return next;
    });

  const openAssistant = () => {
    setAssistantOpen(true);
    persistAssistant(true, assistantMode);
  };

  const closeAssistant = () => {
    setAssistantOpen(false);
    setAssistantMode("narrow");
    persistAssistant(false, "narrow");
  };

  // Widening collapses the nav to give the assistant room (design parity).
  const toggleAssistantWide = () =>
    setAssistantMode((m) => {
      const next: AssistantMode = m === "wide" ? "narrow" : "wide";
      if (next === "wide") setNavCollapsedPersisted(true);
      persistAssistant(true, next);
      return next;
    });

  const toggleAssistantFull = () =>
    setAssistantMode((m) => {
      const next: AssistantMode = m === "full" ? "narrow" : "full";
      persistAssistant(true, next);
      return next;
    });

  const rootClass =
    "app-page" +
    (navCollapsed ? " nav-collapsed" : "") +
    (assistantOpen ? " assistant-open assistant-" + assistantMode : "");

  return (
    <div id={PAGE_FULLSCREEN_ID} className={rootClass}>
      <header className={"app-header" + (isScrolled ? " is-scrolled" : "")}>
        <Header
          assistantOpen={assistantOpen}
          onToggleAssistant={toggleAssistant}
          onOpenAssistant={openAssistant}
        />
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <Sidebar collapsed={navCollapsed} onToggle={toggleNav} />
        </aside>

        <main className="app-main">{children}</main>

        {assistantOpen && (
          <Assistant
            mode={assistantMode}
            onClose={closeAssistant}
            onToggleWide={toggleAssistantWide}
            onToggleFull={toggleAssistantFull}
          />
        )}
      </div>

      <ShellLegalFooter
        className="app-footer"
        innerClassName="app-footer-inner"
        copyright={ardaBrandCore.copyright}
        links={ardaBrandCore.legalLinks.map(([label, href]) => ({ label, href }))}
      />
    </div>
  );
}
